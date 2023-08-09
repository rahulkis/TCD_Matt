import React from "react";
import { Routes, Route } from "react-router-dom";
// import EditUser from "./EditUser";";
import PartnerList from "./PartnerList";
import AddPartner from "./AddPartner";
import EditPartner from "./EditPartner";

function PartnerRoutes() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<PartnerList />} />
        <Route path="/add" element={<AddPartner />} />
        <Route path="/edit/:partnerId" element={<EditPartner />} />
      </Routes>
    </>
  );
}

export default PartnerRoutes;