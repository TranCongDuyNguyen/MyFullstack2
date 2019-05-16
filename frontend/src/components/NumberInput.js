import React, { Component } from 'react'
import io from 'socket.io-client';

import "./CSS/NumberInput.css";

export default class NumberInput extends Component {
    
    state = {
        text: ""
    }
    componentDidMount() {
        this.socket = io()
    };
    onChange = (e) => {
        if (parseFloat(e.target.value) > 100.0) {
            e.target.value = '100';
        }
        else if (parseFloat(e.target.value) < 0.0) {
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
                text: "1"
            })
        }
        else if(parseFloat(this.state.text) < 100.0) {
            this.setState({
                text: (parseFloat(this.state.text) + 1).toString()
            })
        }
    }
    onDecClick = () => {
        if(parseFloat(this.state.text) > 0.0) {
            this.setState({
                text: (parseFloat(this.state.text) - 1).toString()
            })
        } 
    }

    onKeyUp = (e) => {
        let text = e.target.value;
        if (e.keyCode === 13) {
            if (!text) { return; };
            this.socket.emit(this.props.ioTopic, Number(this.state.text).toFixed(2));
            console.log(Number(this.state.text).toFixed(2));
            this.setState({
                text: ""
            })
        }
    }
  render() {
    return (
      <div className="numb-input-box">
          <input type="number"
                        className="numb-input"
                        value={this.state.text}
                        onChange={this.onChange}
                        onKeyUp={this.onKeyUp}
                        min="0"
                        max="100"
                        placeholder={this.props.placeholder}>
                    </input>
                    <div className="spin-btn">
                        <i className="fas fa-chevron-up" onClick={this.onIncClick}></i>
                        <i className="fas fa-chevron-down" onClick={this.onDecClick}></i>
                    </div>
      </div>
    )
  }
}
