import React, { Component } from 'react'
import io from 'socket.io-client';

import './CSS/FrequencyInputStyle.css';
import ArrowButton from '../images/arrow-button-frequency.svg';

export default class FrequencyInput extends Component {

    state = {
        text: "",
        frequency: "",
        otime: ""
    }

    onChange = (e) => {
        this.setState({
            text: e.target.value
        })
    }

    onClick = () => {
        this.socket.emit("setFrequency", this.state.text);
        this.setState({
            text: ""
        })
    }

    onKeyUp = (e) => {
        let text = e.target.value;
        if (e.keyCode === 13) {
            if (!text) { return; };
            this.socket.emit("setFrequency", this.state.text);
            this.setState({
                text: ""
            })
        }

    }

    render() {
        return (
            <div style={{ fontFamily: "Helvetica" }}>
                <div className="f-box">
                    <input type="number"
                        className="f-input"
                        value={this.state.text}
                        onChange={this.onChange}
                        onKeyUp={this.onKeyUp} />

                    <img className="f-button"
                        src={ArrowButton} alt=""
                        style={{ height: "100%" }}
                        onClick={this.onClick}></img>

                </div>
                <div className="f-box" style={{ width: "10rem" }}>
                    <span className="f-txt">{this.state.frequency + " Hz"}</span>>
                </div>
                <div className="otime-box" style={{ width: "15rem" }}>
                    {this.state.otime}
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000", {transports: ['websocket']})
        this.socket.on("realFrequency", function (frequency) {
            console.log(frequency);
            this.setState({
                frequency
            })
        }.bind(this));
        this.socket.on("oTime", function (otime) {
            console.log(otime);
            this.setState({
                otime
            })
        }.bind(this))
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function(error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
}
