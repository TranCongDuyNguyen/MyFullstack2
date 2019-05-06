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
                text: "1"
            })
        }
        else if(parseInt(this.state.text) < 100) {
            this.setState({
                text: (parseInt(this.state.text) + 1).toString()
            })
        }
    }
    onDecClick = () => {
        if(parseInt(this.state.text) > 0) {
            this.setState({
                text: (parseInt(this.state.text) - 1).toString()
            })
        } 
    }

    onKeyUp = (e) => {
        let text = e.target.value;
        if (e.keyCode === 13) {
            if (!text) { return; };
            this.socket.emit(this.props.ioTopic, this.state.text);
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
