import React, { useCallback, useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { httpClient } from '../../constants/Api';
import { MARKETINSIGHT } from '../../constants/AppConstant';
import { toast } from 'react-toastify';
import moment from 'moment';
import ReactStars from 'react-rating-stars-component';

function TopCategories() {
  const [topCategories, setTopCategories] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [date, setDate] = useState(false);
  const [dateRangePickerDate, setDateRangePickerDate] = useState({
    from: moment().startOf('month'),
    to: moment().endOf('month'),
  });

  useEffect(() => {
    getTopCategories();
  }, [dateRangePickerDate]);

  const dateRange = [
    { value: 1, month: 'This month' },
    { value: 2, month: 'Show Last 30 days' },
    { value: 4, month: 'Last months' },
    { value: 5, month: '3 months' },
    { value: 6, month: '6 months' },
    { value: 0, month: 'Date Range' },
  ];

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
      onChangeDateGetTopCategories(dateFrom, dateTo);
    }
  };

  const onChangeDateGetTopCategories = async (dateFrom, dateTo) => {
    try {
      setLoading(true);
      const categories = await httpClient.get(`${MARKETINSIGHT.GET_TOP_CATEGORIES}?from=${dateFrom}&to=${dateTo}`);
      setTopCategories(categories.data.categories);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getTopCategories = useCallback(async () => {
    onChangeDateGetTopCategories(dateRangePickerDate.from, dateRangePickerDate.to);
  }, [dateRangePickerDate]);

  const handleDateRange = async (event, picker) => {
    setDateRangePickerDate({
      from: moment(picker.startDate).format('l'),
      to: moment(picker.endDate).format('l'),
    });
  };

  return (
    <>
      <div className="mt-4">
        <div className="row">
          <div className="col-md-6">
            <h4>Top Categories</h4>
          </div>
          <div className="col-md-6">
            <div className="advertisement_row">
              <div className="entries_drop">
                <select
                  className="form-select form-select-sm ms-auto d-inline-flex w-auto"
                  value={date}
                  onChange={(e) => onChangeUpdate('demograph', e.target.value)}
                >
                  {dateRange && dateRange.map((date, ind) => <option value={date.value} key={ind}>{date.month}</option>)}
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
          </div>
        </div>
        {!isLoading && topCategories.length ? (
          topCategories.map((category, index) => (
            <div className="product_info_list" key={index}>
              <div>
                <strong>{category.category_name}</strong>
              </div>
              <p className="border-btm p-t-20 "></p>
              <div className="row">
                <div className="col-md-2">
                  <div className="entry-rate">
                    <ReactStars count={category.average_rating} size={24} color="#ffd700" />
                  </div>
                  <div className="p-t-5 primary_color">Avg. Rating</div>
                </div>
                <div className="col-md-3">
                  <b>{category.product_name}</b>
                  <div className="p-t-5 text-uppercase primary_color">Most Popular Products</div>
                </div>
                <div className="col-md-3">
                  <b>{category.totalEntries}</b>
                  <div className="p-t-5 text-uppercase primary_color">Total Entries</div>
                </div>
                <div className="col-md-2">
                  <b>{category.objective}</b>
                  <div className="p-t-5 text-uppercase primary_color">Top Objective</div>
                </div>
                <div className="col-md-2">
                  <b>{category.reason}</b>
                  <div className="p-t-5 text-uppercase primary_color">Top Reason</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="product_info_list text-center">
              <div>
                <strong>No Record to display</strong>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default TopCategories;
