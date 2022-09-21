import React from "react";
import axios from "axios";
import "./viewer.css"

class Section extends React.Component {
    render() {
        if (this.props.comps.type != "file"){
            return (
                <div className="section">
                    <div className="title">{this.props.name}</div>
                    <div className="content">{this.props.data[this.props.comps.name]}</div>
                </div>
            )
        } else {
            var file = "/uploads/" + this.props.data.files[this.props.comps.name];
            return (
                <div className="section">
                    <div className="title">{this.props.name}</div>
                    <img className="files" src={file} />
                </div>
            )
        }
    }
}

class Applicant extends React.Component {
    render() {
        const datas = this.props.allData;
        const eles = Object.keys(datas.comps.elements).map((name) => 
            <div>
                < Section name={name} data={datas.applicants[this.props.num]} comps={datas.comps.elements[name]} />
            </div>
        )
        return (
            <div className="applicant">{eles}</div>
        )
    }
}

class Viewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allData: false,
            ind: 0,
        }

        axios.get("/event/data")
            .then((resp) => {
                this.setState({allData: resp.data, nApplicants: resp.data["applicants"].length});
            })
            .catch((err) => {
                console.error(err);
            })

        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
    }

    handleNext() {
        var newInd = this.state.ind + 1;
        document.getElementById("prev").style.backgroundColor = "rgb(113, 158, 255)";
        if (newInd < this.state.nApplicants) {
            this.setState({ind: newInd});
        }
        if (newInd == this.state.nApplicants - 1) {
            document.getElementById("next").style.backgroundColor = "gray";
        }
    }

    handlePrev() {
        var newInd = this.state.ind - 1;
        document.getElementById("next").style.backgroundColor = "rgb(113, 158, 255)";
        if (newInd >= 0) {
            this.setState({ind: newInd});
        }
        if (newInd <= 0) {
            document.getElementById("prev").style.backgroundColor = "gray";
        }
    }

    render() {
        if (this.state.allData) {
            var applicant = < Applicant num={this.state.ind} allData={this.state.allData} />;

            return (
                <div id="main">
                    {applicant}
                    <div className="choices">
                        <div className="opt" id="accept">ACCEPT</div>
                        <div className="opt" id="reject">REJECT</div>
                        <div className="opt" id="next" onClick={this.handleNext}>NEXT</div>
                        <div className="opt" id="prev" onClick={this.handlePrev}>PREV</div>
                    </div>
            </div>
            )
        }
    }
}

export default Viewer;