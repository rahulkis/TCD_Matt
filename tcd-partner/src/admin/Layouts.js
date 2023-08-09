import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Sidebar1 from "./layouts/Sidebar1";

function Layouts() {
  return (
    <>
      <Header />
      <Sidebar1 />
      <Outlet/>
      <Footer />
    </>
  );
}

export default Layouts;
