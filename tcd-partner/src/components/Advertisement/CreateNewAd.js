import React, { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import NeedHelpModal from "./AdvertisementModals/NeedHelpModal";
import { ADVERTISEMENT } from "../../constants/AppConstant";
import { httpClient } from "../../constants/Api";
import { toast } from "react-toastify";
import "bs-stepper/dist/css/bs-stepper.min.css";
import Stepper from "bs-stepper";
import { setPageTitle } from "../../utils/Common";
import Footer from "../../layouts/Footer";
import Preview from "./Preview";

function CreateNewAd() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  let location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const advertisementId = queryParams.get("advertisementId");
  const partnerData = localStorage.getItem("partner");
  const partnerDataId = partnerData ? JSON.parse(partnerData).id : "";
  const [showHelp, setHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const tempAdName = localStorage.getItem("tempAdName");
  const [values, setValues] = useState({});
  const [count, setCount] = useState(0);
  const [stepperCount, setStepperCount] = useState(1);
  const [adsName, setAdsName] = useState("");
  const [adPlacementPage, setAdPlacementPage] = useState([]);

  useEffect(() => {
    setPageTitle("Create New Ad");
    initializeStepper();
    if (advertisementId) {
      viewEditAdvertisement();
    }
    setValues({
      ...values,
      partner_id: partnerDataId,
    });
  }, []);

  let step;

  const initializeStepper = () => {
    step = new Stepper(document.querySelector(".bs-stepper"), {
      linear: false,
      animation: true,
    });
    setStepperCount(step);
  };

  const handleNextStepper = () => {
    stepperCount.next();
  };

  const handleBackStepper = () => {
    stepperCount.previous();
  };

  const handleClose = () => {
    setHelp(false);
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
      const priceValue = values.type.split(" ");
      const finalValue = priceValue[1].split("$");
      const multiplyBy = priceValue[0] === "Video-Ad" ? 10 : 100;
      const setPrice = Number(finalValue[1]) * multiplyBy * (count - 1);
      setAdsName(priceValue[0]);
      setValues({
        ...values,
        total_cost: setPrice,
        video_package_qty: count - 1,
      });
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
    const priceValue = values.type.split(" ");
    const finalValue = priceValue[1].split("$");
    const multiplyBy = priceValue[0] === "Video-Ad" ? 10 : 100;
    const setPrice = Number(finalValue[1]) * multiplyBy * (count + 1);
    setAdsName(priceValue[0]);
    setValues({
      ...values,
      total_cost: setPrice,
      video_package_qty: count + 1,
    });
  };

  const viewEditAdvertisement = async () => {
    try {
      setLoading(true);
      const res = await httpClient.get(
        `${ADVERTISEMENT.VIEW_ADS_BY_ID.replace(
          "{advertisementId}",
          advertisementId
        )}`
      );
      setValues(res.data.data);
      setAdPlacementPage(res.data.data.placement_page);
      setCount(res.data.data.video_package_qty);
      setAdsName(res.data.data.type.split(" ")[0]);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOnSubmit = async (e) => {
    values["placementPageArray"] = adPlacementPage;
    e.preventDefault();
    const formData = new FormData();
    formData.append("advertisement_image", values.advertisement_image);
    formData.append("body", values.body);
    formData.append("headline", values.headline);
    formData.append("link", values.link);
    formData.append("video_package_qty", values.video_package_qty);
    formData.append("placementPageArray", values.placementPageArray);
    formData.append("total_cost", values.total_cost);
    formData.append("type", values.type);
    try {
      e.preventDefault();
      if (advertisementId) {
        await httpClient
          .put(
            `${ADVERTISEMENT.UPDATE_ADVERTISEMENT.replace(
              "{advertisementId}",
              advertisementId
            )}`,
            formData
          )
          .then((res) => {
            toast.success("Updated Successfully");
          })
          .catch((err) => {
            if (err.response) toast.error(err.response.data.message);
            else toast.error("Something went wrong");
          });
      } else {
        await httpClient
          .post(
            `${ADVERTISEMENT.PUBLISH_ADS}?campaign_id=${campaignId}`,
            formData
          )
          .then((res) => {
            toast.success("Publish Successfully");
          })
          .catch((err) => {
            if (err.response) toast.error(err.response.data.message);
            else toast.error("Something went wrong");
          });
      }
    } catch (err) {}
  };

  const handleCheckBox = (e) => {
    let arr = [...adPlacementPage];
    const { name, checked } = e.target;
    if (checked) {
      arr.push(name);
    } else {
      const index = arr.indexOf(name);
      if (index > -1) {
        arr.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    setAdPlacementPage(arr);
  };

  const checkPlacementPage = (pageName) => {
    const placementPage = adPlacementPage.find((page) => page === pageName);
    if (placementPage) return true;
    else return;
  };

  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content">
            <div className="container-xl">
              <div className="row g-4">
                <div
                  className="app_home app_header sticky"
                  style={{ width: "calc(100% - 314px)", left: "314px" }}
                >
                  <div className="mb-4">
                    <Link
                      to={`/advertisement/view-campaign/${campaignId}`}
                      className="backto-btn"
                    >
                      <span className="lnr lnr-arrow-left mr-2"></span> &nbsp;
                      Back to Ads
                    </Link>
                  </div>
                  <div className="d-md-flex align-items-end">
                    <h1 className="app-page-title">Create New Ad</h1>
                    <p>{tempAdName} </p>
                    <div className="start_campaign ms-auto">
                      <button
                        className="btn help_btn"
                        onClick={() => setHelp(true)}
                      >
                        {" "}
                        <span className="lnr lnr-question-circle"></span> Need
                        help?
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="stepper1"
                className="bs-stepper common_padding_ad"
                style={{ marginTop: "250px" }}
              >
                <div className="bs-stepper-header col-lg-8 offset-lg-2 justify-content-center">
                  <div className="step" data-target="#test-l-1">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">1</span>
                      <span className="bs-stepper-label">Create</span>
                    </button>
                  </div>
                  <div className="step" data-target="#test-l-2">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">2</span>
                      <span className="bs-stepper-label">Financials</span>
                    </button>
                  </div>
                  <div className="step" data-target="#test-l-3">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">3</span>
                      <span className="bs-stepper-label">Summary</span>
                    </button>
                  </div>
                  <div className="step" data-target="#test-l-4">
                    <button className="step-trigger">
                      <span className="bs-stepper-circle">4</span>
                      <span className="bs-stepper-label">Payment</span>
                    </button>
                  </div>
                </div>

                <div className="bs-stepper-content">
                  <form onSubmit={handleOnSubmit}>
                    <div id="test-l-1" className="content first-step">
                      <div className="row">
                        <div className="col-lg-6 p-0">
                          <div className="h-100 bg_1">
                            <div className="preview_left">
                              <div className="form-group">
                                <label>Type</label>
                                <select
                                  className="form-select"
                                  value={values.type}
                                  onChange={(e) =>
                                    setValues({
                                      ...values,
                                      type: e.target.value,
                                    })
                                  }
                                  required
                                >
                                  <option value="">Select Type</option>
                                  <option value="Banner ($0.10 per ad)">
                                    Banner ($0.10 per ad)
                                  </option>
                                  <option value="Pop-up ($1.50 per ad)">
                                    Pop-up ($1.50 per ad)
                                  </option>
                                  <option value="Video-Ad ($3 per ad)">
                                    Video Ad ($3 per ad)
                                  </option>
                                </select>
                              </div>
                              <div className="form-group">
                                <div className="d-flex justify-content-between">
                                  <label>
                                    Headline{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Headline"
                                  value={values.headline}
                                  onChange={(e) =>
                                    setValues({
                                      ...values,
                                      headline: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="form-group">
                                <label>Body copy</label>
                                <textarea
                                  className="form-control"
                                  placeholder="Write Something..."
                                  value={values.body}
                                  onChange={(e) =>
                                    setValues({
                                      ...values,
                                      body: e.target.value,
                                    })
                                  }
                                ></textarea>
                              </div>
                              <div className="form-group">
                                <label>
                                  Link <span className="text-danger">*</span>
                                </label>
                                <input
                                  required
                                  type="text"
                                  className="form-control"
                                  placeholder="Link"
                                  value={values.link}
                                  onChange={(e) =>
                                    setValues({
                                      ...values,
                                      link: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="form-group">
                                <label>
                                  Upload your media{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="upload-btn-wrapper">
                                  <button className="btn">
                                    <img
                                      src="/assets/images/icons/arrow2.svg"
                                      alt=""
                                    />
                                    <br />
                                    Drop your media here or{" "}
                                    <a href="#">Browse</a>
                                    <br />
                                    <small>
                                      (Supported file types: .jpg, .png, .mp4)
                                    </small>
                                  </button>
                                  <input
                                    // required
                                    type="file"
                                    name="advertisement_image"
                                    onChange={(e) =>
                                      setValues({
                                        ...values,
                                        // myfile: e.target.files[0],
                                        advertisement_image: e.target.files[0],
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 p-0">
                          <div className="h-100 bg_2">
                            <div className="preview_sec">
                              <Preview
                                values={{
                                  headline: values.headline,
                                  body: values.body,
                                  link: values.link,
                                  advertisement_image:
                                    values.advertisement_image,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 ps-0">
                          <button
                            className="btn btn-outline-dark mt-2"
                            onClick={() =>
                              navigate(
                                `/advertisement/view-campaign/${campaignId}`
                              )
                            }
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-6 pe-0 text-right">
                          <div
                            className="btn btn-primary mt-2"
                            onClick={() => handleNextStepper()}
                          >
                            Continue
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="test-l-2" className="content second-step">
                      <div className="row">
                        <div className="col-lg-6 p-0">
                          <div className="h-100 bg_1">
                            <div className="preview_left">
                              <div className="form-group mb-4">
                                <h5 className="sub_heading ">
                                  {values.type === "Banner ($0.10 per ad)"
                                    ? "Banner"
                                    : values.type === "Pop-up ($1.50 per ad)"
                                    ? "Pop-Up"
                                    : "Video"}{" "}
                                  Package
                                </h5>
                                <div className="d-flex align-items-center">
                                  <img src="/assets/images/info.png"></img>
                                  <p className="ms-1 m-0">
                                    A{" "}
                                    {values.type === "Banner ($0.10 per ad)"
                                      ? "Banner"
                                      : values.type === "Pop-up ($1.50 per ad)"
                                      ? "Pop-Up"
                                      : "Video"}{" "}
                                    package contains{" "}
                                    {values.type === "Video-Ad ($3 per ad)"
                                      ? 10
                                      : 100}{" "}
                                    video ads
                                  </p>
                                </div>
                                <div className="line mb-3"></div>
                              </div>
                              <div className="form-group placement_checkboxes">
                                <h6>Ad placement page</h6>
                                <div className="custom_checkbox">
                                  <input
                                    type="checkbox"
                                    id="1"
                                    name="diary"
                                    checked={checkPlacementPage("diary")}
                                    onChange={(e) => {
                                      handleCheckBox(e);
                                    }}
                                  />
                                  <label htmlFor="1">Diary</label>
                                </div>
                                <div className="custom_checkbox">
                                  <input
                                    type="checkbox"
                                    id="2"
                                    name="communication"
                                    checked={checkPlacementPage(
                                      "communication"
                                    )}
                                    onClick={(e) => handleCheckBox(e)}
                                  />
                                  <label htmlFor="2">Community</label>
                                </div>
                                <div className="custom_checkbox">
                                  <input
                                    type="checkbox"
                                    id="3"
                                    name="recommendation"
                                    checked={checkPlacementPage(
                                      "recommendation"
                                    )}
                                    onClick={(e) => handleCheckBox(e)}
                                  />
                                  <label htmlFor="3">Recommendation</label>
                                </div>
                              </div>
                              <div className="line mb-3"></div>
                              <div className="form-group mb-5">
                                <h6>Video Package QTY</h6>
                                <div className="qty_box">
                                  <div onClick={decrementCount}>-</div>
                                  <input
                                    name="clicks"
                                    className="form-control"
                                    value={count}
                                  />
                                  <div onClick={incrementCount}>+</div>
                                </div>
                              </div>
                              <div className="form-group">
                                <p className="todaL_cost">
                                  Total Cost
                                  <span>
                                    $
                                    {values && values.total_cost
                                      ? values.total_cost
                                      : 0}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 p-0">
                          <div className="h-100 bg_2">
                            <div className="preview_sec">
                              <Preview
                                values={{
                                  headline: values.headline,
                                  body: values.body,
                                  link: values.link,
                                  advertisement_image:
                                    values.advertisement_image,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 ps-0">
                          <div
                            className="btn btn-outline-dark mt-2"
                            onClick={() => handleBackStepper()}
                          >
                            Back
                          </div>
                        </div>
                        <div className="col-6 pe-0 text-right">
                          <div
                            className="btn btn-primary mt-2"
                            onClick={() => handleNextStepper()}
                          >
                            Continue
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="test-l-3" className="content third-step">
                      <div className="row">
                        <div className="col-lg-6 p-0">
                          <div className="h-100 bg_1">
                            <div className="preview_left">
                              <div className="form-group">
                                <h5 className="sub_heading">Order details</h5>
                              </div>
                              <div className="line"></div>
                              <div className="form-group py-3 mb-0">
                                <div className="row py-3">
                                  <div className="col-6">
                                    <span>Type</span>
                                  </div>
                                  <div className="col-6 text-right">
                                    <p>
                                      <strong>{adsName}</strong>
                                    </p>
                                  </div>
                                </div>

                                <div className="row py-3">
                                  <div className="col-6">
                                    <span>Package</span>
                                  </div>
                                  <div className="col-6 text-right">
                                    <p>
                                      <strong>
                                        {values.video_package_qty}
                                      </strong>
                                    </p>
                                  </div>
                                </div>

                                <div className="row py-3">
                                  <div className="col-6">
                                    <span>Price</span>
                                  </div>
                                  <div className="col-6 text-right">
                                    <p>
                                      <strong>
                                        {" "}
                                        $
                                        {values && values.total_cost
                                          ? values.total_cost
                                          : 0}
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="line"></div>
                              <div className="form-group">
                                <div className="row py-3">
                                  <div className="col-6">
                                    <h5>Total</h5>
                                  </div>
                                  <div className="col-6 text-right">
                                    <h5>
                                      {" "}
                                      $
                                      {values && values.total_cost
                                        ? values.total_cost
                                        : 0}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 p-0">
                          <div className="h-100 bg_2">
                            <div className="preview_sec">
                              <Preview
                                values={{
                                  headline: values.headline,
                                  body: values.body,
                                  link: values.link,
                                  advertisement_image:
                                    values.advertisement_image,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 ps-0">
                          <div
                            className="btn btn-outline-dark mt-2"
                            onClick={() => handleBackStepper()}
                          >
                            Back
                          </div>
                        </div>
                        <div className="col-6 pe-0 text-right">
                          <div
                            className="btn btn-primary mt-2"
                            onClick={() => handleNextStepper()}
                          >
                            Continue
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="test-l-4" className="content fourth-step">
                      <div className="row">
                        <div className="col-md-6 p-0">
                          <div className="h-100 bg_1">
                            <div className="preview_left">
                              <div className="sent_mail_box">
                                <h4>
                                  An invoice will be sent to the email we have
                                  on file
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 p-0">
                          <div className="h-100 bg_2">
                            <div className="preview_sec">
                              <Preview
                                values={{
                                  headline: values.headline,
                                  body: values.body,
                                  link: values.link,
                                  advertisement_image:
                                    values.advertisement_image,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 ps-0">
                          <div
                            className="btn btn-outline-dark mt-2"
                            onClick={() => handleBackStepper()}
                          >
                            Back
                          </div>
                        </div>
                        <div className="col-6 pe-0 text-right">
                          <button
                            type="submit"
                            className="btn btn-primary mt-2"
                          >
                            Place Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      {showHelp && <NeedHelpModal show={showHelp} close={handleClose} />}
    </>
  );
}

export default CreateNewAd;
