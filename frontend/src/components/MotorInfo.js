import React, { Component } from 'react'
import io from "socket.io-client";

import './CSS/MotorInfoStyle.css';

export default class MotorInfo extends Component {
  render() {
    return (
      <div className="motor-info">
        
      </div>
    )
  }

  componentDidMount() {
    this.socket = io()
  }

  componentWillUnmount() {
    this.socket.disconnect();
    this.socket.on("connect_error", function (error) {
      console.log(error);
      this.socket.disconnect();
    })
  };

}
