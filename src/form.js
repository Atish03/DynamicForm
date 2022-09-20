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
            .get("/event/formData")
            .then((resp) => {
                console.log(resp.data);
                this.setState({comps: resp.data.comps});
                this.setState({status: "Done"});
            })
            .catch((error) => {
                console.log(error);
            })

        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    // handleSubmit() {
    //     const fields = Object.keys(this.state.comps.elements);
    //     var data = {}

    //     for(var field of fields) {
    //         data[field] = document.getElementById(field.replace(" ", "_")).value;
    //     }

    //     // console.log(data);
    //     axios
    //         .post("/submitForm", data)
    //         .then((resp) => {
    //             console.log(resp)
    //         })
    // }

    render() {
        if (this.state.status == "Done") {
            return(
                <form method="post" action="/event/submitForm" enctype="multipart/form-data">
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
            < Form />
        )
    }
}

export default Box;