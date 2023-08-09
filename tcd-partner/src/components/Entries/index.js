import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Entrie from "./Entries";
import EntriesInfo from "./EntriesInfo";

function index() {

    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Entrie />} />
                <Route path="/entries-info/:entryId/:userId" element={<EntriesInfo />} />
            </Routes>
        </div>
    );
}

export default index;