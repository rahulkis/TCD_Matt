import React, { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import DataTable from "react-data-table-component";
import { setPageTitle } from "../../utils/Common";
import { Link } from "react-router-dom";
import StartCampaignModal from "./AdvertisementModals/StartCampaignModal";
import { ADVERTISEMENT } from "../../constants/AppConstant";
import { httpClient } from "../../constants/Api";
import Loader from "../../layouts/Loader";
import { toast } from "react-toastify";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import Footer from "../../layouts/Footer";

function Advertisement() {
  const [showCampaign, setShowCampaign] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [totalAds, setTotalAds] = useState([]);
  const [campaignDate, setCampaignDate] = useState();
  const [isLoading, setLoading] = useState(false);

  const columns = [
    {
      name: "CAMPAIGN NAME",
      selector: (row) => <span> {row.campaign_name} </span>,
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => <span className="running_ad"> All ads running </span>,
      sortable: true,
    },
    {
      name: "IMPRESSIONS",
      selector: (row) => <span> 12,012 </span>,
      sortable: true,
    },
    {
      name: "CLICKS",
      selector: (row) => <span> 102 </span>,
      sortable: true,
    },
    {
      name: "",
      selector: (row) => (
        <div className="yoo-line-1-2 yoo-base-color1">
          <Link to={`/advertisement/view-campaign/${row.id}`}>
            <button
              type="button"
              style={{ width: "70px", padding: "3px", marginBottom: "5px" }}
            >
              {" "}
              View <span className="lnr lnr-arrow-right "></span>
            </button>
          </Link>
        </div>
      ),
      sortable: false,
    },
  ];

  useEffect(() => {
    setPageTitle("Advertisement");
    getCampaignsList();
    getAdsInfo();
  }, []);
  const dateRange = [
    { value: 6, month: "6 months" },
    { value: 5, month: "5 months" },
    { value: 1, month: "This Month" },
    { value: 4, month: "Last 4 months" },
    { value: 0, month: "Date Range" },
  ];
  const handleClose = () => {
    setShowCampaign(false);
    getCampaignsList();
  };

  const getAdsInfo = async () => {
    try {
      setLoading(true);
      const res = await httpClient.get(ADVERTISEMENT.GET_ADS_INFO);
      if (res.data.success) {
        setTotalAds(res.data.totalAds);
        setLoading(false);
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };

  const getCampaignsList = async () => {
    try {
      setLoading(true);
      const res = await httpClient.get(ADVERTISEMENT.GET_CAMPAIGNS);
      if (res.data.success) {
        setCampaignData(res.data.data.campaigns);
        setLoading(false);
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };
  const handleDateRange = async () => {};
  return (
    <>
      {isLoading && <Loader />}
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content">
            <div className="container-xl">
              <div className="row g-4">
                <div
                  className="app_home app_advertisement app_header sticky"
                >
                  <h1 className="app-page-title">Advertisement</h1>
                  <div className="start_campaign ms-auto">
                    <button
                      className="btn btn-danger btn-color"
                      onClick={() => setShowCampaign(true)}
                    >
                      Start a Campaign
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="advertisement_row  common_padding mb-3"
                style={{ marginTop: "170px" }}
              >
                <div className="entries_drop">
                  <select
                    className="form-select form-select-sm ms-auto d-inline-flex w-auto mt-2"
                    value={campaignDate}
                    onChange={(e) => setCampaignDate(e.target.value)}
                  >
                    {dateRange &&
                      dateRange.map((date, ind) => (
                        <option value={date.value} key={ind}>{date.month}</option>
                      ))}
                  </select>
                  {campaignDate && campaignDate == "0" && (
                    <DateRangePicker
                      onApply={handleDateRange}
                      initialSettings={{
                        startDate: moment(),
                        endDate: moment(),
                      }}
                    >
                      <input type="text" className="form-control mt-2" />
                    </DateRangePicker>
                  )}
                </div>
              </div>

              <div className="row g-4 mb-3 total_list total_list_boxes">
                <div className="col-6 col-lg-3 col-md-3">
                  <div className="total_list_card h-100">
                    <div className="app-card-body p-lg-4 p-md-4">
                      <h5>Total ads</h5>
                      <span>{totalAds}</span>
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
              <div className="advertisement_table">
                {campaignData && (
                  <DataTable
                    columns={columns}
                    data={campaignData}
                    progressPending={isLoading}
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
      {showCampaign && (
        <StartCampaignModal show={showCampaign} close={handleClose} name="" />
      )}
    </>
  );
}

export default Advertisement;
