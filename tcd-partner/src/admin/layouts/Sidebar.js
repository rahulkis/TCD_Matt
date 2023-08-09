import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {


  return (
    <>
      <aside className="main-sidebar">
        {/* <!-- sidebar: style can be found in sidebar.less --> */}
        <section className="sidebar vh-100">
          {/* <!-- Sidebar user panel --> */}
          <div className="user-panel">
            <div className="image" style={{ float: "left" }}>
              {/* <% if(loggedUser.hasOwnProperty('profile_image') && loggedUser.profile_image.length > 0 ){%>
                    <img src="https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/<%=loggedUser.profile_image%>" className="img-circle" alt="User Image">
                <%}else{%>
                    <img src="/images/avatar5.png" className="img-circle" alt="User Image">
                <%}%> */}
              <img
                src="/assets/images/card.png"
                className="img-circle"
                alt="User Image"
              />
            </div>
            <div className="info" style={{ float: "left" }}>
              <p style={{ color: "black" }}>Administrator</p>
            </div>
          </div>
          {/* // <!-- /.search form -->
        // <!-- sidebar menu: : style can be found in sidebar.less --> */}
          <ul className="sidebar-menu" data-widget="tree">
            <li>
              <Link to="/admin/dashboard">
                <i className="fa fa-dashboard"></i> <span>Dashboard</span>
              </Link>
            </li>
            {/* <% if(loggedUser.hasOwnProperty('user_type') && loggedUser.user_type == 1 ){%> */}
            <li>
              <Link to="/admin/subadminlist">
                <i className="fa fa-users"></i> <span>Sub Admin List</span>
              </Link>
            </li>
            {/* <%}%> */}
            <li>
              <Link to="/admin/userlist">
                <i className="fa fa-users"></i> <span>User List</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/userdiarylist">
                <i className="fa fa-users"></i> <span>User Diary List</span>
              </Link>
            </li>
            <li className="treeview">
              <Link to="#">
                <i className="fa fa-list"></i>
                <span>Partner</span>
                <span className="pull-right-container ">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
                </span>
              </Link>
              <ul className="treeview-menu">
                <li>
                  <Link to="/admin/partner-admin">
                    <i className="fa fa-circle-o"></i>Partner Admin
                  </Link>
                </li>
                <li>
                  <Link to="/admin/partner">
                    <i className="fa fa-circle-o"></i>Partner
                  </Link>
                </li>
              </ul>
            </li>
            <li className="treeview">
              <Link to="#">
                <i className="fa fa-list"></i>
                <span>Master Data</span>
                <span className="pull-right-container">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
                </span>
              </Link>
              <ul className="treeview-menu">
                {/* <!-- <li><a href="/admin/physique"><i className="fa fa-circle-o"></i>Physique</a></li> --> */}
                <li>
                  <Link to="/admin/activity">
                    <i className="fa fa-circle-o"></i>Activities
                  </Link>
                </li>
                <li>
                  <Link to="/admin/effect">
                    <i className="fa fa-circle-o"></i>Effects
                  </Link>
                </li>

                <li>
                  <Link to="/admin/symptom">
                    <i className="fa fa-circle-o"></i>Symptoms
                  </Link>
                </li>
                <li>
                  <Link to="/admin/conditions">
                    <i className="fa fa-circle-o"></i>Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/admin/cannabinoid">
                    <i className="fa fa-circle-o"></i>Cannabinoid Consumption
                  </Link>
                </li>
                <li>
                  <Link to="/admin/consumption-frequency">
                    <i className="fa fa-circle-o"></i>Consumption Frequency
                  </Link>
                </li>
                <li>
                  <Link to="/admin/consumption-reason">
                    <i className="fa fa-circle-o"></i>Consumption Reason
                  </Link>
                </li>
                <li>
                  <Link to="/admin/strain">
                    <i className="fa fa-circle-o"></i>Strains
                  </Link>
                </li>
                <li>
                  <Link to="/admin/mood">
                    <i className="fa fa-circle-o"></i>Mood
                  </Link>
                </li>
                <li>
                  <Link to="/admin/consumption-methods">
                    <i className="fa fa-circle-o"></i>Consumption Methods
                  </Link>
                </li>
                <li>
                  <Link to="/admin/consumption-negatives">
                    <i className="fa fa-circle-o"></i>Consumption Negatives
                  </Link>
                </li>
                <li>
                  <Link to="/admin/faq-category">
                    <i className="fa fa-circle-o"></i>Faq Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/community-questions-category"
                    // style="white-space: break-spaces"
                  >
                    <i className="fa fa-circle-o"></i>Community Question
                    Category
                  </Link>
                </li>
                <li>
                  <Link to="/admin/country">
                    <i className="fa fa-circle-o"></i>Country
                  </Link>
                </li>
                <li>
                  <Link to="/admin/states">
                    <i className="fa fa-circle-o"></i>State
                  </Link>
                </li>
              </ul>
            </li>
            <li className="treeview">
              <Link to="#">
                <i className="fa fa-list"></i>
                <span>Manage Products</span>
                <span className="pull-right-container">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
                </span>
              </Link>
              <ul className="treeview-menu">
                <li>
                  <Link to="/admin/products">
                    <i className="fa fa-circle-o"></i>Products
                  </Link>
                </li>
                <li>
                  <Link to="/admin/products/add">
                    <i className="fa fa-circle-o"></i>Add Product
                  </Link>
                </li>
                <li>
                  <Link to="/admin/product-types">
                    <i className="fa fa-circle-o"></i>Product Types
                  </Link>
                </li>
                <li>
                  <Link to="/admin/product-types/add">
                    <i className="fa fa-circle-o"></i>Add Product Type
                  </Link>
                </li>
              </ul>
            </li>

            <li className="treeview">
              <Link to="#">
                <i className="fa fa-list"></i>
                <span>COA Data</span>
                <span className="pull-right-container">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
                </span>
              </Link>
              <ul className="treeview-menu">
                <li>
                  <Link to="/admin/coa">
                    <i className="fa fa-circle-o"></i>COA Full Listing
                  </Link>
                </li>
                <li>
                  <Link to="/admin/coa-composition">
                    <i className="fa fa-circle-o"></i>COA Compositions
                  </Link>
                </li>
                <li>
                  <Link to="/admin/coa-pending">
                    <i className="fa fa-circle-o"></i>COA Queue
                  </Link>
                </li>
                {/* <!--<li><a href="/admin/coa-upload"><i className="fa fa-circle-o"></i>Download COA Data</a></li>--> */}
                <li>
                  <Link to="/admin/coa-upload">
                    <i className="fa fa-circle-o"></i>Upload COA Data
                  </Link>
                </li>
                <li>
                  <Link to="/admin/coa-url-process">
                    <i className="fa fa-circle-o"></i>Parse COA URL
                  </Link>
                </li>
                <li>
                  <Link to="/admin/coa-testlabs">
                    <i className="fa fa-circle-o"></i>Test Labs
                  </Link>
                </li>
                <li>
                  <Link to="/admin/coa-search-list">
                    <i className="fa fa-circle-o"></i>COA Searches
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/admin/video">
                <i className="fa fa-video-camera"></i> <span>Video List</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/article">
                <i className="fa fa-list"></i> <span>Article List</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/community-questions">
                <i className="fa fa-file"></i>{" "}
                <span>Community Questions List</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/cms">
                <i className="fa fa-file"></i> <span>CMS List</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/static-content">
                <i className="fa fa-file"></i> <span>Content List</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/faq">
                <i className="fa fa-file"></i> <span>FAQ List</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/feedback">
                <i className="fa fa-file"></i> <span>Feedback List</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/banner-advertisement">
                <i className="fa fa-file"></i>{" "}
                <span>Banner Advertisement List</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/settings/my-entourage">
                <i className="fa fa-file"></i>{" "}
                <span>My Entourage Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/tcd-updates">
                <i className="fa fa-edit"></i> <span>TCD Updates</span>
              </Link>
            </li>
          </ul>
        </section>
      </aside>
    </>
  );
}

export default Sidebar;
