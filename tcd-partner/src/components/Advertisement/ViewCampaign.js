import React, { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import DataTable from "react-data-table-component";
import { setPageTitle } from "../../utils/Common";
import { Link, useParams } from "react-router-dom";
import { ADVERTISEMENT } from "../../constants/AppConstant";
import { httpClient } from "../../constants/Api";
import staticData from "../../JsonData/view-campaign.json";
import { toast } from "react-toastify";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import Footer from "../../layouts/Footer";
import StartCampaignModal from "./AdvertisementModals/StartCampaignModal";
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
  type: "area",
  labels,
  datasets: [
    {
      label: "Clicks",
      data: [12, 19, 10, 3, 44, 255, 144, 32],
      borderColor: "rgba(169, 201, 182, 0.57)",
      backgroundColor: "rgba(169, 201, 182, 0.57)",
    },
    {
      label: "Impressions",
      data: [120, 29, 12, 32, 43, 155, 244, 31],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
  alignToPixels: true,
};

function ViewCampaign() {
  const { campaignId } = useParams();
  const [viewCampaignData, setViewCampaignData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCampaign, setShowCampaign] = useState({
    // open: false,
    // _id: "",
    // name: "",
//.......................
    // open: false,
    // _id: "",
    // image:"",
    // headline:"",
    // link:"",
    // placement_page:""

  });

  useEffect(() => {
    setPageTitle("View Campaign");
    viewCampaign();
  }, []);
  // const columns = [
  //   {
  //     name: "Campaign Name",
  //     selector: (row) => <span> {row.campaign_name} </span>,
  //     sortable: true,
  //   },
  //   {
  //     name: "Status",
  //     selector: (row) => <span className="running_ad"> All ads running </span>,
  //     sortable: true,
  //   },
  //   {
  //     name: "Impressions",
  //     selector: (row) => <span> {row.impression} </span>,
  //     sortable: true,
  //   },
  //   {
  //     name: "Clicks",
  //     selector: (row) => <span> {row.click} </span>,
  //     sortable: true,
  //   },
  //   {
  //     name: "",
  //     selector: (row) => (
  //       <p className="add_edit_btns">
  //         <Link
  //           to=""
  //           onClick={() =>
  //             setShowCampaign({
  //               open: true,
  //               id: row.id,
  //               name: row.campaign_name,
  //             })
  //           }
  //         >
  //           View /<span>Edit</span>
  //         </Link>
  //       </p>
  //     ),
  //     sortable: false,
  //   },
  // ];

  const columns = [
    {
      name: "Image",
      selector: (row) => <img src={row.advertisement_image} style = {{height:"50px"}} />,
      sortable: true,
    },
    {
      name: "Headline",
      selector: (row) => <span className="running_ad"> {row.headline} </span>,
      sortable: true,
    },
    {
      name: "Link",
      selector: (row) => <span> {row.link} </span>,
      sortable: true,
    },
    {
      name: "Placement Page",
      selector: (row) => <span> {`${row.placement_page},`} </span>,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <p className="add_edit_btns">
          <Link
            to={`/advertisement/create-new-ad/${campaignId}?advertisementId=${row.id}`}
            onClick={() =>
              setShowCampaign({
                // open: true,
                // id: row.id,
                // name: row.campaign_name,
                // open: true,
                // _id: row.id,
                // image:row.image,
                // headline:row.headline,
                // link:row.link,
                // placement_page:row.placement_page,
              })
            }
          >
            View /<span>Edit</span>
          </Link>
        </p>
      ),
      sortable: false,
    },
  ];

  const viewCampaign = async () => {
    try {
      setLoading(true);
      const res = await httpClient.get(
        ADVERTISEMENT.VIEW_CAMPAIGN.replace("{campaignId}", campaignId)
      );
      setViewCampaignData(res.data.data);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    // setShowCampaign({ open: false, id: "", name: "" });
    // setShowCampaign({ open: false, _id: "", image:"", headline:"",  link:"", lacement_page:"" });
    viewCampaign();
  };
  const handleDateRange = async () => {};
  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content">
            <div className="container-xl">
              <div className="row g-4">
                <div
                  className="app_home app_header sticky"
                  style={{ width: "calc(100% - 314px)", left: "314px" }}
                >
                  <div className="mb-4">
                    <Link to="/advertisement" className="backto-btn">
                      <span className="lnr lnr-arrow-left mr-2"></span> &nbsp;
                      Back to Advertisement
                    </Link>
                  </div>
                  <div className="d-md-flex align-items-end">
                    <h1 className="app-page-title">
                      {viewCampaignData.campaign_name}{" "}
                    </h1>
                    <div className="start_campaign ms-auto">
                      <Link to={`/advertisement/create-new-ad/${campaignId}`}>
                        <button className="btn btn-danger btn-color">
                          Create New Ad
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="row g-4 mb-3 total_list total_list_boxes"
                style={{ marginTop: "250px" }}
              >
                <div className="col-6 col-lg-3 col-md-3">
                  <div className="total_list_card h-100">
                    <div className="app-card-body p-lg-4 p-md-4">
                      <h5>Total ads</h5>
                      <span>12</span>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-lg-3 col-md-3">
                  <div className="total_list_card h-100">
                    <div className="app-card-body p-lg-4 p-md-4">
                      <h5>Total clicks</h5>
                      <span>2,490</span>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-lg-3 col-md-3">
                  <div className="total_list_card h-100">
                    <div className="app-card-body p-lg-4 p-md-4">
                      <h5>Total spend</h5>
                      <span>$900</span>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-lg-3 col-md-3">
                  <div className="total_list_card h-100">
                    <div className="app-card-body p-lg-4 p-md-4">
                      <h5>CTR</h5>
                      <span>3.21%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-4 entries_list_row">
                <div className="col-12 col-lg-12">
                  <div className="entries_list">
                    <div className="entries_row">
                      <div className="entries_title">
                        <h4>Campaign Performance</h4>
                      </div>

                      <div className="entries_drop">
                        <DateRangePicker
                          onApply={handleDateRange}
                          initialSettings={{
                            startDate: moment(),
                            endDate: moment(),
                          }}
                        >
                          <input type="text" className="form-control mt-2" />
                        </DateRangePicker>
                      </div>
                    </div>

                    <div className="entry_graph">
                      <Line options={options} data={data} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="advertisement_table">
                {viewCampaignData && (
                  <DataTable
                    columns={columns}
                    data={viewCampaignData}
                    progressPending={loading}
                    highlightOnHover
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 50, 100]}
                    paginationComponentOptions={{
                      rowsPerPageText: "Records per page:",
                      rangeSeparatorText: "out of",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      {/* {showCampaign.open && (
        <StartCampaignModal
          show={showCampaign.open}
          close={handleClose}
          name={showCampaign.name}
          id={showCampaign.id}
        />
      )} */}
    </>
  );
}

export default ViewCampaign;
