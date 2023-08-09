import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../../layouts/Sidebar';
import DataTable from 'react-data-table-component';
import { setPageTitle } from '../../utils/Common';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Footer from '../../layouts/Footer';
import { httpClient } from '../../constants/Api';
import Loader from '../../layouts/Loader';
import { MARKETINSIGHT } from '../../constants/AppConstant';
import { toast } from 'react-toastify';
import ReactStars from 'react-rating-stars-component';
import 'bootstrap-daterangepicker/daterangepicker.css';
import TopCategories from './TopCategories';
import TopActivities from './objective/TopActivities';
import HealthConditions from './objective/HealthConditions';
import Effects from './objective/Effects';
import Symptoms from './objective/Symptoms';
import TopBrands from './brands/TopBrands';
import MaleUsers from './consumers/MaleUsers';
import FemaleUsers from './consumers/FemaleUsers';
import NonBinaryUser from './consumers/NonBinaryUser';

const columns = [
  {
    name: 'PRODUCT NAME',
    index: 'productName',
    selector: (row) => <span> {row.productName} </span>,
    sortable: true,
  },
  {
    name: 'CATEGORY',
    selector: (row) => <>{row.product_type ? <span className="product_type">{row.product_type}</span> : ''}</>,
    sortable: true,
  },
  {
    name: 'ENTRIES',
    selector: (row) => <span> {row.totalEntriesCount} </span>,
    sortable: true,
  },
  {
    name: 'RATING',
    selector: (row) => (
      <div className="entry-rate rating">
        <ReactStars count={row.rating} size={24} color="#ffd700" />
      </div>
    ),
    sortable: true,
  },
  {
    name: 'BRAND',
    selector: (row) => <span> {row.brand} </span>,
    sortable: true,
  },
];

const dateRange = [
  { value: 1, month: 'This month' },
  { value: 2, month: 'Show Last 30 days' },
  { value: 4, month: 'Last months' },
  { value: 5, month: '3 months' },
  { value: 6, month: '6 months' },
  { value: 0, month: 'Date Range' },
];

function MarketInsight() {
  const [topProducts, setTopProducts] = useState();
  const [dateRangePickerDate, setDateRangePickerDate] = useState({
    from: moment().startOf('month'),
    to: moment().endOf('month'),
  });
  const [page, setPage] = useState(1);
  const [perPageRecord, setRecordPerPage] = useState(10);
  const [isLoading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [date, setDate] = useState(false);

  useEffect(() => {
    getMarketInsights();
    setPageTitle('MarketInsight');
  }, [page, dateRangePickerDate, perPageRecord]);

  useEffect(() => {
    getAllStates();
    scrollOnLoad();
  }, []);

  const scrollOnLoad = () => {
    window.scrollTo(0, 0);
  };

  const handleDateRange = async (event, picker) => {
    setDateRangePickerDate({
      from: moment(picker.startDate).format('l'),
      to: moment(picker.endDate).format('l'),
    });
  };

  const getAllStates = async () => {
    try {
      const states_arr = [];
      setLoading(true);
      const result = await httpClient.get(`${MARKETINSIGHT.GET_STATES}`);
      result.data.states.map((r) => {
        return states_arr.push({ label: r.name, value: r.id });
      });
      setStates(states_arr);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
    }
  };
  const onChangeUpdate = async (type, changeToDate) => {
    var date = new Date();
    var dateFrom, dateTo;
    if (changeToDate && changeToDate === '0') {
      setDate(changeToDate);
    } else {
      setDate(changeToDate);
      if (changeToDate === '1') {
        // This Month
        dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
        dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      } else if (changeToDate === '2') {
        // Last 30 Days
        dateFrom = new Date(date.getFullYear(), date.getMonth(), -30);
        dateTo = new Date(date.getFullYear(), date.getMonth(), 0);
      } else if (changeToDate === '4') {
        // Last month
        dateFrom = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        dateTo = new Date(date.getFullYear(), date.getMonth(), 0);
      } else if (changeToDate === '5') {
        // Last 3 months
        dateFrom = new Date(date.getFullYear(), date.getMonth() - 3, 1);
        dateTo = new Date(date.getFullYear(), date.getMonth(), 0);
      } else if (changeToDate === '6') {
        // Last 6 months
        dateFrom = new Date(date.getFullYear(), date.getMonth() - 6, 1);
        dateTo = new Date(date.getFullYear(), date.getMonth(), 0);
      }
      onChangeGetMarketInsights(dateFrom, dateTo);
    }
  };

  const onChangeGetMarketInsights = async (dateFrom, dateTo) => {
    try {
      setLoading(true);
      await httpClient
        .get(`${MARKETINSIGHT.GET_TOP_PRODUCTS}?page=${page}&perPageRecord=${perPageRecord}&from=${dateFrom}&to=${dateTo}`)
        .then((res) => {
          if (res.data.success) {
            setTopProducts(res.data.data.products);
            setTotalProducts(res.data.data.totalEntries);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error('Something went wrong');
        });
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
    }
  };
  const getMarketInsights = useCallback(async () => {
    onChangeGetMarketInsights(dateRangePickerDate.from, dateRangePickerDate.to);
  }, [page, dateRangePickerDate, perPageRecord]);

  const handlePageChange = (page) => {
    setPage(page);
  };
  const handlePerRowsChange = (rows) => {
    setRecordPerPage(rows);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content">
            <div className="container-xl">
              <div className="row g-4">
                <div className="app_home app_consumer app_header sticky w-100">
                  <h1 className="app-page-title">Market Insight</h1>
                  <p>{moment().format('LL')}</p>
                </div>
              </div>

              <div className="nav_tabs common_padding" style={{ marginTop: '130px' }}>
                <nav id="orders-table-tab" className="orders-table-tab nav_tabs_main nav flex-column flex-sm-row custom_tabs sticky_tabs	">
                  <a
                    className="nav-link active"
                    id="products-tab"
                    data-bs-toggle="tab"
                    href="#products"
                    role="tab"
                    aria-controls="products"
                    aria-selected="true"
                    onClick={scrollOnLoad}
                  >
                    Products
                  </a>
                  <a
                    className="nav-link"
                    id="objectives-tab"
                    data-bs-toggle="tab"
                    href="#objectives"
                    role="tab"
                    aria-controls="objectives"
                    aria-selected="true"
                    onClick={scrollOnLoad}
                  >
                    Objectives & Reasons
                  </a>
                  <a
                    className="nav-link"
                    id="consumers-tab"
                    data-bs-toggle="tab"
                    href="#consumers"
                    role="tab"
                    aria-controls="consumers"
                    aria-selected="true"
                    onClick={scrollOnLoad}
                  >
                    Consumers
                  </a>
                  <a
                    className="nav-link"
                    id="brands-tab"
                    data-bs-toggle="tab"
                    href="#brands"
                    role="tab"
                    aria-controls="brands"
                    aria-selected="true"
                    onClick={scrollOnLoad}
                  >
                    Brands
                  </a>
                </nav>
                <div className="tab-content" id="orders-table-tab-content">
                  <div className="tab-pane fade show active" id="products" role="tabpanel" aria-labelledby="products-tab">
                    <div className="advertisement_row">
                      <div className="entries_drop">
                        <select
                          className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                          value={date}
                          onChange={(e) => onChangeUpdate('demograph', e.target.value)}
                        >
                          {dateRange &&
                            dateRange.map((date, ind) => (
                              <option value={date.value} key={ind}>
                                {date.month}
                              </option>
                            ))}
                        </select>
                        {date && date === '0' && (
                          <DateRangePicker
                            onApply={handleDateRange}
                            initialSettings={{
                              startDate: moment().startOf('month').format('l'),
                              endDate: moment().endOf('month').format('l'),
                            }}
                          >
                            <input type="text" className="form-control" />
                          </DateRangePicker>
                        )}
                      </div>
                    </div>
                    <div className="mt-31">
                      <DataTable
                        title="Top Products"
                        columns={columns}
                        data={topProducts}
                        progressPending={isLoading}
                        highlightOnHover
                        pagination
                        paginationServer
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 50, 100]}
                        paginationComponentOptions={{
                          rowsPerPageText: 'Records per page:',
                          rangeSeparatorText: 'out of',
                        }}
                        paginationTotalRows={totalProducts}
                        onChangeRowsPerPage={(row) => handlePerRowsChange(row)}
                        onChangePage={(page) => handlePageChange(page)}
                      />
                    </div>
                    <TopCategories />
                  </div>

                  <div className="tab-pane fade" id="objectives" role="tabpanel" aria-labelledby="objectives-tab">
                    <TopActivities />

                    <HealthConditions />

                    <Effects />

                    <Symptoms />
                  </div>
                  <div className="tab-pane fade" id="consumers" role="tabpanel" aria-labelledby="consumers-tab">
                    <div className="entries_drop">
                      <select
                        className="form-select form-select-sm ms-auto d-inline-flex w-auto mt-2"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                      >
                        <option value="" placeholder="Select State">
                          {' '}
                          Select State
                        </option>
                        {states.map((s) => (
                          <option value={s.value} key={s.value}>
                            {' '}
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <MaleUsers state={selectedState} />
                    <FemaleUsers state={selectedState} />
                    <NonBinaryUser state={selectedState} />
                  </div>
                  <div className="tab-pane fade" id="brands" role="tabpanel" aria-labelledby="brands-tab">
                    <TopBrands />
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

export default MarketInsight;
