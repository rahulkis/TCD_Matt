import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import DateRangePicker from "react-bootstrap-daterangepicker";
import DataTable from 'react-data-table-component';
import { httpClient } from "../../../constants/Api";
import { MARKETINSIGHT } from "../../../constants/AppConstant";
import { toast } from "react-toastify";
import ReactStars from "react-rating-stars-component";
import "bootstrap-daterangepicker/daterangepicker.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const options = {
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
              return (label = context.dataset.label[0].name);
            case 1:
              return (label = context.dataset.label[1].name);
            case 2:
              return (label = context.dataset.label[2].name);
            case 3:
              return (label = context.dataset.label[3].name);
            case 4:
              return (label = context.dataset.label[4].name);
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

const columns = [
  {
    name: 'ACTIVITY',
    selector: (row) => <span> {row.name} </span>
  },
  {
    name: 'ENTRIES',
    selector: (row) => <span> {row.entries} </span>
  },
  {
    name: 'NO. OF PRODUCTS',
    selector: (row) => <span> {row.product} </span>
  },
  {
    name: 'AVG AGE',
    selector: (row) => <span> {Math.ceil(row.average_age)} </span>
  },
  {
    name: 'AVERAGE RATING',
    selector: (row) => (
      <div className="entry-rate rating">
        <ReactStars count={row.average_rating} size={30} color="#ffd700" />
      </div>
    ),
  },
];

const dateRange = [
  { value: 1, month: "This month" },
  { value: 2, month: "Show Last 30 days" },
  { value: 4, month: "Last months" },
  { value: 5, month: "3 months" },
  { value: 6, month: "6 months" },
  { value: 0, month: "Date Range" },
];

function Effects() {
  const [dateRangePickerDate, setDateRangePickerDate] = useState({
    from: moment().startOf("month"),
    to: moment().endOf("month"),
  });
  const [isLoading, setLoading] = useState(false);
  const [topEffects, setTopEffects] = useState([]);
  const [date, setDate] = useState(false);

  useEffect(() => {
    getTopEffects();
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
      onChangeGetTopEffects(dateFrom, dateTo);
    }
  };

  const onChangeGetTopEffects = async (dateFrom, dateTo) => {
    try {
      setLoading(true);
      const effects = await httpClient.get(
        `${MARKETINSIGHT.GET_TOP_EFFECTS}?from=${dateFrom}&to=${dateTo}`
      );
      setTopEffects(effects.data.effects_array);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getTopEffects = useCallback(async () => {
    onChangeGetTopEffects(dateRangePickerDate.from, dateRangePickerDate.to);
  }, [dateRangePickerDate]);

  const calculateGraphData = (categories, name) => {
    categories.sort((a, b) => {
      return b.entries - a.entries;
    });
    let labels = [];
    let data = [];
    for (let category of categories) {
      labels = [...labels, `${category.entries} Entries`];
      data = [...data, category.entries];
    }

    const data_sleep_entries = {
      labels: labels,
      datasets: [
        {
          label: categories,
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

    return data_sleep_entries;
  };

  return (
    <div>
      <div className="row g-4 mb-2 purpose_sec px-0">
        <div className="col-12">
          <div className="purpose_main mt-2">
            <div className="purpose_row">
              <div className="purpose_title">
                <h4> Top 5 Effects </h4>
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
                data={topEffects}
                progressPending={isLoading}
                highlightOnHover
              />
            </div>
            <div className="purpose_mainlist bar-graph d-flex">
              {topEffects.map((activity, i) =>
                activity.categories.length > 0 ? (
                  <div className="purpose_list" key={i}>
                    <h4> {activity.name} </h4>

                    <div className="progress_list">
                      <Bar
                        options={options}
                        data={calculateGraphData(activity.categories)}
                      />
                    </div>

                    <div className="progressbtm_list">
                      <ul>
                        <li>
                          <img src="/assets/images/icon10.png" alt="" />
                          {activity.categories[0]?.name}
                        </li>
                        <li>
                          <img src="/assets/images/icon11.png" alt="" />
                          {activity.categories[1]?.name}
                        </li>
                        <li>
                          <img src="/assets/images/icon12.png" alt="" />
                          {activity.categories[2]?.name}
                        </li>
                        <li>
                          <img src="/assets/images/icon16.png" alt="" />
                          {activity.categories[3]?.name}
                        </li>
                        <li>
                          <img src="/assets/images/icon25.png" alt="" />
                          {activity.categories[4]?.name}
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Effects;
