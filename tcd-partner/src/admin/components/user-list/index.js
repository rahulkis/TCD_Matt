import React from "react";
import { Routes, Route } from "react-router-dom";
import EditUser from "./EditUser";
import UserList from "./UserList";

function UserRoutes() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<UserList />} />
        <Route path="/update/:userId" element={<EditUser />} />
      </Routes>
    </>
  );
}

export default UserRoutes;
