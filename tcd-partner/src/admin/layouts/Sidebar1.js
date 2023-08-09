import React, { useEffect, useState } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { useSelector } from 'react-redux';

function Sidebar1() {
  const collapse = useSelector((state) => state.sidebar.collapse);

  return (
    <>
      <ProSidebar collapsed={collapse}>
        <SidebarHeader>
          <div className="align-items-center d-flex p-4" style={{ padding: '8px 8px 7px 27px' }}>
            <img src="/assets/images/card.png" className="img-circle" alt="User Image" />
            <div className="info">
              <p style={{ color: 'black' }} className=" mb-0 ms-3">
                Administrator
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Menu>
            <MenuItem icon={<i className="fa fa-dashboard" />}>
              <Link to="/admin/dashboard" />
              Dashboard
            </MenuItem>
            <MenuItem icon={<i className="fa fa-users" />}>
              <Link to="/admin/subadminlist" />
              Sub Admin List
            </MenuItem>
            <MenuItem icon={<i className="fa fa-users" />}>
              User List <Link to="/admin/userlist" />
            </MenuItem>
            <MenuItem icon={<i className="fa fa-users" />}>
              <Link to="/admin/userdiarylist" />
              User Diary List
            </MenuItem>
            <SubMenu title="Partner" icon={<i className="fa fa-list" />}>
              <MenuItem icon={<i className="fa fa-circle-o" />}>
                <Link to="/admin/partner-admin" />
                Partner Admin
              </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>
                <Link to="/admin/partner" />
                Partner 
              </MenuItem>
            </SubMenu>
            <SubMenu title="Master Data" icon={<i className="fa fa-list" />}>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Activities</MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Effects </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Symptoms </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Conditions </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Cannabinoid Consumption </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Consumption Frequency </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Consumption Reason </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Strains </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Mood </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Consumption Methods </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Consumption Negatives </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Faq Category </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Community Question Category </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Country </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>State </MenuItem>
            </SubMenu>
            <SubMenu title="Manage Products" icon={<i className="fa fa-list" />}>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Products</MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Add Product </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Product Types </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Add Product Type </MenuItem>
            </SubMenu>
            <SubMenu title="COA Data" icon={<i className="fa fa-list" />}>
              <MenuItem icon={<i className="fa fa-circle-o" />}>COA Full Listing</MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>COA Compositions </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>COA Queue </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Upload COA Data </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Parse COA URL </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>Test Labs </MenuItem>
              <MenuItem icon={<i className="fa fa-circle-o" />}>COA Searches </MenuItem>
            </SubMenu>
            <MenuItem icon={<i className="fa fa-video-camera" />}>Video List </MenuItem>
            <MenuItem icon={<i className="fa fa-list" />}>Article List </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>Community Questions List </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>CMS List </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>Content List </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>FAQ List </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>Feedback List </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>Banner Advertisement List </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>My Entourage Settings </MenuItem>
            <MenuItem icon={<i className="fa fa-edit" />}>TCD Updates </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>
              Feedback List{" "}
            </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>
              Banner Advertisement List{" "}
            </MenuItem>
            <MenuItem icon={<i className="fa fa-file" />}>
              My Entourage Settings{" "}
            </MenuItem>
            <MenuItem icon={<i className="fa fa-edit" />}>
              <Link to="/admin/tcd-updates" />
              TCD Updates{" "}
            </MenuItem>
          </Menu>
        </SidebarContent>
      </ProSidebar>
    </>
  );
}

export default Sidebar1;
