
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import MarketInsight from "./MarketInsight";

function index() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<MarketInsight />} />
            </Routes>
        </div>
    );
}

export default index;