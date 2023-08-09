import React from "react";
import { Routes, Route } from "react-router-dom";
import MyEntourageList from "./MyEntourageList";
// import AddPartner from "./AddPartner";
// import EditPartner from "./EditPartner";

function MyEntourageRoutes() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<MyEntourageList />} />
        {/* <Route path="/add" element={<AddPartner />} />
        <Route path="/edit/:partnerId" element={<EditPartner />} /> */}
      </Routes>
    </>
  );
}

export default MyEntourageRoutes;