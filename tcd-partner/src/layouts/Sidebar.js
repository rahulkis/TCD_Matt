import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AUTH } from "../constants/AppConstant";
import { httpClient } from "../constants/Api";
import { toast } from "react-toastify";

function Sidebar() {
  const { pathname } = useLocation();
  const [partnerData, setPartnerData] = useState([]);
  useEffect(() => {
    responsiveSidear();
    const partner = localStorage.getItem("partner");
    setPartnerData(JSON.parse(partner));
  }, []);

  const responsiveSidear = () => {
    const sidePanelToggler = document.getElementById("sidepanel-toggler");
    const sidePanel = document.getElementById("app-sidepanel");
    const sidePanelDrop = document.getElementById("sidepanel-drop");
    const sidePanelClose = document.getElementById("sidepanel-close");

    window.addEventListener("load", function () {
      responsiveSidePanel();
    });

    window.addEventListener("resize", function () {
      responsiveSidePanel();
    });

    function responsiveSidePanel() {
      let w = window.innerWidth;
      if (w >= 1200) {
        sidePanel.classList.remove("sidepanel-hidden");
        sidePanel.classList.add("sidepanel-visible");
      } else {
        sidePanel.classList.remove("sidepanel-visible");
        sidePanel.classList.add("sidepanel-hidden");
      }
    }

    sidePanelToggler.addEventListener("click", () => {
      if (sidePanel.classList.contains("sidepanel-visible")) {
        sidePanel.classList.remove("sidepanel-visible");
        sidePanel.classList.add("sidepanel-hidden");
      } else {
        sidePanel.classList.remove("sidepanel-hidden");
        sidePanel.classList.add("sidepanel-visible");
      }
    });

    sidePanelClose.addEventListener("click", (e) => {
      e.preventDefault();
      sidePanelToggler.click();
    });

    sidePanelDrop.addEventListener("click", (e) => {
      sidePanelToggler.click();
    });
  };

  // fixed header on scroll
  window.onscroll = function () { myFunction() };
  let header = document.getElementById("header");
  let sticky = header && header.offsetTop;
  function myFunction() {
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  const navigate = useNavigate();
  const logOut = async () => {
    try {
      const tokens = localStorage.getItem("token");
      await httpClient
        .post(AUTH.LOGOUT.replace("{token}", tokens))
        .then((res) => {
          if (res.data.success) {
            localStorage.removeItem("token");
            localStorage.removeItem("pageInfo");
            toast.success("Logout Successfully");
            navigate("/");
          }
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        });
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <>
      <header className="header fixed-top">
        <div className="header-inner">
          <div className="container-fluid py-2">
            <div className="header-content">
              <div className="row justify-content-between align-items-center">
                <div className="col-auto">
                  <a
                    id="sidepanel-toggler"
                    className="sidepanel-toggler d-inline-block d-xl-none"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      role="img"
                    >
                      <path
                        stroke="#334155"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                        d="M4 7h22M4 15h22M4 23h22"
                      ></path>
                    </svg>
                  </a>
                </div>
                <div className="app_home">
                  <h1 className="app-page-title">Home</h1>
                  <p>November 10, 2021</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="app-sidepanel" className="app-sidepanel sidepanel-visible">
          <div id="sidepanel-drop" className="sidepanel-drop"></div>
          <div className="sidepanel-inner d-flex flex-column">
            <a
              href="#"
              id="sidepanel-close"
              className="sidepanel-close d-xl-none"
            >
              ×
            </a>
            <div className="app-branding">
              <Link className="logo d-inline-block" to="/home">
                <img
                  className="logo-img"
                  src="/assets/images/icons/logo.svg"
                  alt="logo"
                />
              </Link>
            </div>

            <div className="profile_info d-flex align-items-center">
              <div className="profile_thumb mr_20">
                <img src="/assets/images/profile.png" alt="#" />
              </div>
              <div className="author_name">
                <h4>{partnerData.full_name}</h4>
                <p>Admin</p>
              </div>
            </div>

            <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
              <ul
                className="app-menu list-unstyled accordion"
                id="menu-accordion"
              >
                <li className="nav-item">
                  <Link className={pathname.match("/home") ? "nav-link active" : "nav-link"} to="/home">
                    <span>
                      {" "}
                      <img src="/assets/images/icons/icon1.svg" alt="" />
                    </span>{" "}
                    Home{" "}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={pathname.match("/entries") ? "nav-link active" : "nav-link"} to="/entries">
                    <span>
                      {" "}
                      <img src="/assets/images/icons/icon2.svg" alt="" />
                    </span>{" "}
                    Entries{" "}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={pathname.match("/consumers") ? "nav-link active" : "nav-link"} to="/consumers">
                    <span>
                      {" "}
                      <img src="/assets/images/icons/icon3.svg" alt="" />
                    </span>{" "}
                    Consumers{" "}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={pathname.match("/products") ? "nav-link active" : "nav-link"} to="/products">
                    <span>
                      {" "}
                      <img src="/assets/images/icons/icon4.svg" alt="" />
                    </span>{" "}
                    Products{" "}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={pathname.match("/market-insight") ? "nav-link active" : "nav-link"} to="/market-insight">
                    <span>
                      {" "}
                      <img src="/assets/images/icons/icon5.svg" alt="" />
                    </span>{" "}
                    Market Insight <em>Premium</em>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={pathname.match("/advertisement") ? "nav-link active" : "nav-link"} to="/advertisement">
                    <span>
                      {" "}
                      <img src="/assets/images/icons/icon6.svg" alt="" />
                    </span>{" "}
                    Advertisement{" "}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={pathname.match("/settings") ? "nav-link active" : "nav-link"} to="/settings">
                    <span>
                      {" "}
                      <img src="/assets/images/icons/icon7.svg" alt="" />
                    </span>{" "}
                    Settings{" "}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className={pathname.match("/support") ? "nav-link active" : "nav-link"} to="/support">
                    <span>
                      {" "}
                      <img src="/assets/images/icons/icon8.svg" alt="" />
                    </span>{" "}
                    Support{" "}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#" onClick={() => logOut()}>
                    <span>
                      <img src="/assets/images/icons/icon9.svg" alt="" />
                    </span>{" "}
                    Logout
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}

export default Sidebar;
