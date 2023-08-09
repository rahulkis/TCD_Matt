import React, { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { httpClient } from "../../constants/Api";
import { ENTRIES } from "../../constants/AppConstant";
import moment from "moment";
import { setPageTitle } from "../../utils/Common";
import { useNavigate } from "react-router-dom";
import exportFromJSON from "export-from-json";
import { Collapse } from "react-bootstrap";
import CategoriesAlertModal from "./EntriesModals/CategoriesAlertModal";
import Loader from "../../layouts/Loader";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import Footer from "../../layouts/Footer";
import { starAveRatings } from '../../utils/Common';

function Entries() {
  const navigate = useNavigate();
  const [checkId, setCheckId] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [entryData, setEntryData] = useState();
  const [filterEntryData, setFilterEntryData] = useState();
  const [totalEntriesCount, setTotalEntriesCount] = useState();
  let [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [perPageRecord, setRecordPerPage] = useState(10);
  const [selectedExportType, setSelectedExportType] = useState("");
  const [selectDisabled, setSelectDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState();
  const [selectedColumnData, setSelectedColumnData] = useState();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [alertModalShow, setAlertModalShow] = useState(false);
  const [errorAlertModalShow, setErrorAlertModalShow] = useState(false);
  const [minMaxShowHideButton, setMinMaxShowHideButton] = useState(false);
  const [dateRangePickerDate, setDateRangePickerDate] = useState({
    from: moment().startOf("month"),
    to: moment().endOf("month"),
  });
  const categories = [
    { category_id: 1, category_name: "Entry date", defaultChecked: true },
    { category_id: 2, category_name: "User ID", defaultChecked: true },
    { category_id: 3, category_name: "Age", defaultChecked: false },
    { category_id: 4, category_name: "Sex", defaultChecked: false },
    { category_id: 5, category_name: "Purpose", defaultChecked: false },
    { category_id: 6, category_name: "Product Name", defaultChecked: true },
    {
      category_id: 7,
      category_name: "Completed Test Date",
      defaultChecked: false,
    },
    { category_id: 8, category_name: "Category", defaultChecked: true },
    { category_id: 9, category_name: "Reason", defaultChecked: true },
    { category_id: 10, category_name: "Rating", defaultChecked: true },
    { category_id: 11, category_name: "Reviews", defaultChecked: false },
    { category_id: 12, category_name: "Negative", defaultChecked: false },
    { category_id: 13, category_name: "Location", defaultChecked: false },
    { category_id: 14, category_name: "Experience", defaultChecked: true },
    { category_id: 15, category_name: "Time", defaultChecked: false },
    { category_id: 16, category_name: "Setting", defaultChecked: false },
    { category_id: 17, category_name: "Batch ID", defaultChecked: true },
    { category_id: 18, category_name: "Producer", defaultChecked: false },
    { category_id: 19, category_name: "Distributor", defaultChecked: false },
  ];

  const [updateCategories, setUpdateCategories] = useState(categories);

  const columns = [
    {
      name: "",
      selector: (row) => (
        <div>
          <input
            type="checkbox"
            defaultValue={row.entry_id}
            value={checkId}
            onChange={(e) => {
              // add to list
              if (e.target.checked) {
                setCheckId([
                  ...checkId,
                  {
                    id: row.entry_id,
                  },
                ]);
              } else {
                // remove from list
                let value = checkId.filter(
                  (people) => people.id !== row.entry_id
                );
                setCheckId(value);
              }
            }}
          />
        </div>
      ),
      id: "checkbox_design",
    },
    {
      name: "ENTRY DATE",
      selector: "createdAt",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {moment(row.createdAt).format("l")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "USER ID",
      selector: "userId",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>{row.userId}</span>
      ),
      sortable: true,
    },
    {
      name: "PRODUCT NAME",
      selector: "product",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>{row.product}</span>
      ),
      sortable: true,
    },
    {
      name: "CATEGORY",
      selector: "product_type",
      cell: (row) => (
        <span
          className={row.product_type ? "product_type" : ""}
          onClick={() => handleRedirectEntryInfo(row)}
        >
          {" "}
          {row.product_type ? row.product_type : "-"}{" "}
        </span>
      ),
      sortable: true,
    },
    {
      name: "REASON",
      selector: "consuption_reason",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.consuption_reason ? row.consuption_reason : "-"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "EXPERIENCE",
      className: "justify-content-center",
      selector: "isLikeDislike",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.isLikeDislike === 1 ? (
            <span className="lnr lnr-thumbs-up thumbsup"></span>
          ) : (
            <span className="lnr lnr-thumbs-down thumbsdown"></span>
          )}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "RATING",
      selector: "average_rating",
      cell: (row) => (
        <div className="entry-rate rating" onClick={() => handleRedirectEntryInfo(row)} dangerouslySetInnerHTML={{__html: starAveRatings(row.average_rating)}}></div>
      ),
      sortable: true,
    },
    {
      name: "BATCH ID",
      selector: "batchId",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.batchId ? row.batchId : "-"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "AGE",
      selector: "age",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.dob ? moment().diff(moment(row.dob), "years") : "-"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "SEX",
      selector: "sex",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.sex ? row.sex : "-"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "PURPOSE",
      selector: "purpose",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.consuption_reason ? row.consuption_reason : "-"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "COMPLETED TEST DATE",
      selector: "completedTestDate",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.tested_at ? moment(row.tested_at).format("l") : "-"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "REVIEWS",
      selector: "reviews",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.reviews ? row.reviews : "NA"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "NEGATIVE",
      selector: "negative",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.negatives ? row.negatives : "NA"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "LOCATION",
      selector: "location",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.location ? row.location : "NA"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "TIME",
      selector: "time",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.time ? row.time : "NA"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "SETTING",
      selector: "SETTING",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.setting ? row.setting : "NA"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "PRODUCER",
      selector: "producer",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.producer_name ? row.producer_name : "-"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "DISTRIBUTOR",
      selector: "distributor",
      cell: (row) => (
        <span onClick={() => handleRedirectEntryInfo(row)}>
          {row.distributor_name ? row.distributor_name : "-"}
        </span>
      ),
      sortable: true,
      center: true,
    },
  ];

  useEffect(() => {
    getEntries();
    setPageTitle("Entries");
  }, [page, perPageRecord, dateRangePickerDate]);

  const getEntries = async () => {    
    try {
      setLoading(true);
      await httpClient
        .get(
          `${ENTRIES.GET_ENTRIES}?page=${page}&perPageRecord=${perPageRecord}&from=${dateRangePickerDate.from}&to=${dateRangePickerDate.to}`
        )
        .then((res) => {
          if (res.data.success) {
            setEntryData(res.data.data.entries);
            setFilterEntryData(res.data.data.entries);
            setTotalEntriesCount(res.data.data.totalEntries);
            getDefaultSelectedCategoriesAndColumns();
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        });
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };

  const getDefaultSelectedCategoriesAndColumns = async () => {
    let mergeInArray = [];

    const firstcolumn = {
      id: columns[0].id,
      name: columns[0].name,
      selector: columns[0].selector,
    };
    mergeInArray = [...mergeInArray, firstcolumn];
    const findOnlyTrueCategories = updateCategories.filter(
      (cat) => cat.defaultChecked
    );

    for (let category of findOnlyTrueCategories) {
      let filterCoumns = columns.find(
        (col) => col.name.toLowerCase() === category.category_name.toLowerCase()
      );
      if (filterCoumns) {
        const objCategories = {
          name: filterCoumns.name ? filterCoumns.name : "",
          selector: filterCoumns.selector ? filterCoumns.selector : "",
          sortable: filterCoumns.sortable ? filterCoumns.sortable : "",
          cell: filterCoumns.cell ? filterCoumns.cell : "",
          center: filterCoumns.center ? filterCoumns.center : "",
        };
        mergeInArray = [...mergeInArray, objCategories];
        setSelectedCategories(mergeInArray);
        setSelectedColumn(mergeInArray);
      }
    }
  };

  const handleSearchValue = (e) => {
    const searchInitValue = e.target.value;
    setSearchValue(searchInitValue);
    getAllSearchValue(searchInitValue, page, perPageRecord);
  };

  const getAllSearchValue = async (searchValue, dateRangePicker) => {
    setLoading(true);
    const response = entryData.filter((data) => {
      return (
        data.product_type.toLowerCase().includes(searchValue.toLowerCase()) ||
        data.consuption_reason
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        moment(data.createdAt).isBetween(
          dateRangePicker.from,
          dateRangePicker.to
        )
      );
    });

    if (response) {
      setFilterEntryData(response);
      setTotalEntriesCount(response.length);
    }
    setLoading(false);
  };

  const handleExportData = async (e) => {
    let finalData =
      checkId.length > 0
        ? filterEntryData.filter((x) =>
            checkId.some((y) => x.entry_id === y.id)
          )
        : "";
    finalData = finalData ? finalData : filterEntryData;
    const fileType = e.target.value;
    setSelectedExportType(fileType);
    if (fileType) {
      setSelectDisabled(true);

      const objColumns = [
        { dbKey: "average_rating", colKey: "RATING" },
        { dbKey: "batchId", colKey: "BATCH ID" },
        { dbKey: "consuption_reason", colKey: "REASON" },
        { dbKey: "createdAt", colKey: "ENTRY DATE" },
        { dbKey: "distributor_name", colKey: "DISTRIBUTOR" },
        { dbKey: "dob", colKey: "AGE" },
        { dbKey: "entry_id", colKey: "ENTRY ID" },
        { dbKey: "isLikeDislike", colKey: "EXPERIENCE" },
        { dbKey: "location", colKey: "LOCATION" },
        { dbKey: "negatives", colKey: "NEGATIVE" },
        { dbKey: "producer_name", colKey: "PRODUCER" },
        { dbKey: "product", colKey: "PRODUCT NAME" },
        { dbKey: "product_type", colKey: "CATEGORY" },
        { dbKey: "reviews", colKey: "REVIEWS" },
        { dbKey: "sex", colKey: "SEX" },
        { dbKey: "tested_at", colKey: "COMPLETED TEST DATE" },
        { dbKey: "time", colKey: "TIME" },
        { dbKey: "userId", colKey: "USER ID" },
        { dbKey: "userName", colKey: "USER NAME" },
      ];

      const data = finalData.map((entryData) => {
        let requiredData = {};
        for (const obj of objColumns) {
          const selectedKey = selectedColumn.find(
            (col) => col.name === obj.colKey
          );
          if (selectedKey) {
            if (selectedKey.name === "ENTRY DATE") {
              requiredData = {
                ...requiredData,
                "ENTRY DATE": moment(entryData.createdAt).format("l"),
              };
            } else {
              requiredData = {
                ...requiredData,
                [obj.colKey]: entryData[obj.dbKey],
              };
            }
          }
        }
        return requiredData;
      });
      const fileName = "entries";
      const exportType =
        fileType === "xls"
          ? exportFromJSON.types.xls
          : exportFromJSON.types.csv;
      exportFromJSON({ data, fileName, exportType });
      setSelectDisabled(false);
    }
  };

  const handleRedirectEntryInfo = (row) => {
    navigate(`${"/entries/entries-info/"}${row.entry_id}/${row.userId}`);
  };

  const handleCategories = async (e) => {
    const { checked, name, id } = e.target;
    if (checked) {
      /*if (selectedCategories.length < 11) {*/
        // array 0 to 9
        setMinMaxShowHideButton(false);
        const catsArray = [];
        for (let cat of updateCategories) {
          if (cat.category_id === Number(id)) {
            catsArray.push({ ...cat, defaultChecked: checked });
          } else {
            catsArray.push(cat);
          }
        }
        setUpdateCategories(catsArray);
        const filterData = columns.find(
          (col) => col.name.toLowerCase() === name.toLowerCase()
        );
        if (filterData) {
          const findAlready = selectedCategories.find(
            (res) => res.name.toLowerCase() === filterData.name.toLowerCase()
          );
          if (!findAlready) {
            const objCategories = {
              name: filterData.name ? filterData.name : "",
              selector: filterData.selector ? filterData.selector : "",
              sortable: filterData.sortable ? filterData.sortable : "",
              cell: filterData.cell ? filterData.cell : "",
              center: filterData.center ? filterData.center : "",
            };
            const cat = [...selectedCategories, objCategories];
            setSelectedCategories(cat);
            setSelectedColumnData(cat);
          }
        }
      /*} else {
        setMinMaxShowHideButton(true);
        setAlertModalShow(true);
      }*/
    } else {
      /*if (selectedCategories.length > 9) {*/
        setMinMaxShowHideButton(false);
        const findIndex = selectedCategories.findIndex(
          (find) => find.name.toLowerCase() === name.toLowerCase()
        );
        if (findIndex > -1) {
          selectedCategories.splice(findIndex, 1);
          setSelectedCategories([...selectedCategories]);
          setSelectedColumnData([...selectedCategories]);
        }
      /*} else {
        setMinMaxShowHideButton(true);
        setErrorAlertModalShow(true);
      }*/
    }
  };

  const handleClose = () => {
    setAlertModalShow(false);
    setErrorAlertModalShow(false);
  };

  const handleUpdateCategories = () => {
    const selectedColumns = [...selectedColumnData];
    setSelectedColumn(selectedColumns);
  };

  const handleDateRange = async (event, picker) => {
    setDateRangePickerDate({
      from: moment(picker.startDate).format("l"),
      to: moment(picker.endDate).format("l"),
    });
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
                <div className="app_home app_header sticky w-100">
                  <h1 className="app-page-title">Entries</h1>
                  <p>{moment().format("LL")}</p>
                </div>
              </div>
              <div className="common_padding" style={{ marginTop: "145px" }}>
                <div className="main_search mb-4 align-items-center">
                  <div className="left_bar">
                    <div className="search_group">
                      <span className="lnr lnr-magnifier"></span>
                      <input
                        type="text"
                        className="form-control"
                        value={searchValue}
                        onChange={handleSearchValue}
                        placeholder="Search for entries by purpose, or category"
                      />
                    </div>
                  </div>
                  <div className="right_bar">
                    <div className="d-flex align-items-center justify-content-end">
                      <div className="exprot_select ms-2 m-0 me-2">
                        <DateRangePicker
                          onApply={handleDateRange}
                          initialSettings={{
                            startDate: moment().startOf("month").format("l"),
                            endDate: moment().endOf("month").format("l"),
                          }}
                        >
                          <input type="text" className="form-control" />
                        </DateRangePicker>
                      </div>

                      <a
                        id="categories_btn"
                        className={`btn ${open ? "categories_box" : ""}`}
                        onClick={() => setOpen(!open)}
                      >
                        <span className="lnr lnr-text-align-center category_icon"></span>
                        <span>Categories</span>
                      </a>

                      <div className="exprot_select ms-2 m-0">
                        <img src="/assets/images/icons/arrow2.svg" alt="" />
                        {selectDisabled ? (
                          <select
                            className="form-control"
                            value={selectedExportType}
                            onChange={handleExportData}
                            disabled
                          >
                            <option value="" disabled selected hidden>
                              Export
                            </option>
                            <option value="csv">.CSV file</option>
                            <option value="xls">Excel file</option>
                          </select>
                        ) : (
                          <select
                            className="form-control"
                            value={selectedExportType}
                            onChange={handleExportData}
                          >
                            <option value="" disabled selected hidden>
                              Export
                            </option>
                            <option value="csv">.CSV file</option>
                            <option value="xls">Excel file</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Collapse in={open}>
                  <div id="example-collapse-text" className="mb-2 ">
                    <div className="card card-body checkbox_wrpper">
                      {updateCategories &&
                        updateCategories.map((cat) => (
                          <div className="categories_checkbox custom_checkbox">
                            <input
                              type="checkbox"
                              id={cat.category_id}
                              name={cat.category_name}
                              onClick={(e) => handleCategories(e)}
                              defaultChecked={cat.defaultChecked}
                            />
                            <label htmlFor={cat.category_id}>
                              {cat.category_name}
                            </label>
                          </div>
                        ))}
                      <div className="filter_btn">
                        <button
                          className="btn btn-danger btn-color"
                          onClick={(e) => handleUpdateCategories(e)}
                          disabled={minMaxShowHideButton}
                        >
                          Update categories
                        </button>
                      </div>
                    </div>
                  </div>
                </Collapse>

                {filterEntryData && (
                  <DataTable
                    columns={selectedColumn}
                    data={filterEntryData}
                    highlightOnHover
                    pagination
                    paginationServer
                    responsive={true}
                    paginationTotalRows={totalEntriesCount}
                    paginationPerPage={perPageRecord}
                    progressPending={isLoading}
                    pointerOnHover={true}
                    onRowClicked={handleRedirectEntryInfo}
                    paginationComponentOptions={{
                      rowsPerPageText: "Records per page:",
                      rangeSeparatorText: "out of",
                    }}
                    onChangePage={(page) => setPage(page)}
                    onChangeRowsPerPage={(perPage) => setRecordPerPage(perPage)}
                  />
                )}
              </div>
              {alertModalShow && (
                <CategoriesAlertModal
                  show={alertModalShow}
                  close={handleClose}
                  message="Sorry! you can't select more than 10 categories."
                />
              )}
              {errorAlertModalShow && (
                <CategoriesAlertModal
                  show={errorAlertModalShow}
                  close={handleClose}
                  message="Sorry! you can't remove less than 8 categories."
                />
              )}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Entries;
