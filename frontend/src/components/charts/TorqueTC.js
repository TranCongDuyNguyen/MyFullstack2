import React, { Component } from 'react'
import io from "socket.io-client";

import TrendChart from './TrendChart';

export default class TorqueTC extends Component {
  state = {
    data: [{
      time: "00:00:00",
      torque: 0
    }]
  }

  render() {
    return (
      <div>
        <TrendChart data={this.state.data}
          dataKey="torque"
          yAxisName="Torque (N/m)"
          customColor="#BC96E6"
          colorId="torqueTC"></TrendChart>
      </div>
    )
  }

  componentDidMount() {
    this.socket = io("http://localhost:5000", { transports: ['websocket'] });
    this.socket.on(this.props.ioTopic, function (torqueBuffer) {

      this.setState((state) => {
        return {
          data: torqueBuffer
        }
      });
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
