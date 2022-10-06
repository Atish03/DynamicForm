import React from "react";
import ReactDOM from "react-dom/client";
const axios = require("axios");
import "./makeForm.css";
import { Routes, Route, useParams } from 'react-router-dom'

class FormElement extends React.Component {
    ele = this.props.info;
    eleName = this.props.eleName;
    render() {
        if (this.ele["type"] != "radio") {
            return(
                <input className="inp" type={this.ele["type"]} id={this.eleName.replace(" ", "_")} name={this.ele["name"]} />
            )
        } else {
            const optList = this.ele["options"];
            const opt = optList.map((opts) =>
                <div className="optManager">
                    <input className="inp radioInp" type="radio" id={opts} value={opts} name={this.ele["name"]} />
                    <label className="radioLabel" htmlFor={opts}>{opts}</label>
                </div>
            );
            return(
                <div className="options">{opt}</div>
            )
        }
    }
}

class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comps: {elements: {}},
            status: "Loading",
            options: [],
            eID: 1,
        };

        axios
            .get(`/event/${this.props.eventID}/formData`)
            .then((resp) => {
                if (resp.data == "err404") {
                    this.setState({status: "Event not found..."});
                } else {
                    this.setState({comps: resp.data.comps, status: "Done"});
                }
            })
            .catch((error) => {
                console.log(error);
            })

        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.optClick = this.optClick.bind(this);
        this.addOpt = this.addOpt.bind(this);
    }

    handleSubmit() {
        const data = {comps: this.state.comps};
        axios
            .post(`/event/${this.props.eventID}/submit`, data)
            .then((resp) => {
                console.log(resp)
            })
    }

    handleAdd() {
        const val = document.getElementById("eleName").value;
        const isRequired = document.getElementById("required").checked;

        if (val == "") {
            alert("Please enter the field");
            return;
        }

        const type = document.getElementById("types");
        let inpType = type.options[type.selectedIndex].value.toLowerCase(), inpName = val.replace(" ", "_");

        // var temp = this.state.elements.slice();
        // temp.push([val.toUpperCase(), inpType]);
        // this.setState({elements: temp});
        document.getElementById("eleName").value = "";
        var obj = this.state.comps;

        obj.elements[val.toUpperCase()] = {"eID": this.state.eID, "type": inpType, "name": inpName, "options": this.state.options, "isRequired": isRequired};
        this.setState({comps: obj, options: []});
        this.setState({eID: this.state.eID + 1});
        document.getElementById("types").selectedIndex = 0;
        document.getElementById("required").checked = false;
    }

    handleRemove(event, element) {
        var obj = this.state.comps;
        delete obj.elements[element];
        this.setState({comps: obj});
    }

    optClick() {
        var types = document.getElementById("types");
        var val = types.options[types.selectedIndex].value;

        if (val == "radio") {
            document.getElementById("options").style.display = "flex";
            document.getElementById("form").style.filter = "blur(10px)";
        }
    }

    addOpt() {
        const opts = document.getElementById("opts").value;
        this.setState({options: opts.split("\n")});
        document.getElementById("options").style.display = "none";
        document.getElementById("form").style.filter = "none";
    }

    render() {
        if (this.state.status == "Done") {
            return(
                <div id="main">
                    <div id="form">
                        {
                            Object.keys(this.state.comps.elements).map((ele) =>
                            <div className="fele" key={ele}>
                                <div className="textBox">{ele + " :"}</div>
                                < FormElement info={this.state.comps.elements[ele]} eleName={ele} />
                                <div id="remove" onClick={event => this.handleRemove(event, ele)}></div>
                            </div>
                            )
                        }
                        <div id="adder">
                            <input id="eleName" type="text" placeholder="Enter the field name" />
                            <select name="types" id="types" onChange={this.optClick}>
                                <option value="text" selected>TEXT</option>
                                <option value="file">FILE</option>
                                <option value="radio">OPTION</option>
                            </select>
                            <input id="required" type="checkbox" name="isRequired" value="required"/>
                            <label htmlFor="isRequired">REQUIRED</label>
                            <div id="add" onClick={this.handleAdd}></div>
                        </div>
                        <div id="submitBtn" onClick={this.handleSubmit}>Submit</div>
                    </div>
                    <div id="options">
                        <textarea id="opts"></textarea>
                        <button id="addOpt" onClick={this.addOpt}>ADD</button>
                    </div>
                </div>
            )
        } else {
            return(
                <div>{this.state.status}</div>
            )
        }
    }
}

class Maker extends React.Component {
    render() {
        console.log(this.props);
        return(
            < Form eventID={this.props.eventID} />
        )
    }
}

export default Maker;