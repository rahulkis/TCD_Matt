import React, { useState, useEffect } from 'react';
import CategoryGraphServices from './category.graph.services';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { CONSUMERS } from '../../constants/AppConstant';
import { starAveRatings } from '../../utils/Common';
import moment from 'moment';
import { httpClient } from '../../constants/Api';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      data: [8, 1, 3, 0, 13, 5],
      borderColor: 'rgba(34, 64, 47, 1)',
      backgroundColor: 'rgba(34, 64, 47, 1)',
    },
    {
      data: [3, 13, 1, 0, 4, 10],
      borderColor: 'rgba(44, 99, 66, 1)',
      backgroundColor: 'rgba(44, 99, 66, 1)',
    },
    {
      data: [2, 10, 0, 4, 5, 1],
      borderColor: 'rgba(169, 201, 182, 0.57)',
      backgroundColor: 'rgba(169, 201, 182, 0.57)',
    },
    {
      data: [0, 1, 4, 0, 1, 0],
      borderColor: 'rgba(104, 204, 143, 1)',
      backgroundColor: 'rgba(104, 204, 143, 1)',
    },
  ],
};

const CategoryServicesLayout = (activeContentTab) => {
  const [date, setDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryEntriesData, setCategoryEntries] = useState();
  const [categoryMainGraphData, setCategoryMainGraphData] = useState();
  const [categoryTableData, setCategoryTabeData] = useState();
  const [dateReason, setDateReason] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getCategoryData();
  }, []);

  const getCategoryData = async () => {
    try {
      setLoading(true);
      var date = new Date();
      var dateFrom, dateTo;
      dateFrom = new Date(date.getFullYear(), date.getMonth()-6, 1);
      dateTo = new Date(date.getFullYear(), date.getMonth(), 0);
      const response = await httpClient.get(CONSUMERS.GET_CATEGORIES+'?categoriesFrom='+dateFrom+'&categoriesTo='+dateTo);
      const dataResponse = response.data.data;
      setCategoryMainGraphData(dataResponse.slice(0, 6));
      setCategoryTabeData(dataResponse.slice(0, 6));
      setLoading(false);
    } catch (err) {
        return 'Something went wrong';
    }
  };
  const clickPurposeHandler = async (data) => {
    const id = data.target.getAttribute('data-id')
    navigate(`${"/consumers/profiles/category/"}${id}`);
  };
  const dateRange = [
    { value: 6, month: "6 months" },
    { value: 1, month: "This month" },
    { value: 2, month: "Show Last 30 days" },
    { value: 4, month: "Last months" },
    { value: 5, month: "3 months" },
    { value: 0, month: "Date Range" },
    ];
  
  const onChangeUpdate = async (type, changeToDate) => {
    var date = new Date();
    var dateFrom, dateTo;
    if (changeToDate && changeToDate === '0') {
      if (type === 'categories') setDate(changeToDate);
      if (type === 'reasons') setDateReason(changeToDate);
    } else {
      if (type === 'categories') setDate(changeToDate);
      if (type === 'reasons') setDateReason(changeToDate);
      if (changeToDate === '1') {
        // This Month
        dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
        dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      } else if (changeToDate === '2') {
        // Last 30 Days
        dateFrom = new Date(date.getFullYear(), date.getMonth(), -30);
        dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      } else if (changeToDate === '4') {
        // Last month
        dateFrom = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      } else if (changeToDate === '5') {
        // Last 3 months
        dateFrom = new Date(date.getFullYear(), date.getMonth() - 3, 1);
        dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      } else if (changeToDate === '6') {
        // Last 6 months
        dateFrom = new Date(date.getFullYear(), date.getMonth() - 6, 1);
        dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      }
      try {
        setLoading(true);
        const response = await httpClient.get(CONSUMERS.GET_CATEGORIES + '?categoriesFrom=' + dateFrom + '&categoriesTo=' + dateTo);
        const dataResponse = response.data.data;
        setCategoryMainGraphData(dataResponse.slice(0, 6));
        setCategoryTabeData(dataResponse.slice(0, 6));
        setLoading(false);
      } catch (err) {
        return 'Something went wrong';
      }
    }
  };

  const handleDateRange = async (start, picker) => {
    try {
      setLoading(true);
      var purposefrom = new Date(picker.startDate._d);
      var purposeTo = new Date(picker.endDate._d);
      const response = await httpClient.get(CONSUMERS.GET_CATEGORIES + '?categoriesFrom=' + purposefrom + '&categoriesTo=' + purposeTo);
      const dataResponse = response.data.data;
      setCategoryMainGraphData(dataResponse.slice(0, 6));
      setCategoryTabeData(dataResponse.slice(0, 6));
      setCategoryEntries(dataResponse.slice(0, 6));
      setLoading(false);
    } catch (err) {
      return 'Something went wrong';
    }
  };
  return (
    <div
      className={'tab-pane fade ' + activeContentTab.activeContentTab.activeContent}
      id="orders-category"
      role="tabpanel"
      aria-labelledby="orders-category-tab"
    >
      <div className="app-card app-card-orders-table mb-5">
        <div className="app-card-body">
          <div className="row g-4 mb-3 demograph_sec p-0">
            <div className="col-12">
              <div className="demograph_main">
                <div className="demopie_chart">
                  <div className="demograph_row">
                    <div className="demograph_title">
                      <h4> Entries by Category</h4>
                    </div>
                    <div className="entries_drop">
                      <select
                        className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                        value={date}
                        onChange={(e) => onChangeUpdate('categories', e.target.value)}
                      >
                        {dateRange && dateRange.map((date) => <option value={date.value}>{date.month}</option>)}
                      </select>
                      {date && date === '0' && (
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
                  {categoryMainGraphData && <CategoryGraphServices chartName="main_graph" data={categoryMainGraphData} />}
                </div>

                <div className="table-responsive mb-4">
                  <table className="table app-table-hover mb-0 text-left table-hover">
                    <thead>
                      <tr>
                        <th className="cell">CATEGORY</th>
                        <th className="cell">ENTRIES</th>
                        <th className="cell">USERS</th>
                        <th className="cell">AVERAGE ENTRIES</th>
                        <th className="cell">AVERAGE RATING</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryTableData &&
                        categoryTableData.map(function (object, i) {
                          return (
                            <tr style={{ cursor: 'pointer' }} onClick={clickPurposeHandler}>
                              <td className="cell" data-id={categoryTableData[i].product_type_id}>
                                {categoryTableData[i].name}
                              </td>
                              <td className="cell" data-id={categoryTableData[i].product_type_id}>
                                {categoryTableData[i].total_entries}
                              </td>
                              <td className="cell" data-id={categoryTableData[i].product_type_id}>
                                {categoryTableData[i].total_users}
                              </td>
                              <td className="cell" data-id={categoryTableData[i].product_type_id}>
                                {categoryTableData[i].average_entries}
                              </td>
                              <td className="cell" data-id={categoryTableData[i].product_type_id}>
                                <div className="content" dangerouslySetInnerHTML={{ __html: starAveRatings(categoryTableData[i].average_ratings) }}></div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                <div className="demopie_chart">
                  <div className="demopie_row">
                    <div className="demopie_title">
                      <h5>Preroll</h5>
                    </div>

                    <div className="demopie_drop">
                      <a href="/">
                        {' '}
                        <img src="/assets/images/icons/arrow2.svg" alt="" /> Export
                      </a>
                    </div>
                  </div>

                  <div className="demograph_chart">
                    <div className="demograph_chart_left">
                      <div className="analist_chart">
                        <CategoryGraphServices chartName="data_preroll" />
                      </div>

                      <div className="demograph_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="demograph_chart_right">
                      <div className="progress_list">
                        <CategoryGraphServices chartName="data_preroll_entries" />
                      </div>

                      <div className="progressbtm_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="demopie_chart">
                  <div className="demopie_row">
                    <div className="demopie_title">
                      <h5>Drinks</h5>
                    </div>

                    <div className="demopie_drop">
                      <a href="/">
                        {' '}
                        <img src="/assets/images/icons/arrow2.svg" alt="" /> Export
                      </a>
                    </div>
                  </div>

                  <div className="demograph_chart">
                    <div className="demograph_chart_left">
                      <div className="analist_chart">
                        <CategoryGraphServices chartName="data_drinks" />
                      </div>

                      <div className="demograph_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="demograph_chart_right">
                      <div className="progress_list">
                        <CategoryGraphServices chartName="data_drinks_entries" />
                      </div>

                      <div className="progressbtm_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="demopie_chart">
                  <div className="demopie_row">
                    <div className="demopie_title">
                      <h5>Edibles</h5>
                    </div>

                    <div className="demopie_drop">
                      <a href="/">
                        {' '}
                        <img src="/assets/images/icons/arrow2.svg" alt="" /> Export
                      </a>
                    </div>
                  </div>

                  <div className="demograph_chart">
                    <div className="demograph_chart_left">
                      <div className="analist_chart">
                        <CategoryGraphServices chartName="data_edibles" />
                      </div>

                      <div className="demograph_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="demograph_chart_right">
                      <div className="progress_list">
                        <CategoryGraphServices chartName="data_edibles_entries" />
                      </div>

                      <div className="progressbtm_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="demopie_chart">
                  <div className="demopie_row">
                    <div className="demopie_title">
                      <h5>Flower</h5>
                    </div>

                    <div className="demopie_drop">
                      <a href="/">
                        {' '}
                        <img src="/assets/images/icons/arrow2.svg" alt="" /> Export
                      </a>
                    </div>
                  </div>

                  <div className="demograph_chart">
                    <div className="demograph_chart_left">
                      <div className="analist_chart">
                        <CategoryGraphServices chartName="data_flower" />
                      </div>

                      <div className="demograph_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="demograph_chart_right">
                      <div className="progress_list">
                        <CategoryGraphServices chartName="data_flower_entries" />
                      </div>

                      <div className="progressbtm_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="demopie_chart">
                  <div className="demopie_row">
                    <div className="demopie_title">
                      <h5>Vapes</h5>
                    </div>

                    <div className="demopie_drop">
                      <a href="/">
                        {' '}
                        <img src="/assets/images/icons/arrow2.svg" alt="" /> Export
                      </a>
                    </div>
                  </div>

                  <div className="demograph_chart">
                    <div className="demograph_chart_left">
                      <div className="analist_chart">
                        <CategoryGraphServices chartName="data_vape" />
                      </div>

                      <div className="demograph_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="demograph_chart_right">
                      <div className="progress_list">
                        <CategoryGraphServices chartName="data_vape_entries" />
                      </div>

                      <div className="progressbtm_list">
                        <ul>
                          <li>
                            {' '}
                            <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                          </li>
                          <li>
                            {' '}
                            <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="demopie_chart">
                      <div className="demopie_row">
                        <div className="demopie_title">
                          <h5>Ingestible</h5>
                        </div>

                        <div className="demopie_drop">
                          <a href="/">
                            {' '}
                            <img src="/assets/images/icons/arrow2.svg" alt="" /> Export
                          </a>
                        </div>
                      </div>

                      <div className="demograph_chart">
                        <div className="demograph_chart_left">
                          <div className="analist_chart">
                            <CategoryGraphServices chartName="data_ingestible" />
                          </div>

                          <div className="demograph_list">
                            <ul>
                              <li>
                                {' '}
                                <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                              </li>
                              <li>
                                {' '}
                                <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                              </li>
                              <li>
                                {' '}
                                <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="demograph_chart_right">
                          <div className="progress_list">
                            <CategoryGraphServices chartName="data_ingestible_entries" />
                          </div>

                          <div className="progressbtm_list">
                            <ul>
                              <li>
                                {' '}
                                <img src="/assets/images/icon10.png" alt="" /> Male{' '}
                              </li>
                              <li>
                                {' '}
                                <img src="/assets/images/icon11.png" alt="" /> Female{' '}
                              </li>
                              <li>
                                {' '}
                                <img src="/assets/images/icon12.png" alt="" /> Non-binary{' '}
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
      </div>
    </div>
  );
};
export default CategoryServicesLayout;
