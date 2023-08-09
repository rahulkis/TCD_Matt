import React from "react";
import { Routes, Route } from "react-router-dom";
import Support from "./Support";
import Thankyou from "./Thankyou";

function index() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Support />} />
        <Route path="/thanku" element={<Thankyou />} />
        {/* <Route path="/product-info/:productId" element={<ProductInfo />} /> */}
      </Routes>
    </div>
  );
}

export default index;
