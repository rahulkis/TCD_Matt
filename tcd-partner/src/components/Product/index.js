import React from "react";
import { Routes, Route } from "react-router-dom";
import Product from "./Products";
import ProductInfo from "./ProductInfo";

function index() {

    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Product />} />
                <Route path="/product-info/:productId" element={<ProductInfo />} />
            </Routes>
        </div>
    );
}

export default index;