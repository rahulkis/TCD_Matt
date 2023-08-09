import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AUTH } from "../../constants/AdminConstant";
import { API_BASE_URL } from "../../constants/AppConstant";

function ForgotPassword() {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await axios.post(API_BASE_URL + AUTH.FORGOT_PASSWORD, {
        email,
      });
      if (result.data.status) {
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
              <div className="wrap-input100 validate-input m-b-16">
                <input
                  required
                  className="input100"
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <span className="lnr lnr-envelope"></span>
                </span>
              </div>

              <div className="container-login100-form-btn p-t-25">
                <button type="submit" className="login100-form-btn-admin">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
