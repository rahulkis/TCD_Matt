import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { collapseSidebar } from "../../redux/actions/SidebarActions";
import { useNavigate, Link } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebar = (action) => {
    setShowSidebar(action);
    if (action) document.body.classList.add("hideshow_menu");
    else document.body.classList.remove("hideshow_menu");
    dispatch(collapseSidebar());
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  }

  return (
    <>
      <header className="main-header">
        <Link to="#" className="logo text-decoration-none">
          <span className="logo-mini">
            <img src="/assets/images/login-logo.png" alt="" />
          </span>

          <span className="logo-lg">
            <img src="/assets/images/login-logo.png" alt="Buildup" />
            <strong className="m-l-5" style={{fontWeight: "bold"}}>TCD</strong>
          </span>
        </Link>
        <nav className="navbar navbar-static-top">
          {/* <Link
            to="#"
            className="sidebar-toggle"
            data-toggle="push-menu"
            role="button"
          >
            <span classNa
            <Linkme="sr-only">Toggle navigation</span>
          </Link> */}
          <Link
            id="navbar"
            onClick={() => handleSidebar(!showSidebar)}
            to="#"
            // className="sidebar-toggle"
            data-toggle="push-menu"
            role="button"
          >
            <i
              className="fa fa-bars"
              aria-hidden="true"
              style={{ color: "white", cursor: "pointer" }}
            ></i>
          </Link>

          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li className="dropdown user user-menu">
                {/* <a href="#" className="dropdown-toggle" data-toggle="dropdown"> */}
                <Link
                  to="#"
                  className="dropdown-toggle p-3"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    textDecoration: "none",
                    background: "rgba(0,0,0,0.1)",
                    color: "#f6f6f6",
                  }}
                >
                  {/* <% if(data.loggedUser &&  data.loggedUser.profile_image && data.loggedUser.profile_image.length > 0 ){%>
                        <img src="https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/<%=data.loggedUser.profile_image%>" className="user-image" alt="User Image">
                        
                    <%}else{%>
                        <img src="/images/avatar5.png" className="user-image" alt="User Image">
                    <%}%> */}
                  {/* <span className="hidden-xs"><%=data.loggedUser.full_name%></span> */}
                  <span className="hidden-xs">Super Admin</span>
                </Link>
                <ul className="dropdown-menu">
                  {/* <!-- User image --> */}
                  <li className="user-header">
                    {/* <% if(data.loggedUser && data.loggedUser.profile_image && data.loggedUser.profile_image.length > 0 ){%>
                            
                            <img src="https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/<%=data.loggedUser.profile_image%>" className="img-circle" alt="User Image">
                        <%}else{%>
                            <img src="/images/avatar5.png" className="img-circle" alt="User Image">
                        <%}%>
                        

                        <p><%=data.loggedUser.full_name%></p> */}
                  </li>
                  {/* <!-- Menu Footer--> */}
                  <li className="user-footer">
                    <div className="pull-left" style={{ float: "left" }}>
                      <Link
                        to="/admin/profile"
                        className="btn btn-default btn-flat"
                        style={{ fontSize: "12px" }}
                      >
                        Profile
                      </Link>
                    </div>
                    <div className="pull-left" style={{ float: "left" }}>
                      <Link
                        to="/admin/change-password"
                        className="btn btn-default btn-flat"
                        style={{ fontSize: "12px" }}
                      >
                        Change Password
                      </Link>
                    </div>
                    <div className="pull-right" style={{ float: "right" }}>
                      <a
                        onClick={handleLogout}
                        className="btn btn-default btn-flat"
                        style={{ fontSize: "12px" }}
                      >
                        Sign out
                      </a>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
