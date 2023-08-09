import React, { useState, useEffect } from "react";
import { API_BASE_URL, AUTH } from "../constants/AppConstant";
import { setPageTitle } from "../utils/Common";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
function Signup() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [showPasswordDiv, setShowPasswordDiv] = useState(false);
  const [values, setValues] = useState({
    email: "",
    otp: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    setPageTitle('Forgot Password')
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const isValidate = await validateFields(values);
      if (isValidate) {
        setLoading(true);
        let response;
        if (!showPasswordDiv) {
          response = await axios.post(API_BASE_URL + AUTH.FORGOT_PASSWORD, values);
          if (response && response.data && response.data.success) {
            toast.success(response.data.message);
            setLoading(false)
            setShowPasswordDiv(true);
          } else {
            toast.error(response.data.message);
            setLoading(false);
          }
        } else {
          response = await axios.post(API_BASE_URL + AUTH.RESET_PASSWORD, values);
          if (response && response.data && response.data.success) {
            toast.success(response.data.message);
            setLoading(false)
            navigate("/");
          } else {
            toast.error(response.data.message);
            setLoading(false);
          }
        }
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const validateFields = async (values) => {
    let isValid = true;
    if (!values.email || !values.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,64})+$/)) {
      toast.error("Please enter a valid email");
      isValid = false;
    }
    if (showPasswordDiv) {
      if (!values.otp || values.otp.length > 6) {
        toast.error("Please enter a valid OTP");
        isValid = false;
      }
      else if (!values.password || !values.confirm_password) {
        toast.error("Please enter your password");
        isValid = false;
      } else if (values.password !== values.confirm_password) {
        toast.error("Your password and confirm password doesn't match");
        isValid = false;
      } else if (values.password.length < 8) {
        toast.error("Password should contain atleast 8 characters");
        isValid = false;
      }
    }
    return isValid;
  };

  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100  p-t-60 p-b-60">
            <form
              onSubmit={handleSubmit}
              className="login100-form validate-form"
              id="loginForm">
              <span className="login100-form-title m-b-25">
                <img src="/assets/images/login-logo.png" alt="" height="80" />
              </span>

              <div className="wrap-input100 validate-input m-b-16">
                <input
                  className="input100"
                  type="text"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  placeholder="Email" />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <span className="lnr lnr-envelope"></span>
                </span>
              </div>
              {showPasswordDiv && (
                <>
                  <div className="wrap-input100 validate-input m-b-16" data-validate="OTP is required">
                    <input className="input100" type="password"
                      value={values.otp}
                      onChange={(e) =>
                        setValues({ ...values, otp: e.target.value })
                      }
                      placeholder="OTP"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <span className="lnr lnr-lock"></span>
                    </span>
                  </div>

                  <div className="wrap-input100 validate-input m-b-16" data-validate="Password is required">
                    <input className="input100" type="password"
                      value={values.password}
                      onChange={(e) =>
                        setValues({ ...values, password: e.target.value })
                      }
                      placeholder="Password"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <span className="lnr lnr-lock"></span>
                    </span>
                  </div>

                  <div className="wrap-input100 validate-input m-b-16" data-validate="Password is required">
                    <input className="input100" type="password"
                      value={values.confirm_password}
                      onChange={(e) =>
                        setValues({ ...values, confirm_password: e.target.value })
                      }
                      placeholder="Confirm Password"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <span className="lnr lnr-lock"></span>
                    </span>
                  </div>
                </>
              )}

              <div className="container-login100-form-btn p-t-25">
                {isLoading ? (
                  <button type="submit" className="login100-form-btn" disabled>
                    {!showPasswordDiv ? "Forgot Password" : "Update Password"}
                    <div>
                      <img src="/assets/images/loginLoader.gif" alt="" height="40" style={{ marginBottom: "3px" }} />
                    </div>
                  </button>
                ) : (
                  <button type="submit" className="btn-rds login100-form-btn">
                    {!showPasswordDiv ? "Forgot Password" : "Update Password"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default Signup;
