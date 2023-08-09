import React, { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import { toast } from "react-toastify";
import { httpClient } from "../../constants/Api";
import { ENTRIES } from "../../constants/AppConstant";
import moment from "moment";
import { setPageTitle } from "../../utils/Common";
import { useParams, Link } from "react-router-dom";
import Loader from "../../layouts/Loader";
import Footer from "../../layouts/Footer";

function EntriesInfo() {
  const { entryId, userId } = useParams();
  const [entryData, setEntryData] = useState();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    getEntriesInfo();
    setPageTitle("Entries");
  }, []);

  const getEntriesInfo = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(
          ENTRIES.GET_ENTRIES_INFO.replace("{entryId}", entryId).replace(
            "{userId}",
            userId
          )
        )
        .then((res) => {
          if (res.data.success) {
            setEntryData(res.data.data.entryInfo);
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

  return (
    <>
      {isLoading && <Loader />}
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content">
            {entryData && (
              <div className="container-xl">
                <div className="row g-4 align-items-end ">
                  <div
                    className="app_home app_header d-flex align-items-lg-end sticky w-100"
                  >
                    <div>
                      <div className="mb-4">
                        <Link to="/entries" className="backto-btn">
                          <span className="lnr lnr-arrow-left mr-2"></span>{" "}
                          &nbsp; Back to Entries
                        </Link>
                      </div>
                      <h1 className="app-page-title">{entryData.entry_id}</h1>
                      <div className="p-t-5 primary_color">ENTRY ID</div>
                    </div>
                    <div className="mx-5">
                      <h6 className="app-page-title ">{entryData.userId}</h6>
                      <div className="p-t-5 primary_color">USER ID</div>
                    </div>
                    <div>
                      <h6 className="app-page-title">
                        {moment(entryData.createdAt).format("l")}
                      </h6>
                      <div className="p-t-5 primary_color">DATE</div>
                    </div>
                  </div>
                </div>
                <div className="common_padding" style={{ marginTop: "225px" }}>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="product_info_list padding-lft">
                        <b className="infosub_heading">User info</b>
                        <div className="border-btm p-t-10 m-b-10"></div>
                        <div className="row">
                          <div className="col-md-12">
                            <b>{entryData.totalEntries}</b>
                            <div className="p-t-5 primary_color">
                              TOTAL ENTRIES
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-12">
                            <b>
                              {moment().diff(moment(entryData.dob), "years")}
                            </b>
                            <div className="p-t-5 primary_color">AGE</div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-12">
                            <b>{entryData.gender}</b>
                            <div className="p-t-5 primary_color">SEX</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-10">
                      <div className="product_info_list padding-lft products_info_list">
                        <b className="infosub_heading">Product info</b>
                        <div className="border-btm p-t-10 m-b-10"></div>
                        <div className="row">
                          <div className="col-md-6">
                            <b>{entryData.product}</b>
                            <div className="p-t-5 primary_color">
                              Product name
                            </div>
                          </div>
                          <div className="col-md-6">
                            <b>{entryData.distributor_name}</b>
                            <div className="p-t-5 primary_color">
                              Distributor
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-6">
                            <span className="curl_text">
                              {entryData.product_type}
                            </span>
                            <div className="p-t-5 primary_color">
                              Product Category
                            </div>
                          </div>
                          <div className="col-md-6">
                            <b>
                              {entryData
                                ? entryData.tested_at
                                  ? moment(entryData.tested_at).format("l")
                                  : "-"
                                : "-"}
                            </b>
                            <div className="p-t-5 primary_color">
                              Completed test date
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-6">
                            <b>{entryData.producer_name}</b>
                            <div className="p-t-5 primary_color ">Producer</div>
                          </div>
                          <div className="col-md-6">
                            <b>{entryData.batch_id}</b>
                            <div className="p-t-5 primary_color">BATCH ID</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="product_info_list m-t-20 products_info_list product_list_mr mx-0">
                    <div className="infosub_heading">Objective & Result</div>
                    <p className="border-btm p-t-20 "></p>
                    <div className="row">
                      <div className="col-md-3">
                        <b>{entryData.consumption_reason}</b>
                        <div className="p-t-5 primary_color">PURPOSE</div>
                      </div>
                      <div className="col-md-3">
                        <b>{entryData.consumption_reason}</b>
                        <div className="p-t-5 primary_color">REASON</div>
                      </div>
                      <div className="col-md-3">
                        <div className="entry-rate rating">
                          {entryData.average_rating === "1" ? (
                            <>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : entryData.average_rating === "2" ? (
                            <>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : entryData.average_rating === "3" ? (
                            <>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : entryData.average_rating === "4" ? (
                            <>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : entryData.average_rating === "5" ? (
                            <>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : (
                            <>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          )}
                        </div>
                        <div className="p-t-5 primary_color">RATING</div>
                      </div>
                      <div className="col-md-3">
                        <b>
                          {entryData.isLikeDislike === 1 ? (
                            <span className="lnr lnr-thumbs-up thumbsup"></span>
                          ) : (
                            <span className="lnr lnr-thumbs-down thumbsdown"></span>
                          )}
                        </b>
                        <div className="p-t-5 primary_color">EXPERIENCE</div>
                      </div>
                    </div>
                    <div className="row p-t-20">
                      <div className="col-md-3">
                        <b>NA</b>
                        <div className="p-t-5 primary_color">NEGATIVES</div>
                      </div>
                      <div className="col-md-3">
                        <b>NA</b>
                        <div className="p-t-5 primary_color">LOCATION</div>
                      </div>
                      <div className="col-md-3">
                        <b>NA</b>
                        <div className="p-t-5 primary_color">TIME</div>
                      </div>
                      <div className="col-md-3">
                        <b>NA</b>
                        <div className="p-t-5 primary_color">SETTING</div>
                      </div>
                    </div>

                    {entryData.is_public == 1 && (
                      <div className="row p-t-20">
                        <div className="col-md-12">
                          <p className="entry_gummies">
                            <b className="mr-2">
                              {moment(entryData.createdAt).format("l")}:
                            </b>{" "}
                            <i>{entryData.comments}</i>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default EntriesInfo;
