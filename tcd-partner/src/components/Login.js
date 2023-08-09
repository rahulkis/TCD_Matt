import React, { useState, useEffect } from "react";
import { API_BASE_URL, AUTH } from "../constants/AppConstant";
import { setUserSession } from "../constants/Api";
import { setPageTitle } from "../utils/Common";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setPageTitle('Login')
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const isValidate = await validateUser(values);
      if (isValidate) {
        setLoading(true);
        await axios
          .post(API_BASE_URL + AUTH.LOGIN, values)
          .then((res) => {
            if (res.data.success) {
              if (res.data.data.token) {
                setLoading(false);
                const partnerObj = {
                  token: res.data.data.token.accessToken,
                  partnerInfo: res.data.data.partnerInfo,
                  pageInfo: 'Home'
                };
                setUserSession(partnerObj);
                toast.success("Logged in Successfully!");
                navigate("/home");
              }
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

  const validateUser = async (values) => {
    let isValid = true;
    if (!values.email || !values.password) {
      toast.error("Please Enter Email or Password");
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
                <div className="yoo-form-title">Sign in to continue</div>
                <div className="yoo-form-signup">
                  Don't have an account?
                  <Link className="link_class" to="/signup"> Sign up </Link>
                </div>
              </span>
              <div className="yoo-form-separator">Or</div>
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
              <div
                className="wrap-input100 validate-input m-b-16"
                data-validate="Password is required"
              >
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
              <div className="wrap-input100 row">
                <div className="col-md-6">
                  <input className="" type="checkbox" defaultChecked />
                  <span style={{ color: 'white' }}> Remember Me</span>
                </div>
                <div className="col-md-6">
                  <span style={{ float: "right" }}>
                    <Link className="link_class" to="/forgot-password">Forgot Password</Link>
                  </span>
                </div>
              </div>
              <div className="container-login100-form-btn p-t-25">
                {isLoading === true ? (
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
                    Sign In
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
export default Login;
