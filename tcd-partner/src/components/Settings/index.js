import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Setting from "./Setting";
import AddUser from "../Settings/AddUser";
import EditUser from "../Settings/EditUser";

function index() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Setting />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/edit-user/:userId" element={<EditUser />} />
      </Routes>
    </div>
  );
}

export default index;