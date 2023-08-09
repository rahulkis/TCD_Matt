import React, { useState, useEffect } from "react";
import Sidebar from "../../layouts/Sidebar";
import { useParams } from "react-router-dom";
import { SETTING } from "../../constants/AppConstant";
import { httpClient } from "../../constants/Api";
import { setPageTitle } from "../../utils/Common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useLocation } from "react-router-dom";
import Loader from "../../layouts/Loader";

function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
       window.scrollTo(0, 0); 
 },[pathname]);
  useEffect(() => {
    setPageTitle("EditUser");
    editUser();
  }, []);
  const [values, setValues] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const editUser = async (e) => {
    try {
      await httpClient
        .get(`${SETTING.EDIT_USER}?id=${userId}`)
        .then((res) => {          
          setValues(res.data.getUserList);
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        });
    } catch (err) { }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const isValidate = await validateUser(values);
      if (isValidate) {
        await httpClient
          .post(`${SETTING.UPDATE_USER}?id=${userId}`, values)
          .then((res) => {
            if (res.data.success) {
              setValues(res.data.data[0]);
              toast.success("Partner Updated Successfully");
              navigate('/settings')
            } else {
              toast.error(res.data.message);
            }
          })
          .catch((err) => {
            if (err.response) toast.error(err.response.data.message);
            else toast.error("Something went wrong");
          });
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  const validateUser = async (values) => {
    let isValid = true;
    if (!values.full_name) {
      toast.error("Please enter your name");
      isValid = false;
    } else if (
      !values.email ||
      !values.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,64})+$/)
    ) {
      toast.error("Please enter a valid email");
      isValid = false;
    }
    return isValid;
  };
  return (
    <>
    {isLoading && <Loader />}
      <Sidebar />
      <div className="app-wrapper">
        <div className="app-content">
          <div className="container-xl"></div>
          <div className="row g-4 m-0">
            <div className="app_home app_header">
              <h1 className="app-page-title">Edit User</h1>
              <p>{moment().format('LL')}</p>
            </div>
          </div>
          <div className="container p-b-40">
            <form onSubmit={handleSubmit} className=" validate-form" id="loginForm">
              <div className="row p-t-20">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={values?.full_name}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          full_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={values?.email}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row p-t-20">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={values?.password}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={values?.confirm_password}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          confirm_password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row p-t-20">
                <div className="col-md-8">
                  <button className="form-control w-auto update_info_btn px-4" type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default EditUser;
