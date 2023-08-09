import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Consumers from "./Consumers";
import PurposeInfo from "./PurposeInfo";
import CategoryInfo from "./CategoryInfo";

function index() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Consumers />} />
                <Route path="/profiles/purpose/:purposeId" element={<PurposeInfo />} />
                <Route path="/profiles/category/:categoryId" element={<CategoryInfo />} />
            </Routes>
        </div>
    );
}

export default index;