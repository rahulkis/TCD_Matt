import React, { useState, useEffect } from "react";
import { API_BASE_URL, AUTH } from "../constants/AppConstant";
import { setPageTitle } from "../utils/Common";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
function Signup() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    referral_code: "",
  });
  useEffect(() => {
    setPageTitle('Signup')
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const isValidate = await validateUser(values);
      if (isValidate) {
        setLoading(true);
        await axios
          .post(API_BASE_URL + AUTH.SIGNUP, values)
          .then((res) => {
            if (res.data.success) {
              toast.success(res.data.message);
              navigate("/");
            } else {
              toast.error(res.data.message);
              setLoading(false);
            }
          }).catch((err) => {
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

  const validateUser = async (values) => {
    let isValid = true;
    if (!values.full_name) {
      toast.error("Please enter your name");
      isValid = false;
    } else if (!values.email || !values.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,64})+$/)) {
      toast.error("Please enter a valid email");
      isValid = false;
    } else if (!values.password || !values.confirm_password) {
      toast.error("Please enter your password");
      isValid = false;
    } else if (values.password !== values.confirm_password) {
      toast.error("Your password and confirm assword doesn't match");
      isValid = false;
    } else if (values.password.length < 8) {
      toast.error("Password should contain atleast 8 characters");
      isValid = false;
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
              id="loginForm"
            >
              <span className="login100-form-title m-b-25">
                <img src="/assets/images/login-logo.png" alt="" height="80" />
              </span>
              <div className="wrap-input100 validate-input m-b-16">
                <input
                  className="input100"
                  type="text"
                  value={values.full_name}
                  onChange={(e) =>
                    setValues({ ...values, full_name: e.target.value })
                  }
                  placeholder="Full Name"
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <span className="lnr lnr-user"></span>
                </span>
              </div>
              <div className="wrap-input100 validate-input m-b-16">
                <input
                  className="input100"
                  type="text"
                  value={values.email}
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <span className="lnr lnr-envelope"></span>
                </span>
              </div>
              <div className="wrap-input100 m-b-16">
                <input
                  className="input100"
                  type="text"
                  value={values.referral_code}
                  onChange={(e) =>
                    setValues({ ...values, referral_code: e.target.value })
                  }
                  placeholder="Referral Code"
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <span className="lnr lnr-bullhorn"></span>
                </span>
              </div>
              <div
                className="wrap-input100 validate-input m-b-16"
                data-validate="Password is required">
                <input
                  className="input100"
                  type="password"
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
              <div
                className="wrap-input100 validate-input m-b-16"
                data-validate="Password is required">
                <input
                  className="input100"
                  type="password"
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
              <span className="login-style">
                <div className="yoo-form-signup">
                  Already have an account <Link className="link_class" to="/"> Login </Link>
                </div>
              </span>
              <div className="container-login100-form-btn p-t-25">
                {isLoading ? (
                  <button type="submit" className="login100-form-btn" disabled>
                    Sign In{" "}
                    <div>
                      <img
                        src="/assets/images/loginLoader.gif"
                        alt=""
                        height="40"
                        style={{ marginBottom: "3px" }}
                      />
                    </div>
                  </button>
                ) : (
                  <button type="submit" className="btn-rds login100-form-btn">
                    Sign Up
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
