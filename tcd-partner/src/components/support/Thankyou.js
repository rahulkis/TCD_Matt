import React from "react";
import Sidebar from "../../layouts/Sidebar";
import Footer from "../../layouts/Footer";

function Thankyou() {
  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content vh-100">
            <div className="container-xl">
              <div className="row g-4">
                <div
                  className="app_home app_header sticky"
                  style={{ width: "calc(100% - 314px)", left: "314px" }}
                >
                  <h1 className="app-page-title">Thank you</h1>
                </div>
              </div>

              <div className="px-5 text-center" style={{ marginTop: "300px" }}>
                <h2 className="app-page-title">Thank you for contacting us</h2>
                <h4 className="mt-3">Our support team will contact you shortly</h4>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Thankyou;
