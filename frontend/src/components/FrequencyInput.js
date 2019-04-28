import React, { Component } from 'react'
import io from 'socket.io-client';

import './CSS/FreHeightInputStyle.css';

export default class FrequencyInput extends Component {

    state = {
        text: "",
        frequency: "",
        otime: ""
    }

    onChange = (e) => {
        if (parseInt(e.target.value) > 100) {
            e.target.value = '100';
        }
        else if (parseInt(e.target.value) < 0) {
            e.target.value = '0';
        }
        if (e.target.value.length > 4) {
            let newS = e.target.value.slice(0, 4);
            e.target.value = newS;
        }
        this.setState({
            text: e.target.value
        })
    }
    onIncClick = () => {
        if (!this.state.text) {
            this.setState({
                text: "10"
            })
        }
        else if(parseInt(this.state.text) < 100) {
            this.setState({
                text: (parseInt(this.state.text) + 10).toString()
            })
        }
    }
    onDecClick = () => {
        if(parseInt(this.state.text) > 0) {
            this.setState({
                text: (parseInt(this.state.text) - 10).toString()
            })
        } 
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
            <div className="freq-input" style={{ fontFamily: "Helvetica" }}>
                <div className="f-box">
                    <input type="number"
                        className="f-input"
                        value={this.state.text}
                        onChange={this.onChange}
                        onKeyUp={this.onKeyUp}
                        min="0"
                        max="100"
                        placeholder="Speed">
                    </input>
                    <div className="spin-btn">
                        <i className="fas fa-chevron-up" onClick={this.onIncClick}></i>
                        <i className="fas fa-chevron-down" onClick={this.onDecClick}></i>
                    </div>
                </div>
                <div className="f-box" style={{ width: "6rem" }}>
                    <span className="f-txt">{this.state.frequency }</span>
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
        this.socket.on("connect_error", function (error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
}
