import React, { useEffect, useState, useRef  } from "react";
import ProfileGraphServices from "./profiles.graph.services";
import { saveAs } from 'file-saver'; 
import { starAveRatings } from '../../utils/Common'; 
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { httpClient } from "../../constants/Api";
import { CONSUMERS } from "../../constants/AppConstant";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const dateRange = [
    { value: 6, month: "6 months" },
    { value: 1, month: "This month" },
    { value: 2, month: "Show Last 30 days" },
    { value: 4, month: "Last months" },
    { value: 5, month: "3 months" },
    { value: 0, month: "Date Range" },
    ];

const filterReasonRange = [
  { value: 6, month: "6 months" },
  { value: 1, month: "This month" },
  { value: 2, month: "Show Last 30 days" },
  { value: 4, month: "Last months" },
  { value: 5, month: "3 months" },
  { value: 0, month: "Date Range" },
  ];

const saveCanvas = (elementId) => {
    //save to png
    const canvasSave = document.getElementById(elementId);
    canvasSave.toBlob(function (blob) {
        saveAs(blob, elementId+".png")
    })
}

var colorDatas = [
  '/assets/images/icon10.png',
  '/assets/images/icon11.png',
  '/assets/images/icon12.png',
  '/assets/images/icon16.png',
  '/assets/images/icon25.png',
  '/assets/images/icon23.png',
  '/assets/images/icon20.png',
  '/assets/images/icon21.png',
  '/assets/images/icon22.png',
]
var colorReasonDatas = [
  '/assets/images/icon10.png',
  '/assets/images/icon12.png',
  '/assets/images/icon20.png',
  '/assets/images/icon21.png',
  '/assets/images/icon11.png',
  '/assets/images/icon22.png',
  '/assets/images/icon16.png',
  '/assets/images/icon25.png',
  '/assets/images/icon23.png',
]
var colorClass = [
  'grid-item--width2 grid-item--height2 primary',
  'primary-thin',
  'primary-light',
  'sucess grid-item--height3',
  'sucess-dark grid-item--height3',
  'grid-item--height4 grid-item--width3 secondary-thin secondary-thin',
  'grid-item--height4 grid-item--width4 secondary-light',
  'grid-item--height4 grid-item--width5 secondary-dark',
]
const getAgeRange = (age) => {
  return ageGroups.find(e => {
      let s = e.split('-');
      return age >= s[0] && age <= s[1];
  })
}

let ageGroups = ['21-30', '31-40', '41-50', '51-60', '60-100'];

const getAgeGroup = (data) => {
let m = data.sort((a,b) => b.age - a.age).reduce((a,b) => {
  let r = getAgeRange(b.age);
  return a.set(r, a.has(r) ? a.get(r).concat(b) : [b])
}, new Map());
let data_filtered = Array.from(m, ([age, count]) => ({ age, count }));
for (var i = 0; i < data_filtered.length; i++) {
  let countAge = 0
  for (var c = 0; c < data_filtered[i].count.length; c++) {
    countAge += Number(data_filtered[i].count[c].count)
  }
  data_filtered[i].count = countAge
  if (data_filtered[i].age===undefined) {
    data_filtered[i].age = 'Undefined';
  } else if(data_filtered[i].age==='60-100') {
    data_filtered[i].age = '60+';
  } 
}
return data_filtered;
}
const ProfileServicesLayout = (activeContentTab) => { 
    const [consumerData, setConsumerData] = useState();
    const [demographData, setDemoGraphData] = useState();
    const [purposeData, setPurposeData] = useState();
    const [date, setDate] = useState(false);
    const [datePurpose, setDatePurpose] = useState(false);
    const [dateReason, setDateReason] = useState(false);
    const [datePurposeTotal, setDatePurposeTotal] = useState(false);
    const [dateFrequency, setDateFrequency] = useState(false);
    const [reasonsData, setReasons] = useState();
    const [isLoading, setLoading] = useState(false);
    const titleAgeRef = useRef();
    const titlePurposeRef = useRef();
    const titleLocationRef = useRef();
    const titleFrequencyRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        getConsumersData();
        getReasonsData();
      }, []);

      const getReasonsData = async () => {
        try {
          setLoading(true);
          var date = new Date();
          var dateFrom, dateTo;
          dateFrom = new Date(date.getFullYear(), date.getMonth()-6, 1);
          dateTo = new Date(date.getFullYear(), date.getMonth(), 0);
          const response = await httpClient.get(CONSUMERS.GET_OBJECTIVES_MAIN+'?objectivesFrom='+dateFrom+'&objectivesTo='+dateTo);
          let reasonsDataEntries = response.data.mergedAces.slice(0, 8);
          setReasons(reasonsDataEntries);
          setLoading(false);
        } catch (err) {
            return 'Something went wrong';
        }
      };
    const getConsumersData = async () => {
        try {
          setLoading(true);
          const response = await httpClient.get(CONSUMERS.GET_PROFILES_MAIN);
          setConsumerData(response.data.data);
          setDemoGraphData(response.data.data.user);
          setPurposeData(response.data.data.user)
          let overAllTotalUsers = 0;
          let overAllTotalUsersEntries = 0;
          let overAllTotalAverageEntries = 0;
          let overAllTotalAverageRatings = 0;
          for (var i = 0; i < response.data.data.user.consumption_reasons.length; i++) {
            overAllTotalUsers += response.data.data.user.consumption_reasons[i].total_users
            overAllTotalUsersEntries += response.data.data.user.consumption_reasons[i].user_entries
            overAllTotalAverageEntries += parseInt(response.data.data.user.consumption_reasons[i].average_entries)
            overAllTotalAverageRatings += parseInt(response.data.data.user.consumption_reasons[i].average_ratings)
          }
          overAllTotalAverageRatings = overAllTotalAverageRatings / i;
          response.data.data.user.consumption_reasons_overalltotal = {overall_users: overAllTotalUsers, overall_user_entries: overAllTotalUsersEntries, overall_average_entries: overAllTotalAverageEntries, overall_average_ratings: overAllTotalAverageRatings}
          setDatePurposeTotal(response.data.data.user.consumption_reasons_overalltotal)
          setLoading(false);
        } catch (err) {
            return 'Something went wrong';
        }
      };
      const handleDateRange = async (start, picker) => {
        try {
          setLoading(true);
          var demographfrom = new Date(picker.startDate._d);
          var demographTo = new Date(picker.endDate._d);
          const response = await httpClient.get(CONSUMERS.GET_PROFILES_DEMOGRAPH+'?demographfrom='+demographfrom+'&demographTo='+demographTo);
          setDemoGraphData(response.data.data.user);
          setLoading(false);
        } catch (err) {
            return 'Something went wrong';
        }
      };
      const handlePurposeDateRange = async (start, picker) => {
        try {
          setLoading(true);
          var purposefrom = new Date(picker.startDate._d);
          var purposeTo = new Date(picker.endDate._d);
          const response = await httpClient.get(CONSUMERS.GET_PROFILES_PURPOSE+'?purposefrom='+purposefrom+'&purposeTo='+purposeTo);
          let overAllTotalUsers = 0;
          let overAllTotalUsersEntries = 0;
          let overAllTotalAverageEntries = 0;
          let overAllTotalAverageRatings = 0;
          for (var i = 0; i < response.data.data.user.consumption_reasons.length; i++) {
            overAllTotalUsers += response.data.data.user.consumption_reasons[i].total_users
            overAllTotalUsersEntries += response.data.data.user.consumption_reasons[i].user_entries
            overAllTotalAverageEntries += parseInt(response.data.data.user.consumption_reasons[i].average_entries)
            overAllTotalAverageRatings += parseInt(response.data.data.user.consumption_reasons[i].average_ratings)
          }
          overAllTotalAverageRatings = overAllTotalAverageRatings / i;
          var consumption_reasons_overalltotal = {overall_users: overAllTotalUsers, overall_user_entries: overAllTotalUsersEntries, overall_average_entries: overAllTotalAverageEntries, overall_average_ratings: overAllTotalAverageRatings}
          setPurposeData(response.data.data.user)
          setDatePurposeTotal(consumption_reasons_overalltotal)
          setLoading(false);
        } catch (err) {
            return 'Something went wrong';
        }
      };

      const handleReasonDateRange = async (start, picker) => {
        try {
          setLoading(true);
          var dateFrom = new Date(picker.startDate._d);
          var dateTo = new Date(picker.endDate._d);
          const response = await httpClient.get(CONSUMERS.GET_OBJECTIVES_MAIN+'?objectivesFrom='+dateFrom+'&objectivesTo='+dateTo);
          let reasonsDataEntries = response.data.mergedAces.slice(0, 8);
          setReasons(reasonsDataEntries);
          setLoading(false);
        } catch (err) {
            return 'Something went wrong';
        }
      };

      const onChangeUpdate = async (type, changeToDate) => {
        var date = new Date();
        var dateFrom, dateTo;
        if (changeToDate && changeToDate === '0') {
          if (type === 'demograph') setDate(changeToDate);
          if (type === 'purpose') setDatePurpose(changeToDate);
          if (type === 'reason') setDateReason(changeToDate);
        } else {
          if (type === 'demograph') setDate(changeToDate);
          if (type === 'purpose') setDatePurpose(changeToDate);
          if (type === 'reason') setDateReason(changeToDate);

          if (changeToDate === '1') { // This Month
            dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
            dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          } else if (changeToDate === '2') { // Last 30 Days
            dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate()-30);
            dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          } else if (changeToDate === '4') { // Last month
            dateFrom = new Date(date.getFullYear(), date.getMonth()-1, 1);
            dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          } else if (changeToDate === '5') { // Last 3 months
            dateFrom = new Date(date.getFullYear(), date.getMonth()-3, 1);
            dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          } else if (changeToDate === '6') { // Last 6 months
            dateFrom = new Date(date.getFullYear(), date.getMonth()-6, 1);
            dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          }
          try {
            setLoading(true);
            if (type==='demograph') {
              const response = await httpClient.get(CONSUMERS.GET_PROFILES_DEMOGRAPH+'?demographfrom='+dateFrom+'&demographTo='+dateTo);
              setDemoGraphData(response.data.data.user);
            } else if (type==='purpose') {
              const response = await httpClient.get(CONSUMERS.GET_PROFILES_PURPOSE+'?purposefrom='+dateFrom+'&purposeTo='+dateTo);
              let overAllTotalUsers = 0;
              let overAllTotalUsersEntries = 0;
              let overAllTotalAverageEntries = 0;
              for (var i = 0; i < response.data.data.user.consumption_reasons.length; i++) {
                overAllTotalUsers += response.data.data.user.consumption_reasons[i].total_users
                overAllTotalUsersEntries += response.data.data.user.consumption_reasons[i].user_entries
                overAllTotalAverageEntries += parseInt(response.data.data.user.consumption_reasons[i].average_entries)
              }
              var consumption_reasons_overalltotal = {overall_users: overAllTotalUsers, overall_user_entries: overAllTotalUsersEntries, overall_average_entries: overAllTotalAverageEntries}
              setPurposeData(response.data.data.user)
              setDatePurposeTotal(consumption_reasons_overalltotal)
            } else if (type==='reason') {
            const response = await httpClient.get(CONSUMERS.GET_OBJECTIVES_MAIN+'?objectivesFrom='+dateFrom+'&objectivesTo='+dateTo);
            let reasonsDataEntries = response.data.mergedAces.slice(0, 8);
            setReasons(reasonsDataEntries);
            }
            setLoading(false);
          } catch (err) {
              return 'Something went wrong';
          }
        }

      };

    const clickPurposeHandler = async (data) => {
      const id = data.target.getAttribute('data-id')
      navigate(`${"/consumers/profiles/purpose/"}${id}`);
    };

    return (
      <>
      {isLoading && 
      <div className="loader" style={{display: 'block', left: '50%'}}>
        <img className="img-fluid loader-style" src="../../assets/images/loader-cannabis.gif" alt="" />
    </div>
      }
        <div
                    className={'tab-pane fade '+activeContentTab.activeContentTab.activeContent}
                    id="profile"
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                  >
                    <div className="app-card app-card-orders-table mb-5">
                      <div className="app-card-body">
                        <div className="row g-4 mb-3 total_list total_list_boxes p-0">
                          <div className="col-6 col-lg-3 col-md-3">
                            <div className="total_list_card h-100">
                              <div className="app-card-body p-lg-4 p-md-4">
                                <a style={{textDecoration: 'none'}} href="#age" onClick={() => titleAgeRef.current.scrollIntoView({ behavior: "smooth" })}><h5>Average age</h5>
                                {consumerData && <span>{Number(consumerData.user.average).toFixed(0)} </span>}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="col-6 col-lg-3 col-md-3">
                            <div className="total_list_card h-100">
                              <div className="app-card-body p-lg-4 p-md-4">
                                <a style={{textDecoration: 'none'}} href="#Purpose" onClick={() => titlePurposeRef.current.scrollIntoView({ behavior: "smooth" })}>
                                    <h5>Top consumption purpose</h5>
                                    {consumerData && <span>{consumerData.user.top_reason.consumption_reason} </span>}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="col-6 col-lg-3 col-md-3">
                            <div className="total_list_card h-100">
                              <div className="app-card-body p-lg-4 p-md-4" >
                                <a style={{textDecoration: 'none'}} href="#location" onClick={() => titleLocationRef.current.scrollIntoView({ behavior: "smooth" })}>
                                <h5>Top location</h5>
                                {consumerData && <span>{consumerData.user.top_location.state} </span>}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="col-6 col-lg-3 col-md-3">
                            <div className="total_list_card h-100">
                              <div className="app-card-body p-lg-4 p-md-4">
                                <a style={{textDecoration: 'none'}} href="#frequency" onClick={() => titleFrequencyRef.current.scrollIntoView({ behavior: "smooth" })}>
                                <h5>Avg frequency</h5>
                                {consumerData && <span>{Number(consumerData.user.daily_average_entries).toFixed(2)}/day </span>}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row g-4 mb-3 demograph_sec p-0">
                          <div className="col-12">
                            <div className="demograph_main">
                              <div className="demograph_row">
                                <div className="demograph_title" ref={titleAgeRef} >
                                  <h4> Demographics </h4>
                                </div>

                                <div className="entries_drop">
                                     <select
                                        className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                                        value={date}
                                        onChange={(e) => onChangeUpdate('demograph', e.target.value)}
                                        >
                                        {dateRange && dateRange.map((date) => (
                                          <option value={date.value}>{date.month}</option>
                                        ))}
                                     </select>
                                      {date && date === "0" && (
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
                              <div className="demograph_chart">
                                  <div className="demograph_chart_left">
                              <div className="demopie_chart">
                                <div className="demopie_row">
                                  <div className="demopie_title">
                                    <h5>Sex</h5>
                                  </div>

                                </div>
                                <div
                                  className="nav_tabs profile_tabs common_padding"
                                  style={{ marginTop: "0px" }}
                                >
                                  <nav
                                    id="profile-table-tab"
                                    className="profile-table-tab nav_tabs_main nav flex-column flex-sm-row custom_tabs "
                                  >
                                    <a
                                      className={'nav-link active'}
                                      id="profiledonutsex-tab"
                                      data-bs-toggle="tab"
                                      href="#profiledonutsex"
                                      role="tab"
                                      aria-controls="profiledonutsex"
                                      aria-selected="true"
                                    >Graph 1</a>
                                    <a
                                      className={'nav-link '}
                                      id="profilelinesex-tab"
                                      data-bs-toggle="tab"
                                      href="#profilelinesex"
                                      role="tab"
                                      aria-controls="profilelinesex"
                                      aria-selected="true"
                                    >Graph 2</a>
                                    <a
                                      className={'nav-link '}
                                      id="profiletablesex-tab"
                                      data-bs-toggle="tab"
                                      href="#profiletablesex"
                                      role="tab"
                                      aria-controls="profiletablesex"
                                      aria-selected="true"
                                    >Table</a>
                                    <a 
                                      className={'nav-link '}
                                      href="/" 
                                      onClick={() => {saveCanvas("data_sex_entries")}}
                                    >
                                      {" "}
                                      <img
                                        src="/assets/images/icons/arrow2.svg"
                                        alt=""
                                      />{" "}
                                      Export
                                    </a>
                                  </nav>
                                  <div className="tab-content" id="profile-table-tab-content">
                                  <div
                                        className={'tab-pane fade active show'}
                                        id="profiledonutsex"
                                        role="tabpanel"
                                        aria-labelledby="profiledonutsex-tab"
                                      >
                                      <div className="demograph_chart">
                                          <div className="analist_chart">
                                            {demographData && <ProfileGraphServices chartName="data_sex" data={demographData.gender}/>}
                                          </div>

                                          <div className="demograph_list">
                                          <ul>
                                              {
                                                  demographData && 
                                                  demographData.gender.map(function(object, i){
                                                      return(<li>
                                                      {" "}
                                                      <img
                                                          src={colorDatas[i]}
                                                          alt=""
                                                      />{" "}
                                                      {demographData.gender[i].gender}{" "}
                                                      </li>)
                                                  })
                                              }
                                            </ul>
                                          </div>
                                      </div>
                                  </div>
                                  <div
                                          className={'tab-pane fade"'}
                                          id="profiletablesex"
                                          role="tabpanel"
                                          aria-labelledby="profiletablesex-tab"
                                        >
                                    <div className="table-responsive mb-4">
                                <table className="table app-table-hover mb-0 text-left table-hover">
                                  <thead>
                                    <tr>
                                      <th className="cell">Sex</th>
                                      <th className="cell">Entries</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {demographData && demographData.gender.map(function(object, i){
                                        return <tr style={{cursor: '--pointer'}} >
                                          <td className="cell" data-id={demographData.gender[i].gender}>{demographData.gender[i].gender}</td>
                                          <td className="cell" data-id={demographData.gender[i].count}>{demographData.gender[i].count}</td>
                                        </tr>
                                      })
                                    }
                                  </tbody>
                                </table>
                              </div>
                                  </div>
                                  <div
                                          className={'tab-pane fade"'}
                                          id="profilelinesex"
                                          role="tabpanel"
                                          aria-labelledby="profilelinesex-tab"
                                        >
                                    <div className="progress_list">
                                    {demographData && <ProfileGraphServices chartName="data_sex_entries" data={demographData.gender}/>}
                                    </div>

                                    <div className="progressbtm_list">
                                      <ul>
                                      {
                                            demographData && 
                                            demographData.gender.map(function(object, i){
                                                return(<li>
                                                {" "}
                                                <img
                                                    src={colorDatas[i]}
                                                    alt=""
                                                />{" "}
                                                {demographData.gender[i].gender}{" "}
                                                </li>)
                                            })
                                        }
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                </div>
                              </div>
                              </div>
                              <div className="demograph_chart_right">

                              <div className="demopie_chart">
                                <div className="demopie_row">
                                  <div className="demopie_title" >
                                    <h5>Age</h5>
                                  </div>

                                  <div className="demopie_drop">
                                  <a href="/" onClick={() => {saveCanvas("data_age_entries")}}>
                                      {" "}
                                      <img
                                        src="/assets/images/icons/arrow2.svg"
                                        alt=""
                                      />{" "}
                                      Export
                                    </a>
                                  </div>
                                </div>

                                <div className="demograph_chart">

                                  <div
                                  className="nav_tabs profile_tabs common_padding"
                                  style={{ marginTop: "0px" }}
                                >
                                  <nav
                                    id="profile-table-tab"
                                    className="profile-table-tab nav_tabs_main nav flex-column flex-sm-row custom_tabs "
                                  >
                                    <a
                                      className={'nav-link active'}
                                      id="profiledonutage-tab"
                                      data-bs-toggle="tab"
                                      href="#profiledonutage"
                                      role="tab"
                                      aria-controls="profiledonutage"
                                      aria-selected="true"
                                    >Graph 1</a>
                                    <a
                                      className={'nav-link '}
                                      id="profilelineage-tab"
                                      data-bs-toggle="tab"
                                      href="#profilelineage"
                                      role="tab"
                                      aria-controls="profilelineage"
                                      aria-selected="true"
                                    >Graph 2</a>
                                    <a
                                      className={'nav-link '}
                                      id="profiletableage-tab"
                                      data-bs-toggle="tab"
                                      href="#profiletableage"
                                      role="tab"
                                      aria-controls="profiletableage"
                                      aria-selected="true"
                                    >Table</a>
                                    <a
                                      className={'nav-link '}
                                      href="/"
                                      onClick={() => {saveCanvas("data_sex_entries")}}
                                    >
                                      {" "}
                                      <img
                                        src="/assets/images/icons/arrow2.svg"
                                        alt=""
                                      />{" "}
                                      Export
                                    </a>
                                  </nav>
                                  <div className="tab-content" id="profileage-table-tab-content">
                                  <div
                                        className={'tab-pane active show"'}
                                        id="profiledonutage"
                                        role="tabpanel"
                                        aria-labelledby="profiledonutage-tab"
                                      >
                                      <div className="demograph_chart">
                                          <div className="analist_chart">
                                            {demographData && <ProfileGraphServices chartName="data_age" data={demographData.age}/>}
                                          </div>
                                          <div className="demograph_list">
                                          <ul>
                                              {
                                                  demographData && 
                                                  getAgeGroup(demographData.age).map(function(object, i){
                                                    if (i<6) {
                                                      return(<li>
                                                      {" "}
                                                      <img
                                                          src={colorDatas[i]}
                                                          alt=""
                                                      />{" "}
                                                      {getAgeGroup(demographData.age)[i].age}{" "}
                                                      </li>)
                                                    }
                                                  })
                                              }
                                            </ul>
                                          </div>
                                      </div>
                                  </div>
                                   <div
                                          className={'tab-pane fade"'}
                                          id="profiletableage"
                                          role="tabpanel"
                                          aria-labelledby="profiletableage-tab"
                                        >
                                    <div className="table-responsive mb-4">
                                <table className="table app-table-hover mb-0 text-left table-hover">
                                  <thead>
                                    <tr>
                                      <th className="cell">Age</th>
                                      <th className="cell">Entries</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {demographData && getAgeGroup(demographData.age).map(function(object, i){
                                    if (i<6) {
                                        return <tr style={{cursor: '--pointer'}} >
                                          <td className="cell" data-id={getAgeGroup(demographData.age)[i].age}>{getAgeGroup(demographData.age)[i].age}</td>
                                          <td className="cell" data-id={getAgeGroup(demographData.age)[i].count}>{getAgeGroup(demographData.age)[i].count}</td>
                                        </tr>
                                    }
                                      })
                                    }
                                  </tbody>
                                </table>
                              </div>
                              </div>
                                  <div
                                          className={'tab-pane fade'}
                                          id="profilelineage"
                                          role="tabpanel"
                                          aria-labelledby="profilelineage-tab"
                                        >
                                    <div className="progress_list">
                                      {demographData && <ProfileGraphServices chartName="data_age_entries" data={demographData.age}/>}
                                    </div>

                                    <div className="progressbtm_list">
                                      <ul>
                                      {
                                                  demographData && 
                                                  getAgeGroup(demographData.age).map(function(object, i){
                                                    if (i<6) {
                                                      return(<li>
                                                      {" "}
                                                      <img
                                                          src={colorDatas[i]}
                                                          alt=""
                                                      />{" "}
                                                      {getAgeGroup(demographData.age)[i].age}{" "}
                                                      </li>)
                                                    }
                                                  })
                                              }
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                </div>

                                      <div ref={titleLocationRef} style={{margin:'0px', padding:'0px', float: 'left'}}></div>

                                </div>
                              </div>
                              </div>
                              </div>

                              <div className="demopie_chart">
                                <div className="demopie_row">
                                  <div className="demopie_title">
                                    <h5>Locations</h5>
                                  </div>

                                  <div className="demopie_drop">
                                  <a href="/#" onClick={() => {saveCanvas("data_location_entries")}}>
                                      {" "}
                                      <img
                                        src="/assets/images/icons/arrow2.svg"
                                        alt=""
                                      />{" "}
                                      Export
                                    </a>
                                  </div>
                                </div>
                                <div className="demograph_chart">
                                  <div className="demograph_chart_left">
                                    <div className="analist_chart">
                                      {demographData && <ProfileGraphServices chartName="data_locations" data={demographData.state}/>}
                                    </div>
                                    <div className="demograph_list">
                                      <ul>
                                      {
                                            demographData && 
                                            demographData.state.map(function(object, i){
                                                if (i<6) {
                                                return(<li>
                                                {" "}
                                                <img
                                                    src={colorDatas[i]}
                                                    alt=""
                                                />{" "}
                                                {demographData.state[i].state}{" "}
                                                </li>)
                                                }
                                            })
                                        }
                                      </ul>
                                      <div ref={titlePurposeRef} style={{margin:'0px', padding:'0px', float: 'left'}}></div>
                                    </div>
                                  </div>

                                  <div className="demograph_chart_right">
                                    <div className="progress_list">
                                      {demographData && <ProfileGraphServices chartName="data_location_entries" data={demographData.state}/>}
                                    </div>

                                    <div className="progressbtm_list">
                                      <ul>
                                      {
                                            demographData && 
                                            demographData.state.map(function(object, i){
                                                if (i<6) {
                                                return(<li>
                                                {" "}
                                                <img
                                                    src={colorDatas[i]}
                                                    alt=""
                                                />{" "}
                                                {demographData.state[i].state}{" "}
                                                </li>)
                                                }
                                            })
                                        }
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row g-4 mb-3 purpose_sec p-0" >
                          <div className="col-12">
                            <div className="purpose_main">
                              <div className="purpose_row">
                                <div className="purpose_title" >
                                  <h4> Purpose </h4>
                                </div>

                                <div className="entries_drop">
                                <select
                                            className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                                            value={datePurpose}
                                            onChange={(e) => onChangeUpdate('purpose', e.target.value)}
                                            >
                                            {dateRange &&
                                                dateRange.map((date) => (
                                                <option value={date.value}>{date.month}</option>
                                                ))}
                                            </select>
                                            {datePurpose && datePurpose === "0" && (
                                            <DateRangePicker
                                                onApply={handlePurposeDateRange}
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

                              <div className="table-responsive mb-4">
                                <table className="table app-table-hover mb-0 text-left table-hover">
                                  <thead>
                                    <tr>
                                      <th className="cell">PURPOSE</th>
                                      <th className="cell">ENTRIES</th>
                                      <th className="cell">USERS</th>
                                      <th className="cell">PERCENTAGE ENTRIES</th>
                                      <th className="cell">AVERAGE RATING</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {purposeData && purposeData.consumption_reasons.map(function(object, i){
                                        return <tr style={{cursor: 'pointer'}} onClick={clickPurposeHandler} data-id={purposeData.consumption_reasons[i].consumption_reason_id}>
                                          <td className="cell" data-id={purposeData.consumption_reasons[i].consumption_reason_id}>{purposeData.consumption_reasons[i].consumption_reason}</td>
                                          <td className="cell" data-id={purposeData.consumption_reasons[i].consumption_reason_id}>{purposeData.consumption_reasons[i].user_entries}</td>
                                          <td className="cell" data-id={purposeData.consumption_reasons[i].consumption_reason_id}>{purposeData.consumption_reasons[i].total_users}</td>
                                          <td className="cell" data-id={purposeData.consumption_reasons[i].consumption_reason_id}>{purposeData.consumption_reasons[i].average_entries}</td>
                                          <td className="cell" data-id={purposeData.consumption_reasons[i].consumption_reason_id}>
                                            <div className="content" dangerouslySetInnerHTML={{__html: starAveRatings(purposeData.consumption_reasons[i].average_ratings)}}></div>
                                          </td>
                                        </tr>
                                      })
                                    }

                                    <tr>
                                      <td className="cell">Totals</td>
                                      <td className="cell">{datePurposeTotal && datePurposeTotal.overall_user_entries}</td>
                                      <td className="cell">{datePurposeTotal && datePurposeTotal.overall_users}</td>
                                      <td className="cell">{datePurposeTotal && datePurposeTotal.overall_average_entries}%</td>
                                      <td className="cell">
                                        <div className="content" dangerouslySetInnerHTML={{__html: starAveRatings(datePurposeTotal.overall_average_ratings)}}></div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table> 
                              </div>
                              <div className="purpose_mainlist d-md-flex">
                              {purposeData && purposeData.consumption_reasons.map(function(object, i){
                                if (purposeData.consumption_reasons[i].consumption_reason !== 'Undefined') {
                                  return(
                                  <div className="purpose_list">
                                    <h4> {purposeData.consumption_reasons[i].consumption_reason} </h4>
  
                                    <div className="progress_list">
                                      <ProfileGraphServices chartName="data_medicinal_entries" data={purposeData.consumption_reasons[i].genders}/>
                                    </div>
  
                                    <div className="progressbtm_list">
                                      <ul>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon10.png"
                                            alt=""
                                          />{" "}
                                          Male{" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon11.png"
                                            alt=""
                                          />{" "}
                                          Female{" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon12.png"
                                            alt=""
                                          />{" "}
                                          Non-binary{" "}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>)
                                  }
                                })
                              }
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row g-4 mb-3 filter_sec p-0">
                          <div className="col-12">
                            <div className="filter_main">
                              <div className="filter_row">
                                <div className="filter_title">
                                  <h4> Reasons </h4>
                                </div>
                                <div className="entries_drop">
                                <select
                                            className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                                            value={dateReason}
                                            onChange={(e) => onChangeUpdate('reason', e.target.value)}
                                            >
                                            {filterReasonRange &&
                                                filterReasonRange.map((date) => (
                                                <option value={date.value}>{date.month}</option>
                                                ))}
                                            </select>
                                            {dateReason && dateReason === "0" && (
                                            <DateRangePicker
                                                onApply={handleReasonDateRange}
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

                              <div className="grid_filter clearfix">
                                <div className="grid clearfix">
                                {reasonsData && Object.keys(reasonsData).map( (key,i) => {
                                   return <>
                                    <div className={'grid-item ' + colorClass[i]} data-toggle="tooltip" data-placement="top" title={reasonsData[i].name + ' : '+ reasonsData[i].total_entries }>
                                        <h6 className="p-2 text-dark">{reasonsData[i].name}</h6>
                                      </div>
                                    </>
                                })}
                                </div>

                                <div className="grid_list clearfix">
                                  <ul>
                                  {reasonsData && Object.keys(reasonsData).map( (key,i) => {
                                   return <>
                                      <li>
                                          {" "}
                                          <img
                                            src={colorReasonDatas[i]}
                                            alt=""
                                          />{" "}
                                          {reasonsData[i].name}{" "}
                                        </li>
                                    </>
                                  })}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row g-4 mb-3 frequency_sec p-0">
                          <div className="col-12">
                            <div className="demograph_main">
                              <div className="demograph_row">
                                <div className="demograph_title" ref={titleFrequencyRef}>
                                  <h4> Frequency </h4>
                                </div>

                                <div className="entries_drop">
                                <select
                                            className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                                            value={dateFrequency}
                                            onChange={(e) => setDateFrequency(e.target.value)}
                                            >
                                            {dateRange &&
                                                dateRange.map((date) => (
                                                <option value={date.value}>{date.month}</option>
                                                ))}
                                            </select>
                                            {dateFrequency && dateFrequency === "0" && (
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

                              <div className="demopie_chart">
                                <div className="demopie_row">
                                  <div className="demopie_title">
                                    <h5>Weekly entries</h5>
                                  </div>

                                  <div className="demopie_drop">
                                  <a href="#" onClick={() => {saveCanvas("data_weekly_entries")}}>
                                      {" "}
                                      <img
                                        src="/assets/images/icons/arrow2.svg"
                                        alt=""
                                      />{" "}
                                      Export
                                    </a>
                                  </div>
                                </div>

                                <div className="demograph_chart">
                                  <div className="demograph_chart_left">
                                    <div className="analist_chart">
                                      <ProfileGraphServices chartName="data_weekly"/>
                                    </div>

                                    <div className="demograph_list">
                                      <ul>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon10.png"
                                            alt=""
                                          />{" "}
                                          15 + {" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon11.png"
                                            alt=""
                                          />{" "}
                                          11-14{" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon12.png"
                                            alt=""
                                          />{" "}
                                          6-10{" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon16.png"
                                            alt=""
                                          />{" "}
                                          3-5{" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon23.png"
                                            alt=""
                                          />{" "}
                                          0-2{" "}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="demograph_chart_right">
                                    <div className="progress_list">
                                      <ProfileGraphServices chartName="data_weekly_entries"/>
                                    </div>

                                    <div className="progressbtm_list">
                                      <ul>
                                      <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon10.png"
                                            alt=""
                                          />{" "}
                                          15 + {" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon11.png"
                                            alt=""
                                          />{" "}
                                          11-14{" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon12.png"
                                            alt=""
                                          />{" "}
                                          6-10{" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon16.png"
                                            alt=""
                                          />{" "}
                                          3-5{" "}
                                        </li>
                                        <li>
                                          {" "}
                                          <img
                                            src="/assets/images/icon23.png"
                                            alt=""
                                          />{" "}
                                          0-2{" "}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
    );
}
export default ProfileServicesLayout;