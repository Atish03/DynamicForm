import React from "react";
import ReactDOM from "react-dom/client";
const axios = require("axios");
import "./makeForm.css";


class FormElement extends React.Component {
    ele = this.props.info;
    eleName = this.props.eleName;
    render() {
        if (this.ele["type"] != "radio") {
            if (this.ele["isRequired"]) {
                return(
                    <input className="inp" type={this.ele["type"]} id={this.eleName.replace(" ", "_")} name={this.ele["question"]} required />
                )
            } else {
                return(
                    <input className="inp" type={this.ele["type"]} id={this.eleName.replace(" ", "_")} name={this.ele["question"]} />
                )
            }
        } else {
            const optList = this.ele["option"];
            let opt;
            if (this.ele["isRequired"]){
                opt = optList.map((opts) =>
                    <div className="optManager">
                        <input className="inp radioInp" type="radio" id={opts} value={opts} name={this.ele["question"]} required />
                        <label className="radioLabel" htmlFor={opts}>{opts}</label>
                    </div>
                );
            } else {
                opt = optList.map((opts) =>
                    <div className="optManager">
                        <input className="inp radioInp" type="radio" id={opts} value={opts} name={this.ele["question"]} />
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
            questions: [],
            status: "Loading",
        };

        axios
            .get(`/event/${this.props.eventID}/formData`)
            .then((resp) => {
                this.setState({questions: resp.data.questions, status: "Done"});
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        if (this.state.status == "Done") {
            const subLink = `/event/${this.props.eventID}/submitForm`;
            return(
                <form id="submitForm" method="post" action={subLink} enctype="multipart/form-data">
                    {
                        Object.keys(this.state.questions).map((ele) =>
                            <div className="fele" key={ele}>
                                <div className="textBox">{this.state.questions[ele].question + " :"}</div>
                                < FormElement info={this.state.questions[ele]} eleName={this.state.questions[ele].question} />
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