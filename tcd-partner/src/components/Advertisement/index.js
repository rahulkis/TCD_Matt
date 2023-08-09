import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Advertisement from "./Campaign";
import ViewCampaign from "../Advertisement/ViewCampaign";
import CreateNewAd from "../Advertisement/CreateNewAd";

function index() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Advertisement />} />
                <Route path="/view-campaign/:campaignId" element={<ViewCampaign />} />
                <Route path="/create-new-ad/:campaignId" element={<CreateNewAd />} />
            </Routes>
        </div>
    );
}

export default index;