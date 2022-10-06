import React from "react";
import "./createEvent.css";

class InpField extends React.Component {
    render() {
        return(
            <div className="textField">
                <input className="textInp" name={this.props.name} type="text" placeholder=" " />
                <span className="placeholder">{this.props.text}</span>
            </div>
        )
    }
}

class Form extends React.Component {
    render() {
        return (
            <div>
                <form id="eventForm" action="/createevent" method="post">
                    < InpField name={"eventName"} text={"EventName"} />
                    < InpField name={"eventOrganizer"} text={"Organizer"} />
                    <input id="eventSubmit" type="submit" />
                </form>
            </div>
        )
    }
}

class EventForm extends React.Component {
    render() {
        return (
            <div>
                < Form />
            </div>
        )
    }
}

export default EventForm;