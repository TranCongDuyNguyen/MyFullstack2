import React, { Component } from 'react';
import io from "socket.io-client";
export default class TriangleBtn extends Component {

    componentDidMount() {
      this.socket = io("http://localhost:5000");
  };
  componentWillUnmount() {
      this.socket.disconnect();
      this.socket.on("connect_error", function (error) {
          console.log(error);
          this.socket.disconnect();
      })
  };
  render() {
    let {value} = this.props;
    let amount = value*20;
    let pointGroup = `36,${309-amount} 36,${325-amount} 48,${317-amount}`;
    return (
      <div className="triangle-btn-box">
        <svg width="50" height="340" className="triangle" >
            <polygon points={pointGroup} onClick={this.props.onOpenModal}></polygon>
        </svg>
      </div>
    )
  }
}
