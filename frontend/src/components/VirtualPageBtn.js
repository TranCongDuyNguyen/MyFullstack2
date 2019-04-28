import React, { Component } from 'react'
import io from 'socket.io-client';

import './CSS/VirtualPageBtnStyle.css';

export default class VirtualPageBtn extends Component {
  onClick = () => {
    this.socket.emit("vCmdToPLC", this.props.sendText);
  }
  render() {
    const { btnType } = this.props;
    return (
      <div className="virtual-btn">
        {btnType === "green" && <div className="push-btn green"
          onClick={this.onClick}
          >
          {this.props.children}
        </div>}
        {btnType === "blue" && <div className="push-btn blue"
          onClick={this.onClick}
          >
          {this.props.children}
        </div>}
        {btnType === "red" && <div className="push-btn red"
          onClick={this.onClick}
          >
          {this.props.children}
        </div>}
        {btnType === "yellow" && <div className="push-btn yellow"
          onClick={this.onClick}
          >
          {this.props.children}
        </div>}
        {btnType === "startNX" && <div className="push-btn NXbtn"
          onClick={this.props.onMyClick}
          >
          <i className="fas fa-play"></i>
        </div>}
        {btnType === "stopNX" && <div className="push-btn NXbtn"
          onClick={this.props.onMyClick}
          >
        <i className="fas fa-square"></i>
        </div>}
        {btnType === "restartNX" && <div className="push-btn NXbtn"
          onClick={this.props.onMyClick}
          >
          <i className="fas fa-redo"></i>
        </div>}
      </div>
    )
  }
  componentDidMount() {
    this.socket = io("http://localhost:5000")
  };

  componentWillUnmount() {
    this.socket.disconnect();
    this.socket.on("connect_error", function (error) {
      console.log(error);
      this.socket.disconnect();
    })
  };
}
