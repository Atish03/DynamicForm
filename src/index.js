import React from "react";
import ReactDOM from "react-dom/client"
import Maker from "./makeForm";
import Box from "./form";
import Viewer from "./viewer";
import EventForm from "./createEvent";
import Event from "./events";
import {BrowserRouter as Router, Route, Link, Routes, useParams} from 'react-router-dom';

function Render() {
    const { id } = useParams();
    return < Maker eventID={id} />;
}

function StudRender() {
    const { id } = useParams();
    return < Box eventID={id} />;
}

function ViewRender() {
    const { id } = useParams();
    return < Viewer eventID={id} />;
}

function Main() {
    return (
        < Router>
        <Routes>
            <Route path="/event" element={ < Event /> } />
            <Route path="/event">
                <Route path=":id/makeForm" element={ < Render /> } />
                <Route path=":id/apply" element={ < StudRender /> } />
                <Route path=":id/view" element={ < ViewRender /> } />
            </Route>
            <Route path="/createEvent" element={ < EventForm /> }></Route>
        </Routes>
        </Router>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(< Main />)