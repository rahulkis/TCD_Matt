import React, { useEffect, useState } from "react";
import { setPageTitle } from "../../utils/Common";
import Sidebar from "../../layouts/Sidebar";
import { toast } from "react-toastify";
import moment from "moment";
import Loader from "../../layouts/Loader";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { httpClient } from "../../constants/Api";
import { HOME, TCD_UPDATES, CONSUMERS } from "../../constants/AppConstant";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import Footer from "../../layouts/Footer";
import { useLocation } from "react-router-dom";
import { starAveRatings, dateRange, dateMonths } from '../../utils/Common'; 
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
    scales: {
      "x-axis-1": {
        display: true,
        gridLines: {
          display: false,
        },
      },
      "y-axis-1": {
        type: "linear",
        display: false,
        position: "left",
        ticks: {
          callback: function (value, index, ticks) {
            return "$" + value;
          },
        },
      },
    },
  },
};
const labels = ["January", "February", "March", "April", "May", "June", "July"];
export const data = {
  type: "line",
  labels,
  datasets: [
    {
      label: "Entries",
      data: [12, 19, 10, 3, 44, 255, 144, 32],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
  alignToPixels: true,
};
const lineDataConstructor = (data) => {
  var homeDataValues = [];
  var homeDataLabels = [];
  for (var i in data) { 
    homeDataValues.push(data[i].entries)
    homeDataLabels.push(data[i].monthyear)
  }
  return {
    type: "line",
    labels: homeDataLabels,
    datasets: [
      {
        label: "Entries",
        data: homeDataValues,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
    alignToPixels: true,
  };
}

function Home() {
  const loggedInUser = localStorage.getItem("partner");
  const parseData = JSON.parse(loggedInUser);
  const [homeData, setHomeData] = useState();
  const [homeGraphData, setHomePageGraphData] = useState();
  const [isLoading, setLoading] = useState(false);
  const [date, setDate] = useState(false);
  const [updates, setUpdates] = useState([]);
  const { pathname } = useLocation();
  const [next, setNext] = useState(3);
  const commentPerPage = 3;
  const [ratingAndCommentsData, setRatingAndCommentsData] = useState();
  const [commentsToShow, setCommentsToShow] = useState([]);
  useEffect(() => {
    setPageTitle("Home");
    getHomePageData();
    getUpdates();
    getHomePageGraphData();
    getRatingsAndCommentsData();
    window.scrollTo(0, 0);
  }, [pathname]);
  const getHomePageData = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(
        HOME.GET_COUNTS.replace("{userId}", parseData.id)
      );
      if (response.data.success) {
        setHomeData(response.data.data);
        setLoading(false);
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };
  const getHomePageGraphData = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(HOME.GET_HOME_GRAPH_DATA);
      if (response.data.success) {
        var graphDataRefactor = [];
        var graphData = response.data.data;
        var prevSixMonths = dateMonths(6).sort().reverse();
        for (var w = 0; w <= prevSixMonths.length; w++) {
          if (!!prevSixMonths[w]) {
            var prevSixMonthsKey = Object.keys(prevSixMonths[w])+'';
            var monthEntries = 0
            for (var graphKey in graphData) {
              if (prevSixMonthsKey === graphKey) {
                monthEntries = graphData[graphKey].entries
              }
            }
            graphDataRefactor.push({
              monthyear: prevSixMonthsKey,
              entries : monthEntries
            });
          }
        }
        setHomePageGraphData(graphDataRefactor);
        setLoading(false);
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };
  const getUpdates = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(TCD_UPDATES.GET_ALL);
      if (response.data.success) {
        setUpdates(response.data.data);
        setLoading(false);
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };
  const getRatingsAndCommentsData = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(CONSUMERS.GET_RATING_AND_REVIEWS_COMMENTS);
      setRatingAndCommentsData(response.data.data);
      const dataResponse = response.data.data;
      setCommentsToShow(dataResponse.slice(0, 3));
      setLoading(false);
    } catch (err) {
        return 'Something went wrong';
    }
  };
  const loopWithSlice = () => {
    const toShow = ratingAndCommentsData.slice(
      commentsToShow.length,
      commentsToShow.length + commentPerPage
    );
    setCommentsToShow([...commentsToShow, ...toShow]);
  };
  const loadMoreRatingsAndReviews = () => {
    let loadedMore = next + commentPerPage;
    loopWithSlice(next, loadedMore);
    setNext(next + commentPerPage);
  }
  const paginateArray = (array, page_size, page_number) => {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }
  const  monthDiff = (dateFrom, dateTo) => {
    return dateTo.getMonth() - dateFrom.getMonth() + 
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
   }
   
  const handleDateChange = async (changeToDate) => {
    var date = new Date();
      var dateFrom, dateTo, lastMonth;
      if (changeToDate && changeToDate === '0') {
        setDate(changeToDate);
      } else {
        setDate(changeToDate);
        if (changeToDate === '1') { // This Month
          dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
          dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        } else if (changeToDate === '2') { // Last 30 Days
          dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate()-30);
          dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        } else if (changeToDate === '4') { // Last month
          dateFrom = new Date(date.getFullYear(), date.getMonth()-1, 1);
          dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          var lastMonth = dateFrom;
        } else if (changeToDate === '5') { // Last 3 months
          dateFrom = new Date(date.getFullYear(), date.getMonth()-3, 1);
          dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        } else if (changeToDate === '6') { // Last 6 months
          dateFrom = new Date(date.getFullYear(), date.getMonth()-6, date.getDate());
          dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        try {
          setLoading(true);
          const response = await httpClient.get(HOME.GET_HOME_GRAPH_DATA+'?entriesFrom='+dateFrom+'&entriesTo='+dateTo);
          if (response.data.success) {
            var graphDataRefactor = [];
            var graphData = response.data.data;
            var getMonths = !!lastMonth ? dateMonths(1, dateFrom) : dateMonths(monthDiff(dateFrom, dateTo), dateTo);
            var prevSixMonths = getMonths.sort().reverse();
            for (var w = 0; w <= prevSixMonths.length; w++) {
              if (!!prevSixMonths[w]) {
                var prevSixMonthsKey = Object.keys(prevSixMonths[w])+'';
                var monthEntries = 0
                for (var graphKey in graphData) {
                  if (prevSixMonthsKey === graphKey) {
                    monthEntries = graphData[graphKey].entries
                  }
                }
                graphDataRefactor.push({
                  monthyear: prevSixMonthsKey,
                  entries : monthEntries
                });
              }
            }
            setHomePageGraphData(graphDataRefactor);
            setLoading(false);
          }
        } catch (err) {
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        }
      }
  };
  const handleDateRange = async (start, picker) => {
    setLoading(true);
        var dateFrom = new Date(picker.startDate._d);
        var dateTo = new Date(picker.endDate._d);
        const response = await httpClient.get(HOME.GET_HOME_GRAPH_DATA+'?entriesFrom='+dateFrom+'&entriesTo='+dateTo);
        if (response.data.success) {
          var graphDataRefactor = [];
          var graphData = response.data.data;
          var getMonths = dateMonths(monthDiff(dateFrom, dateTo), dateTo)
          var prevSixMonths = getMonths.sort().reverse();
          for (var w = 0; w <= prevSixMonths.length; w++) {
            if (!!prevSixMonths[w]) {
              var prevSixMonthsKey = Object.keys(prevSixMonths[w])+'';
              var monthEntries = 0
              for (var graphKey in graphData) {
                if (prevSixMonthsKey === graphKey) {
                  monthEntries = graphData[graphKey].entries
                }
              }
              graphDataRefactor.push({
                monthyear: prevSixMonthsKey,
                entries : monthEntries
              });
            }
          }
        setHomePageGraphData(graphDataRefactor);
        setLoading(false);
      }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content">
            <div className="container-xl">
              <div className="row g-4">
                <div className="app_home app_header header sticky w-100">
                  <h1 className="app-page-title">Home</h1>
                  <p>{moment().format("LL")}</p>
                </div>
              </div>
              <div
                className="row g-4 mb-3 total_list total_list_boxes"
                style={{ marginTop: "130px" }}
              >
                <div className="col-6 col-lg-3 col-md-3">
                  <Link to="/entries">
                    <div className="total_list_card h-100">
                      <div className="app-card-body p-lg-4 p-md-4">
                        <h5>Total Entries</h5>
                        {homeData && <span>{homeData.totalEntries} </span>}
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-6 col-lg-3 col-md-3">
                  <Link to="/products">
                    <div className="total_list_card h-100">
                      <div className="app-card-body p-lg-4 p-md-4">
                        <h5>Total Products</h5>
                        {homeData && <span>{homeData.totalProducts} </span>}
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-6 col-lg-3 col-md-3">
                  <Link to="/consumers">
                    <div className="total_list_card h-100">
                      <div className="app-card-body p-lg-4 p-md-4">
                        <h5>Unique Users</h5>
                        {homeData && <span>{homeData.uniqueUsers}</span>}
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-6 col-lg-3 col-md-3">
                  <div className="total_list_card h-100">
                    <div className="app-card-body p-lg-4 p-md-4">
                      <h5>Average Rating</h5>
                      <div className="entry-rate">
                        <span>
                          <img src="/assets/images/icons/star.svg" alt="" />
                        </span>
                        <span>
                          <img src="/assets/images/icons/star.svg" alt="" />
                        </span>
                        <span>
                          <img src="/assets/images/icons/star.svg" alt="" />
                        </span>
                        <span>
                          <img src="/assets/images/icons/star.svg" alt="" />
                        </span>
                        <span>
                          <img
                            src="/assets/images/icons/star-black.svg"
                            alt=""
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-4 entries_list_row">
                <div className="col-12 col-lg-12">
                  <div className="entries_list">
                    <div className="entries_row">
                      <div className="entries_title">
                        <h4>Entries</h4>
                      </div>

                      <div className="entries_drop">
                        <select
                          className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                          value={date}
                          onChange={(e) => handleDateChange(e.target.value)}
                        >
                          {dateRange().map((date, ind) => (
                              <option value={date.value} key={ind}>{date.month}</option>
                            ))}
                        </select>
                        {date && date == "0" && (
                          <DateRangePicker
                            onApply={handleDateRange}
                            initialSettings={{
                              startDate: moment(),
                              endDate: moment(),
                            }}
                          >
                            <input type="text" className="form-control" />
                          </DateRangePicker>
                        )}
                      </div>
                    </div>

                    <div className="entry_graph">
                      {homeGraphData && <Line options={options} data={lineDataConstructor(homeGraphData)} /> }
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-4 btm_row">
                <div className="col-12 col-lg-6 col-md-6">
                  <div className="update_sec h-100">
                    <div className="update_title">
                      <h3>TCD Updates</h3>
                    </div>
                    {updates.map((update, index) => (
                      <div className="app-update" key={index}>
                        <h5 className="mb-3">
                          {update.title}
                        </h5>
                        <p>
                          {update.description}
                        </p>

                        <ul>
                          <li>{moment(update.published_at).fromNow()}</li>
                          <li>{update.category}</li>
                        </ul>

                        <Link to={`/home/read-more/${update.id}`}>
                          <a href="" target="_blank">
                            Read More{" "}
                            <img src="/assets/images/icons/arrow.svg" alt="" />
                          </a>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-12 col-lg-6 col-md-6">
                  <div className="comment_sec h-100">
                    <div className="comment_card">
                      <div className="comment_title">
                        <h3>User Comments</h3>
                      </div>

                      <div className="app-comment">
                       {commentsToShow.length > 0 && commentsToShow.map(function(object, i){
                              return <div className="user_list" key={i}> 
                              <div className="user_title">
                                <h5>{ratingAndCommentsData[i].product_name}</h5>
                                <span>{ratingAndCommentsData[i].created_at}</span>
                              </div>
      
                              <div className="user_rate" dangerouslySetInnerHTML={{__html: starAveRatings(ratingAndCommentsData[i].average_ratings)}}></div>
      
                              <div className="user_para">
                                <p>{ratingAndCommentsData[i].comments}</p>
                              </div>
                            </div>
                            })
                          }

                       <div className="user_view">
                        <button style={{color: '#2c6342'}} href="#" onClick={loadMoreRatingsAndReviews}>
                          {" "}
                          Load more{" "}
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Home;
