import React, { useState, useEffect } from "react";
import ObjectivesGraphServices from "./objectives.graph.services";
import { saveAs } from 'file-saver';
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import { httpClient } from "../../constants/Api";
import { CONSUMERS } from "../../constants/AppConstant";
import { dateRange } from "../../utils/Common";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const saveCanvas = (elementId) => {
        //save to png
        const canvasSave = document.getElementById(elementId);
        canvasSave.toBlob(function (blob) {
            saveAs(blob, elementId+".png")
        })
    }

const TopACES = [
      'Top 5 Activities',
      'Top 5 Health and Conditions',
      'Top 5 Effects',
      'Top 5 Symptoms'
    ]
const ObjectivesServicesLayout = (activeContentTab) => { 
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(false);
    const [dateReason, setDateReason] = useState(false);
    const [graphObjectsData, setGraphObjectsData] = useState();
    const [graphReasonsData, setReasonsData] = useState();
    const [graphTopObjects, setGraphTopObjects] = useState();
    const [graphTopReasons, setGraphTopReasons] = useState();

    useEffect(() => {
      getObjectsData();
    }, []);

    const getObjectsData = async () => {
      try {
        setLoading(true);
        var date = new Date();
        var dateFrom, dateTo;
        dateFrom = new Date(date.getFullYear(), date.getMonth()-6, 1);
        dateTo = new Date(date.getFullYear(), date.getMonth(), 0);
        const response = await httpClient.get(CONSUMERS.GET_OBJECTIVES_MAIN+'?objectivesFrom='+dateFrom+'&objectivesTo='+dateTo);
        let entriesByObjectives = {
          activityDataSets: response.data.data[0].activity[0].merged_entries,
          conditionsDataSets: response.data.data[0].conditions[0].merged_entries,
          effectsDataSets: response.data.data[0].effects[0].merged_entries,
          symptomsDataSets: response.data.data[0].symptoms[0].merged_entries
        };
        let entriesTopObjectives = {
          activityDataSets: response.data.data[0].activity[0].objectives.slice(0, 5),
          conditionsDataSets: response.data.data[0].conditions[0].objectives.slice(0, 5),
          effectsDataSets: response.data.data[0].effects[0].objectives.slice(0, 5),
          symptomsDataSets: response.data.data[0].symptoms[0].objectives.slice(0, 5)
        };
        setGraphObjectsData(entriesByObjectives);
        setGraphTopObjects(entriesTopObjectives);
        setReasonsData(response.data.mergedAces.slice(0,8));
        setGraphTopReasons(response.data.entriesReason.slice(0,8));
        setLoading(false);
      } catch (err) {
          return 'Something went wrong';
      }
    };
    const onChangeUpdate = async (type, changeToDate) => {
      var date = new Date();
      var dateFrom, dateTo;
      if (changeToDate && changeToDate === '0') {
        if (type=== 'objectives') setDate(changeToDate);
        if (type=== 'reasons') setDateReason(changeToDate);
      } else {
        if (type=== 'objectives') setDate(changeToDate);
        if (type=== 'reasons') setDateReason(changeToDate);
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
          dateFrom = new Date(date.getFullYear(), date.getMonth()-6, date.getDate());
          dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        try {
          setLoading(true);
            const response = await httpClient.get(CONSUMERS.GET_OBJECTIVES_MAIN+'?objectivesFrom='+dateFrom+'&objectivesTo='+dateTo);
            let entriesByObjectives = {
              activityDataSets: response.data.data[0].activity[0].merged_entries,
              conditionsDataSets: response.data.data[0].conditions[0].merged_entries,
              effectsDataSets: response.data.data[0].effects[0].merged_entries,
              symptomsDataSets: response.data.data[0].symptoms[0].merged_entries
            };
            let entriesTopObjectives = {
              activityDataSets: response.data.data[0].activity[0].objectives.slice(0, 5),
              conditionsDataSets: response.data.data[0].conditions[0].objectives.slice(0, 5),
              effectsDataSets: response.data.data[0].effects[0].objectives.slice(0, 5),
              symptomsDataSets: response.data.data[0].symptoms[0].objectives.slice(0, 5)
            };
            if (type=== 'objectives') {
              setGraphObjectsData(entriesByObjectives);
              setGraphTopObjects(entriesTopObjectives);
            }
            if (type=== 'reasons') {
              setReasonsData(response.data.mergedAces.slice(0,8));
              setGraphTopReasons(response.data.entriesReason.slice(0,8));
            }
          setLoading(false);
        } catch (err) {
            return 'Something went wrong';
        }
      }

    };
    const handleDateRange = async (start, picker) => {
      try {
        setLoading(true);
        var dateFrom = new Date(picker.startDate._d);
        var dateTo = new Date(picker.endDate._d);
        const response = await httpClient.get(CONSUMERS.GET_OBJECTIVES_MAIN+'?objectivesFrom='+dateFrom+'&objectivesTo='+dateTo);
        let entriesByObjectives = {
          activityDataSets: response.data.data[0].activity[0].merged_entries,
          conditionsDataSets: response.data.data[0].conditions[0].merged_entries,
          effectsDataSets: response.data.data[0].effects[0].merged_entries,
          symptomsDataSets: response.data.data[0].symptoms[0].merged_entries
        };
        let entriesTopObjectives = {
          activityDataSets: response.data.data[0].activity[0].objectives.slice(0, 5),
          conditionsDataSets: response.data.data[0].conditions[0].objectives.slice(0, 5),
          effectsDataSets: response.data.data[0].effects[0].objectives.slice(0, 5),
          symptomsDataSets: response.data.data[0].symptoms[0].objectives.slice(0, 5)
        };
        setGraphObjectsData(entriesByObjectives);
        setGraphTopObjects(entriesTopObjectives);
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
        setReasonsData(response.data.mergedAces.slice(0,8));
        setGraphTopReasons(response.data.entriesReason.slice(0,8));
        setLoading(false);
      } catch (err) {
          return 'Something went wrong';
      }
    };
    return (
      <>
      {loading && 
      <div className="loader" style={{display: 'block', left: '50%'}}>
        <img className="img-fluid loader-style" src="../../assets/images/loader-cannabis.gif" alt="" />
    </div>
      }
        <div
                    className={'tab-pane fade objective_tab_mt '+activeContentTab.activeContentTab.activeContent}
                    id="objective"
                    role="tabpanel"
                    aria-labelledby="objective-tab"
                  >
                    <div className="app-card app-card-orders-table mb-5">
                      <div className="app-card-body">
                      <div className="row g-4 mb-3 demograph_sec p-0">
                          <div className="col-12">
                            <div className="demograph_main">
                            <div className="demopie_chart">
                              <div className="demograph_row">
                                <div className="demograph_title">
                                  <h4> Entries by Objectives </h4>
                                </div>

                                            <div className="entries_drop">
                                            <select
                                                    className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                                                    value={date}
                                                    onChange={(e) => onChangeUpdate('objectives', e.target.value)}
                                                    >
                                                    {
                                                        dateRange().map((date) => (
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

                                          {graphObjectsData && 
                                            <ObjectivesGraphServices chartName="main_graph" data={graphObjectsData}/>
                                            }
                            </div>
                            {graphTopObjects && Object.keys(graphTopObjects).map( (key,i) => {
                              return (<ObjectivesGraphServices chartName="topACES" data={graphTopObjects[key]} name={TopACES[i]}/> )
                            })}
                            </div>
                          </div>
                        </div>

                        <div className="row g-4 mb-3 demograph_sec p-0">
                          <div className="col-12">
                            <div className="demograph_main">
                            <div className="demopie_chart">
                              <div className="demograph_row">
                                <div className="demograph_title">
                                  <h4> Entries by Reasons</h4>
                                </div>

                                <div className="entries_drop">
                                            <select
                                                    className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                                                    value={dateReason}
                                                    onChange={(e) => onChangeUpdate('reasons', e.target.value)}
                                                    >
                                                    {
                                                        dateRange().map((date) => (
                                                        <option value={date.value}>{date.month}</option>
                                                        ))}
                                                    </select>
                                                    {dateReason && dateReason == "0" && (
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

                                        {graphReasonsData && 
                                            <ObjectivesGraphServices chartName="main_reasons" data={graphReasonsData}/>
                                            }
                            </div>
                            {graphTopReasons && Object.keys(graphTopReasons).map( (key,i) => {
                              return (<ObjectivesGraphServices chartName="topReasons" data={graphTopReasons[key]} name={graphTopReasons[i].name}/> )
                            })}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  </>
    );
}
export default ObjectivesServicesLayout;