import React, { Component } from 'react'
import io from 'socket.io-client';

import './CSS/FrequencyInputStyle.css';

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
            <div className="freq-input" style={{ fontFamily: "Helvetica"}}>
                <div className="f-box">
                    <input type="number"
                        className="f-input"
                        value={this.state.text}
                        onChange={this.onChange}
                        onKeyUp={this.onKeyUp} />
                    
                    <div className="f-button" onClick={this.onClick}> 
                        <i className="fas fa-angle-right" style={{margin:"auto", height:"0.8em"}}>
                    </i>
                    </div>
                   
                </div>
                <div className="f-box" style={{ width: "10rem" }}>
                    <span className="f-txt">{this.state.frequency + " Hz"}</span>>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000")
        this.socket.on("realFrequency", function (frequency) {
            console.log(frequency);
            this.setState({
                frequency
            })
        }.bind(this));
    };

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function(error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
}
