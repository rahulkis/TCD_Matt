import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AUTH } from "../../constants/AdminConstant";
import { API_BASE_URL } from "../../constants/AppConstant";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await axios.post(API_BASE_URL + AUTH.LOGIN, values);
      if (result.data.status) {
        toast.success(result.data.message);
        localStorage.setItem("user",JSON.stringify(result.data.data))
        navigate("/admin/verify-otp");
      } else toast.error(result.data.message);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100-admin  p-t-60 p-b-60 p-l-50 p-r-50">
            <form
              className="login100-form validate-form"
              onSubmit={handleSubmit}
            >
              <span className="login100-form-title m-b-55">
                <img src="/assets/images/login-logo.png" alt="" height="80" />
              </span>
              <div className="wrap-input100 validate-input m-b-16">
                <input
                  className="input100"
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
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
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <span className="lnr lnr-lock"></span>
                </span>
              </div>
              <div className="contact100-form-checkbox m-l-4">
                <input
                  className="input-checkbox100"
                  id="ckb1"
                  type="checkbox"
                  name="remember-me"
                  defaultChecked
                />
                <label className="label-checkbox100" htmlFor="ckb1">
                  Remember me
                </label>
              </div>
              <div className="container-login100-form-btn p-t-25">
                <button type="submit" className="login100-form-btn-admin">
                  Sign In
                </button>
              </div>
              <div className="">
                <Link
                  to="/admin/forgot-password"
                  className="text-decoration-none"
                  style={{ color: " #2f4830", padding: "5px 0px" }}
                >
                  Forgot Password
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
