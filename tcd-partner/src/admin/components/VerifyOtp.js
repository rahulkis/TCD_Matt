import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AUTH } from "../../constants/AdminConstant";
import { API_BASE_URL } from "../../constants/AppConstant";

function VerifyOtp() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    otp_code: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setValues({ ...values, email: user.email });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await axios.post(API_BASE_URL + AUTH.VERIFY_OTP, values);
      if (result.data.status) {
        toast.success(result.data.message);
        localStorage.setItem("user", JSON.stringify(result.data.data));
        navigate("/admin/dashboard");
      } else toast.error(result.data.message);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const result = await axios.post(API_BASE_URL + AUTH.RESEND_OTP, {
        email: values.email,
      });
      if (result.data.success) {
        toast.success(result.data.message);
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
              <input
                type="hidden"
                name="email"
                // value="<%= data.login_email%>"
              />
              <div className="wrap-input100 validate-input m-b-16">
                <input
                  className="input100"
                  type="text"
                  name="otp_code"
                  placeholder="Verification Code"
                  maxLength="6"
                  value={values.otp_code}
                  onChange={(e) =>
                    setValues({ ...values, otp_code: e.target.value })
                  }
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <span className="lnr lnr-envelope"></span>
                </span>
              </div>

              <div className="container-login100-form-btn p-t-25">
                <button type="submit" className="login100-form-btn-admin">
                  Verify
                </button>
              </div>
              <div className="">
                <Link
                  onClick={handleResendOtp}
                  to="#"
                  className="text-decoration-none"
                  style={{ color: " #2f4830", padding: "5px 0px" }}
                >
                  Resend Verification Code
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyOtp;
