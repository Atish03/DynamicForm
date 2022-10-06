import axios from "axios";
import React from "react";
import "./events.css";

class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Events: {},
            status: "Loading",
        }

        axios.get("/allevents").then((resp) => {
            this.setState({Events: resp.data, status: "Done"});
        })
    }

    render() {
        if (this.state.status == "Done") {
            return(
                <div>
                    {
                        Object.keys(this.state.Events).map((number) => 
                            <div className="event">
                                <div className="eventName">{this.state.Events[number].Name}</div>
                                <div className="eventOrganizer">{this.state.Events[number].Organizer}</div>
                            </div>
                        )
                    }
                </div>
            )
        } else {
            return(
                <div>{this.state.status}</div>
            )
        }
    }
}

export default Event;