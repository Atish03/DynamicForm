import React from "react";
import ReactDOM from "react-dom/client";
const axios = require("axios");
import "./admin.css";


class FormElement extends React.Component {
    ele = this.props.info;
    eleName = this.props.eleName;
    render() {
        if (this.ele["type"] != "radio") {
            if (this.ele["isRequired"]) {
                return(
                    <input className="inp" type={this.ele["type"]} id={this.eleName.replace(" ", "_")} name={this.ele["name"]} required />
                )
            } else {
                return(
                    <input className="inp" type={this.ele["type"]} id={this.eleName.replace(" ", "_")} name={this.ele["name"]} />
                )
            }
        } else {
            const optList = this.ele["options"];
            let opt;
            if (this.ele["isRequired"]){
                opt = optList.map((opts) =>
                    <div className="optManager">
                        <input className="inp radioInp" type="radio" id={opts} value={opts} name={this.ele["name"]} required />
                        <label className="radioLabel" htmlFor={opts}>{opts}</label>
                    </div>
                );
            } else {
                opt = optList.map((opts) =>
                    <div className="optManager">
                        <input className="inp radioInp" type="radio" id={opts} value={opts} name={this.ele["name"]} />
                        <label className="radioLabel" htmlFor={opts}>{opts}</label>
                    </div>
                );
            }
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
        };

        axios
            .get(`/event/${this.props.eventID}/formData`)
            .then((resp) => {
                this.setState({comps: resp.data.comps, status: "Done"});
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        if (this.state.status == "Done") {
            const subLink = `/event/${this.props.eventID}/submitForm`;
            return(
                <form method="post" action={subLink} enctype="multipart/form-data">
                    {
                        Object.keys(this.state.comps.elements).map((ele) =>
                            <div className="fele" key={ele}>
                                <div className="textBox">{ele + " :"}</div>
                                < FormElement info={this.state.comps.elements[ele]} eleName={ele} />
                            </div>
                        )
                    }
                    <input id="submitBtn" type="submit" />
                </form>
            )
        } else {
            return(
                <div>Loading....</div>
            )
        }
    }
}

class Box extends React.Component {
    render() {
        return(
            < Form eventID={this.props.eventID} />
        )
    }
}

export default Box;