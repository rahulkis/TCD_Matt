import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';
import SubAdminList from './components/SubAdmin/SubAdminList';
import UserRoutes from './components/user-list';
// import UserList from "./components/user-list/UserList";
import UserDiaryList from './components/UserDiaryList';
import VerifyOtp from './components/VerifyOtp';
import ViewUserDiaryList from './components/ViewUserDiaryList';
import Layouts from './Layouts';
import AddSubAdmin from './components/SubAdmin/AddSubAdmin';
import EditSubAdmin from './components/SubAdmin/EditSubAdmin';
import TcdUpdateList from './components/tcd-updates/TcdUpdateList';
import TcdUpdateCreate from './components/tcd-updates/TcdUpdateCreate';
import TcdUpdateEdit from './components/tcd-updates/TcdUpdateEdit';
import PartnerAdminList from './components/Partner/Partner-Admin/PartnerAdminList';
import AddPartnerAdmin from './components/Partner/Partner-Admin/AddPartnerAdmin';
import UpdatePartnerAdmin from './components/Partner/Partner-Admin/UpdatePartnerAdmin';
import PartnerRoutes from './components/Partner/Partner';
// import AddPartner from "./components/Partner/Partner/AddPartner";

function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route element={<Layouts />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subadminlist" element={<SubAdminList />} />
          <Route path="/userlist/*" element={<UserRoutes />} />
          <Route path="/userdiarylist" element={<UserDiaryList />} />
          <Route path="/subadminlist/add" element={<AddSubAdmin />} />
          <Route path="/subadminlist/edit/:id" element={<EditSubAdmin />} />
          <Route path="/userdiarylist/view/:id" element={<ViewUserDiaryList />} />
          <Route path="/tcd-updates" element={<TcdUpdateList />} />
          <Route path="/tcd-updates/add" element={<TcdUpdateCreate />} />
          <Route path="/tcd-updates/edit/:id" element={<TcdUpdateEdit />} />
          <Route path="/partner-admin" element={<PartnerAdminList />} />
          <Route path="/partner-admin/add" element={<AddPartnerAdmin />} />
          <Route path="/partner-admin/update/:id" element={<UpdatePartnerAdmin />} />
          <Route path="/partner/*" element={<PartnerRoutes />} />
          {/* <Route path="/partner/add" element={<AddPartner />} /> */}
        </Route>
        <Route exact path="" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default AdminRoutes;
