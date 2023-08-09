import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Home";
import ReadMore from "./ReadMore";
function index() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/read-more/:getTcdUpdateId" element={<ReadMore />} />
            </Routes>
        </div>
    );
}

export default index;