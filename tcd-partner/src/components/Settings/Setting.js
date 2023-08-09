import React, { useEffect, useState } from "react";
import { SETTING } from "../../constants/AppConstant";
import { httpClient } from "../../constants/Api";
import Sidebar from "../../layouts/Sidebar";
import { setPageTitle } from "../../utils/Common";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Loader from "../../layouts/Loader";
import Footer from "../../layouts/Footer";
const partnerData = localStorage.getItem("partner");
const partnerDataId = partnerData ? JSON.parse(partnerData).id : "";

function Settings() {
  const hash = window.location.hash;
  const columns = [
    {
      name: "User",
      selector: (row) => (
        <span>
          <div className="mr-10">
            <div className="profile_detail">
              <img
                src="/assets/images/profile.png"
                alt=""
                className="img-fluid"
              />
              <div>
                <strong> {row.full_name}</strong>
                <span>{row.email}</span>
              </div>
            </div>
          </div>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Type of Account",
      selector: (row) => (
        <select className="form-select">
          <option value="admin">Admin</option>
          <option value="view only">View only</option>
        </select>
      ),
      sortable: true,
    },
    {
      name: "",
      selector: (row) => (
        <p className="add_edit_btns">
          <Link to={`/settings/edit-user/${row.id}`} data-id={row.id}>
            Edit
          </Link>
          /
          <span onClick={setData} data-id={row.id}>
            Delete
          </span>
        </p>
      ),
      sortable: true,
    },
  ];

  const [partnerCountry, setPartnerCountry] = useState([]);
  const [partnerState, setPartnerState] = useState([]);
  const [partnerCompanyData, setPartnerCompanyData] = useState([]);
  const [entryData, setEntryData] = useState(false);
  const [showHelp, setHelp] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [deleteId, setId] = useState("");

  useEffect(() => {
    setPageTitle("Settings");
    getCompanyDetail();
    getUsersList();
    scrollOnLoad()
  }, []);

  const scrollOnLoad = () => {
    window.scrollTo(0, 0);
  };

  const handleClose = () => {
    setHelp(false);
  };

  const setData = async (e) => {
    const id = e.target.getAttribute("data-id");
    setHelp(true);
    setId(id);
  };

  const deleteUser = async (e) => {
    try {
      await httpClient
        .post(`${SETTING.DELETE_USER}?id=${deleteId}`)
        .then((res) => {
          setEntryData(res.data.getUserList);
          setHelp(false);
          toast.success("Deleted Successfully");
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        });
    } catch (err) {}
  };

  const getUsersList = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(SETTING.GET_USER_LIST)
        .then((res) => {
          setEntryData(res.data.getUserList);
          setLoading(false);
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        });
    } catch (err) {}
  };

  const getCompanyDetail = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${SETTING.GET_SETTING}?id=${partnerDataId}`)
        .then((res) => {
          if (res.data.success) {
            setPartnerCountry(res.data.country);
            setPartnerState(res.data.states);
            setPartnerCompanyData(res.data.data[0]);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        });
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      await httpClient
        .post(
          `${SETTING.UPDATE_SETTING}?id=${partnerDataId}`,
          partnerCompanyData
        )
        .then((res) => {
          if (res.data.success) {
            setLoading(false);
            setPartnerCompanyData(res.data.data[0]);
            toast.success("Details updated successfully");
          } else {
            setLoading(false);
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        });
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
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
                <div
                  className="app_home app_header app_consumer sticky"
                  style={{ width: "calc(100% - 314px)", left: "314px" }}
                >
                  <h1 className="app-page-title">Settings</h1>
                </div>
              </div>

              <div
                className="nav_tabs consumers_tabs common_padding"
                style={{ marginTop: "130px" }}
              >
                <nav
                  id="orders-table-tab"
                  className="orders-table-tab nav_tabs_main nav flex-column flex-sm-row	custom_tabs sticky_tabs"
                >
                  <a
                    className="nav-link active"
                    id="account-tab"
                    data-bs-toggle="tab"
                    href="#account"
                    role="tab"
                    aria-controls="account"
                    aria-selected="true"
                    onClick={scrollOnLoad}
                  >
                    Account
                  </a>

                  <a
                    className="nav-link"
                    id="users-tab"
                    data-bs-toggle="tab"
                    href="#users"
                    role="tab"
                    aria-controls="users"
                    aria-selected="false"
                    onClick={scrollOnLoad}
                  >
                    Users
                  </a>
                </nav>

                <div className="tab-content" id="orders-table-tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="account"
                    role="tabpanel"
                    aria-labelledby="account-tab"
                  >
                    <form onSubmit={handleSubmit} className="validate-form">
                      <div className="p-t-50 p-b-40">
                        <div className="row">
                          <div className="col-md-4">
                            <div>
                              <b className="infosub_heading">
                                Personal Details
                              </b>
                            </div>
                            <div className="p-t-10 secondaryColor">
                              Account: Admin
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>First Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={partnerCompanyData?.full_name}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    full_name: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Last Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={partnerCompanyData?.last_name}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    last_name: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-4"></div>
                          <div className="col-md-8">
                            <div className="form-group">
                              <label>Email Address</label>
                              <input
                                type="text"
                                className="form-control"
                                value={partnerCompanyData?.email}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20 align-items-end">
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Password</label>
                              <input
                                type="password"
                                className="form-control"
                                value="********"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-4 p-t-20">
                            <div className="form-group">
                              <label className="reset_label">
                                Need to update your password?{" "}
                                <a href="#" className="link_text">
                                  Reset it here
                                </a>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="row p-t-40">
                          <div className="col-md-4">
                            <div>
                              <b className="infosub_heading">Company Details</b>
                            </div>
                          </div>
                          <div className="col-md-8">
                            <div className="form-group">
                              <label>Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={partnerCompanyData?.company_name}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    company_name: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Email</label>
                              <input
                                type="text"
                                className="form-control"
                                value={partnerCompanyData?.company_email}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    company_email: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Phone</label>
                              <input
                                type="text"
                                className="form-control"
                                value={partnerCompanyData?.company_phone}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    company_phone: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-4"></div>
                          <div className="col-md-8">
                            <div className="form-group">
                              <label>Email to send invoices to</label>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  partnerCompanyData?.company_email_invoice
                                }
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    company_email_invoice: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-4"></div>
                          <div className="col-md-8">
                            <div className="form-group">
                              <label>Address</label>
                              <input
                                type="text"
                                className="form-control"
                                value={partnerCompanyData?.company_address}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    company_address: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Country</label>
                              <select
                                className="form-control"
                                value={partnerCompanyData?.company_country}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    company_country: e.target.value,
                                  })
                                }
                              >
                                <option>Country</option>
                                {partnerCountry.map((data) => (
                                  <option value={data.id}>{data.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>State</label>
                              <select
                                className="form-control"
                                value={partnerCompanyData?.company_state}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    company_state: e.target.value,
                                  })
                                }
                              >
                                <option>State</option>
                                {partnerState.map((data) => (
                                  <option value={data.id}>{data.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-8"></div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Zip Code</label>
                              <input
                                type="text"
                                className="form-control"
                                value={partnerCompanyData?.company_zipcode}
                                onChange={(e) =>
                                  setPartnerCompanyData({
                                    ...partnerCompanyData,
                                    company_zipcode: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-4"></div>
                          <div className="col-md-8">
                            <div className="form-group">
                              <label>Plan</label>
                              <div className="plan_input_group">
                                <span className="lnr lnr-lock"></span>
                                <input
                                  type="text"
                                  value="Standard"
                                  className="form-control"
                                  readOnly
                                />
                              </div>
                              <label className="reset_label">
                                If you'd like to upgrade your plan, please{" "}
                                <Link to="/support" className="link_text">
                                  Contant Us
                                </Link>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="row p-t-20">
                          <div className="col-md-10"></div>
                          <div className="col-md-2">
                            <button
                              className="form-control btn update_info_btn"
                              type="submit"
                            >
                              Update Info
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="users"
                    role="tabpanel"
                    aria-labelledby="users-tab"
                  >
                    <div
                      className="tab-pane fade show active "
                      id="account"
                      role="tabpanel"
                      aria-labelledby="account-tab"
                    >
                      <div className="p-t-50">
                        <div className="row">
                          <div className="col-md-5">
                            <div>
                              <b className="infosub_heading email-line-height">
                                Users
                              </b>
                            </div>
                            <div className="p-t-10 secondaryColor">
                              List of all active users
                            </div>
                          </div>
                          <div className="col-md-4"></div>
                          <div className="col-md-3">
                            <div className="text-end">
                              <Link
                                to="/settings/add-user"
                                className="btn btn-primary btn-color align-items-center w-auto"
                              >
                                <span className="lnr lnr-user me-1"></span> Add
                                new user
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-b-30">
                        <div className="row">
                          <div className="col-md-3"></div>
                          <div className="col-md-9">
                            {entryData && (
                              <DataTable
                                columns={columns}
                                data={entryData}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </div>
      </div>
      {showHelp && (
        <Modal show={showHelp} onHide={handleClose}>
          <form className="help_modal">
            <Modal.Header>
              <Modal.Title>Delete Partner</Modal.Title>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              />
            </Modal.Header>
            <Modal.Body>
              <div className="row">Are you sure you want to delete?</div>
            </Modal.Body>
            <Modal.Footer>
              <div className="border-0 modal-footer pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleClose}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={deleteUser}
                  className="btn btn-primary"
                >
                  Yes
                </button>
              </div>
            </Modal.Footer>
          </form>
        </Modal>
      )}
    </>
  );
}

export default Settings;
