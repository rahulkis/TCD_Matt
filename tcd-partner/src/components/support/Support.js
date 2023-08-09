import React, { useState, useEffect } from "react";
import Sidebar from "../../layouts/Sidebar";
import { setPageTitle } from "../../utils/Common";
import { toast } from "react-toastify";
import { SUPPORT } from "../../constants/AppConstant";
import { httpClient } from "../../constants/Api";
import Loader from "../../layouts/Loader";
import Footer from "../../layouts/Footer";
import { useLocation, useNavigate } from "react-router-dom";

function Support() {
  const navigate = useNavigate();
  const partnerInfo = localStorage.getItem("partner");
  const [values, setValues] = useState({
    subject: "",
    topic: "",
    message: "",
    _id: JSON.parse(partnerInfo).id,
    name: JSON.parse(partnerInfo).full_name,
  });
  const [isLoading, setLoading] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setPageTitle("Support");
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const isValidate = await validateForm(values);
      if (isValidate) {
        setLoading(true);
        await httpClient
          .post(SUPPORT.SUPPORT, values)
          .then((res) => {
            if (res.data.success) {
              // toast.success(res.data.message);
              setValues({
                subject: "",
                topic: "",
                message: "",
              });
              navigate("/support/thanku");
              setLoading(false);
            } else {
              toast.error(res.data.message);
              setLoading(false);
            }
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setLoading(false);
          });
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const validateForm = async (values) => {
    let isValid = true;
    if (!values.subject) {
      toast.error("Please Enter Subject");
      isValid = false;
    } else if (!values.topic) {
      toast.error("Please Select Topic");
      isValid = false;
    } else if (!values.message.trim()) {
      toast.error("Please Enter Message");
      isValid = false;
    }
    return isValid;
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
                  className="app_home app_header sticky"
                  style={{ width: "calc(100% - 314px)", left: "314px" }}
                >
                  <h1 className="app-page-title">Support</h1>
                </div>
              </div>

              <div className="px-5" style={{ marginTop: "200px" }}>
                <h5 className="app-page-title">
                  Need help with Cannabis Diary? Submit a ticket and we'll be in
                  touch.
                </h5>
                <div className="row support_form">
                  <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mb-3">
                        <label className="">
                          Subject <span>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={values.subject}
                          placeholder="Missing products in Market insights"
                          onChange={(e) =>
                            setValues({ ...values, subject: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="">
                          Topic<span>*</span>
                        </label>
                        <select
                          className="form-select"
                          value={values.topic}
                          onChange={(e) =>
                            setValues({ ...values, topic: e.target.value })
                          }
                        >
                          <option value="">Select Topic</option>
                          <option value="Market Insights">
                            Market Insights
                          </option>
                          <option value="Products">Products</option>
                          <option value="Entries">Entries</option>
                          <option value="Advertisement">Advertisement</option>
                          <option value="Consumers">Consumers</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group mb-5">
                        <label className="">
                          Your Message<span>*</span>
                        </label>
                        <textarea
                          className="form-control"
                          value={values.message}
                          onChange={(e) =>
                            setValues({ ...values, message: e.target.value })
                          }
                        ></textarea>
                      </div>
                      <div className="form-group text-right">
                        <button className="btn btn-success px-4">Send</button>
                      </div>
                    </form>
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

export default Support;
