import React, { Component } from 'react'
import io from "socket.io-client";

import './CSS/MotorInfoStyle.css';

export default class MotorInfo extends Component {
  state = {
    amp: 0,
    tor: 0,
    motorT: 0,
    driveT: 0,
    power: 0
  }
  render() {
    const { amp, tor, motorT, driveT, power } = this.state;
    return (
      <div className="motor-info">
        <div>
          <pre>Current:       {amp}   A</pre>
        </div>
        <div>
        <pre>Torque:        {tor}  Nm</pre>
        </div>
        <div>
        <pre>Motor Thermal: {motorT}  &deg;C</pre>
        </div>

        <div>
        <pre>Drive Thermal: {driveT}  &deg;C</pre>
        </div>

        <div>
        <pre>Power:         {power}   W</pre>
        </div>

      </div>
    )
  }

  componentDidMount() {
    this.socket = io("http://localhost:5000", { transports: ['websocket'] }).connect();
    this.socket.on(this.props.ioTopic, function (motorObj) {
      this.setState({
        amp: motorObj.amp,
        tor: motorObj.torque,
        motorT: motorObj.motorT,
        driveT: motorObj.driveT,
        power: motorObj.power
      })
    }.bind(this));
  }

  componentWillUnmount() {
    this.socket.disconnect();
    this.socket.on("connect_error", function (error) {
      console.log(error);
      this.socket.disconnect();
    })
  };

}
