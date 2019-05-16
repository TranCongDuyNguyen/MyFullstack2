import React, { Component } from 'react'
import io from 'socket.io-client';

import './CSS/FreHeightInputStyle.css';

export default class FrequencyInput extends Component {

    state = {
        text: "",
        frequency: 0
    }

    onChange = (e) => {
        if (parseFloat(e.target.value) > 100) {
            e.target.value = '100';
        }
        else if (parseFloat(e.target.value) < 0) {
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
        else if(parseFloat(this.state.text) < 100) {
            this.setState({
                text: (parseFloat(this.state.text) + 10).toString()
            })
        }
    }
    onDecClick = () => {
        if(parseFloat(this.state.text) > 0) {
            this.setState({
                text: (parseFloat(this.state.text) - 10).toString()
            })
        } 
    }

    onKeyUp = (e) => {
        let text = e.target.value;
        if (e.keyCode === 13) {
            if (!text) { return; };
            this.socket.emit("setFrequency", Number(this.state.text).toFixed(2));
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
                    <span className="f-txt">{`${this.state.frequency} Hz`}</span>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io()
        this.socket.on("motorStatus", function (status) {
            console.log(status.freq);
            this.setState({
                frequency: status.freq
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
