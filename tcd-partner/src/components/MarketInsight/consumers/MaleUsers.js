import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";

import { Bar } from "react-chartjs-2";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { httpClient } from "../../../constants/Api";
import { MARKETINSIGHT } from "../../../constants/AppConstant";
import { toast } from "react-toastify";
import ReactStars from "react-rating-stars-component";
import "bootstrap-daterangepicker/daterangepicker.css";
import DataTable from 'react-data-table-component';

export const purposeOptions = {
  indexAxis: "y",
  maintainAspectRatio: false,
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = "";
          switch (context.dataIndex) {
            case 0:
              return (label = context.dataset.label[0].effect);
            case 1:
              return (label = context.dataset.label[1].effect);
            case 2:
              return (label = context.dataset.label[2].effect);
            case 3:
              return (label = context.dataset.label[3].effect);
            case 4:
              return (label = context.dataset.label[4].effect);
            default:
              break;
          }
          return label;
        },
      },
    },
  },
  scales: {
    xAxes: [
      {
        ticks: {
          display: false, //this will remove only the label
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
          drawBorder: false,
          display: false,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
          drawBorder: false,
          display: false,
        },
      },
    ],
  },
};

export const ageOptions = {
  indexAxis: "y",
  maintainAspectRatio: false,
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = "";

          switch (context.dataIndex) {
            case 0:
              return (label = "Age 21-30");
            case 1:
              return (label = "Age 31-40");
            case 2:
              return (label = "Age 41-50");
            case 3:
              return (label = "Age 51-60");
            case 4:
              return (label = "Age 61++");
            default:
              break;
          }
          return label;
        },
      },
    },
  },
  scales: {
    xAxes: [
      {
        ticks: {
          display: false, //this will remove only the label
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
          drawBorder: false,
          display: false,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
          drawBorder: false,
          display: false,
        },
      },
    ],
  },
};
const background_color = {
  "21-30": "rgba(34, 64, 47, 1)",
  "31-40": "rgba(44, 99, 66, 1)",
  "41-50": "rgba(169, 201, 182, 0.57)",
  "51-60": "rgba(253, 204, 30, 1)",
  "61+": "rgba(245, 158, 11, 1)",
};
const border_color = {
  "21-30": "rgba(34, 64, 47, 1)",
  "31-40": "rgba(44, 99, 66, 1)",
  "41-50": "rgba(169, 201, 182, 0.57)",
  "51-60": "rgba(253, 204, 30, 1)",
  "61+": "rgba(245, 158, 11, 1)",
};

const columns = [
  {
    name: 'CATEGORY',
    selector: (row) => <span> {row.category} </span>
  },
  {
    name: 'TOP PRODUCT',
    selector: (row) => <span> {row.product_name} </span>
  },
  {
    name: 'TOTAL ENTRIES',
    selector: (row) => <span> {row.entries} </span>
  },
  {
    name: 'TOP BRAND',
    selector: (row) => <span> {row.brand} </span>
  },
  {
    name: 'RATING',
    selector: (row) => (
        <div className="p-0">
          <ReactStars count={row.average_rating} size={30} color="#ffd700" />
        </div>
    ),
  },
];


function MaleUsers({ state }) {
  const [dateRangePickerDate, setDateRangePickerDate] = useState({
    from: moment().startOf("month"),
    to: moment().endOf("month"),
  });
  const [isLoading, setLoading] = useState(false);
  const [maleUsers, setMaleUsers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [purpose, setPurpose] = useState([]);
  const [date, setDate] = useState(false);

  useEffect(() => {
    getMaleConsumers();
  }, [dateRangePickerDate]);

  const handleDateRange = async (event, picker) => {
    setDateRangePickerDate({
      from: moment(picker.startDate).format("l"),
      to: moment(picker.endDate).format("l"),
    });
  };

  const onChangeUpdate = async (type, changeToDate) => {
    let dateFrom, dateTo;
    if (changeToDate && changeToDate === "0") {
      setDate(changeToDate);
    } else {
      setDate(changeToDate);
      if (changeToDate === "1") {
        // This Month
        dateFrom = moment()
          .startOf("month")

          .format("YYYY-MM-DD");
        dateTo = moment().endOf("month").format("YYYY-MM-DD");
      } else if (changeToDate === "2") {
        // Last 30 Days
        dateFrom = moment().subtract(30, "days").format("YYYY-MM-DD");
        dateTo = moment().format("YYYY-MM-DD");
      } else if (changeToDate === "4") {
        // Last month
        dateFrom = moment()
          .startOf("month")
          .subtract(1, "months")
          .format("YYYY-MM-DD");
        dateTo = moment()
          .endOf("month")
          .subtract(1, "months")
          .format("YYYY-MM-DD");
      } else if (changeToDate === "5") {
        // Last 3 months
        dateFrom = moment()
          .startOf("month")
          .subtract(3, "months")
          .format("YYYY-MM-DD");
        dateTo = moment().endOf("month").format("YYYY-MM-DD");
      } else if (changeToDate === "6") {
        // Last 6 months
        dateFrom = moment()
          .startOf("month")
          .subtract(6, "months")
          .format("YYYY-MM-DD");
        dateTo = moment().endOf("month").format("YYYY-MM-DD");
      }
      onChangeGetMaleConsumers(dateFrom, dateTo);
    }
  };

  const onChangeGetMaleConsumers = async (dateFrom, dateTo) => {
    try {
      let age_entries = [];
      let purpose_entries = [];
      setLoading(true);
      const users = await httpClient.get(
        `${MARKETINSIGHT.GET_CONSUMERS}?from=${dateFrom}&to=${dateTo}&state=${state}&gender=Male`
      );
      setMaleUsers(users.data.consumers);

      //filtering data to get age numbers
      users.data.consumers.map((c) =>
        c.age_arr.filter((a) => {
          {
            if (a.includes("years")) {
              const get_number = a.replace("years", "");
              age_entries.push(parseInt(get_number));
            }
          }
        })
      );
      users.data.consumers.map((c) => purpose_entries.push(c.purpose));
      setEntries(age_entries);
      setPurpose(purpose_entries);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getMaleConsumers = useCallback(async () => {
    onChangeGetMaleConsumers(dateRangePickerDate.from, dateRangePickerDate.to);
  }, [dateRangePickerDate]);

  const calculateAgeGraphData = (entries) => {
    let labels = [];
    let data = [];
    let backgroundColor = [];
    let borderColor = [];
    let array = [];
    //filter data for age group 21-30
    const first_age_group = entries.filter((d) => d > 20 && d < 31);
    array = [...array, { age_group: "21-30", value: first_age_group.length }];

    //filter data for age group 21-30
    const second_age_group = entries.filter((d) => d > 30 && d < 41);
    array = [...array, { age_group: "31-40", value: second_age_group.length }];

    //filter data for age group 21-30
    const third_age_group = entries.filter((d) => d > 40 && d < 51);

    array = [...array, { age_group: "41-50", value: third_age_group.length }];
    //filter data for age entries 21-30
    const fourth_age_group = entries.filter((d) => d > 50 && d < 61);

    array = [...array, { age_group: "51-60", value: fourth_age_group.length }];
    //filter data for age group 21-30
    const fifth_age_group = entries.filter((d) => d > 60);
    array = [...array, { age_group: "61+", value: fifth_age_group.length }];
    array.sort((a, b) => {
      return b.value - a.value;
    });

    for (let entry of array) {
      labels = [...labels, `${entry.value} Entries`];
      data = [...data, entry.value];
      backgroundColor = [...backgroundColor, background_color[entry.age_group]];
      borderColor = [...borderColor, border_color[entry.age_group]];
    }
    const data_age_entries = {
      labels: labels,
      datasets: [
        {
          label: "Age",
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };
    return data_age_entries;
  };

  const calculatePurposeGraphData = (entries) => {
    entries.sort((a, b) => {
      return b.entries - a.entries;
    });
    let labels = [];
    let data = [];

    for (let entry of entries) {
      labels = [...labels, `${entry.entries} Entries`];
      data = [...data, entry.entries];
    }
    const data_purpose_entries = {
      labels: labels,
      datasets: [
        {
          label: entries,
          data: data,
          backgroundColor: [
            "rgba(34, 64, 47, 1)",
            "rgba(44, 99, 66, 1)",
            "rgba(169, 201, 182, 0.57)",
            "rgba(253, 204, 30, 1)",
            "rgba(245, 158, 11, 1)",
          ],
          borderColor: [
            "rgba(34, 64, 47, 1)",
            "rgba(44, 99, 66, 1)",
            "rgba(169, 201, 182, 0.57)",
            "rgba(253, 204, 30, 1)",
            "rgba(245, 158, 11, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
    return data_purpose_entries;
  };

  const dateRange = [
    { value: 1, month: "This month" },
    { value: 2, month: "Show Last 30 days" },
    { value: 4, month: "Last months" },
    { value: 5, month: "3 months" },
    { value: 6, month: "6 months" },
    { value: 0, month: "Date Range" },
  ];
  return (
    <div>
      <div className="row g-4 mb-2 purpose_sec px-0">
        <div className="col-12">
          <div className="purpose_main mt-31">
            <div className="purpose_row">
              <div className="purpose_title">
                <h4> Male users </h4>
              </div>

              <div className="entries_drop">
                <select
                  className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                  value={date}
                  onChange={(e) => onChangeUpdate("demograph", e.target.value)}
                >
                  {dateRange &&
                    dateRange.map((date, ind) => (
                      <option value={date.value} key={ind}>
                        {date.month}
                      </option>
                    ))}
                </select>
                {date && date === "0" && (
                  <DateRangePicker
                    onApply={handleDateRange}
                    initialSettings={{
                      startDate: moment().startOf("month").format("l"),
                      endDate: moment().endOf("month").format("l"),
                    }}
                  >
                    <input type="text" className="form-control" />
                  </DateRangePicker>
                )}
              </div>
            </div>


            
            <div className="table-responsive mb-4 mb-0 text-left">
              <DataTable
                columns={columns}
                data={maleUsers}
                progressPending={isLoading}
                highlightOnHover
              />
            </div>

          { maleUsers.length > 0 ?
            <div className="purpose_mainlist age_purpose_graph d-flex">               
              <div className="purpose_list">
                <h4> Age </h4>
                  <div className="progress_list">
                    <Bar
                      options={ageOptions}
                      data={calculateAgeGraphData(entries)}
                    />
                  </div>
                  <div className="progressbtm_list">
                    <ul>
                      <li>
                        <img src="/assets/images/icon10.png" alt="" />
                        21-30
                      </li>
                      <li>
                        <img src="/assets/images/icon11.png" alt="" />
                        31-40
                      </li>
                      <li>
                        <img src="/assets/images/icon12.png" alt="" />
                        41-50
                      </li>
                      <li>
                        <img src="/assets/images/icon16.png" alt="" />
                        51-60
                      </li>
                      <li>
                        <img src="/assets/images/icon25.png" alt="" />
                        61+
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="purpose_list">
                  <h4> Purpose </h4>
                  <div className="progress_list">
                    <Bar
                      options={purposeOptions}
                      data={calculatePurposeGraphData(purpose)}
                    />
                  </div>
                  <div className="progressbtm_list">
                    <ul>
                      <li>
                        <img src="/assets/images/icon10.png" alt="" />
                        {purpose[0]?.effect}
                      </li>
                      <li>
                        <img src="/assets/images/icon11.png" alt="" />
                        {purpose[1]?.effect}
                      </li>
                      <li>
                        <img src="/assets/images/icon12.png" alt="" />
                        {purpose[2]?.effect}
                      </li>
                      <li>
                        <img src="/assets/images/icon16.png" alt="" />
                        {purpose[3]?.effect}
                      </li>
                      <li>
                        <img src="/assets/images/icon25.png" alt="" />
                        {purpose[4]?.effect}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
             : 
              ""
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaleUsers;
