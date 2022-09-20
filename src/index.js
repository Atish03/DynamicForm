import React from "react";
import ReactDOM from "react-dom/client"
import Form from "./admin";
import Box from "./form";
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

class Main extends React.Component {
    render() {
        return (
            < Router>
            <Routes>
                <Route path="/event" element={ < Form /> } ></Route>
                <Route path="/event/apply" element={ < Box /> }></Route>
            </Routes>
            </Router>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(< Main />)