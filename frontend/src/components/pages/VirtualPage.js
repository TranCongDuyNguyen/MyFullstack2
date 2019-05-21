import React, { Component } from 'react'
import io from "socket.io-client";
import { Row, Col } from "reactstrap";
import classNames from 'classnames';

import '../CSS/VirtualPageStyle.css';
import FrequencyInput from '../FrequencyInput';
import Led from '../Led'
import VirtualPageBtn from '../VirtualPageBtn';

export default class VirtualPage extends Component {
  state = {
    src: "",
    onPause: false,
    onPic: false,
    forw: false,
    rev: false,
    stop: false,
    maintenance: false,
    fault: false
  }
  componentDidMount() {
    this.socket = io();
    if(!this.state.onPause) {
      this.socket.on("picture", function (image) {
        this.setState({
          onPic: true,
          src: `data:image/jpeg;base64,${image}`
        });
      }.bind(this));
    }
    
    this.socket.on("motorStatus", function (status) {
      this.setState({
        forw: status.run,
        rev: status.rev,
        stop: status.stop,
        maintenance: status.maint,
        fault: status.fault,
      });
    }.bind(this));
  };
  componentWillUnmount() {
    this.socket.disconnect();
    this.socket.on("connect_error", function (error) {
      console.log(error);
      this.socket.disconnect();
    })
  };

  onPauseClick = () => {
    this.setState({
      onPause: true
    })
    this.socket.emit("vCmdToNX", "1");
  }
  onStartClick = () => {
    this.setState({
      onPause: false
    })
    this.socket.emit("vCmdToNX", "3");
  }
  onRefreshClick = () => {
    this.setState({
      onPause: false
    })
    this.socket.emit("vCmdToNX", "2");
  }

  render() {
    const { forw, rev, stop, maintenance, fault, onPic } = this.state;
    let loadPicClass = classNames({
      "background-pic": !onPic
    })
    return (
      <div style={{
        background: "linear-gradient(0deg, #29323c 0%, #485563 100%)",
        padding: "1em 1em 1em 1em",
        height: "38rem"
      }}>
        <Row>
          <Col >
            <div className={loadPicClass}></div>
            {this.state.onPause && <i class="fas fa-pause"></i>}
            <img className="pic" src={this.state.src} alt=""></img>
          </Col>
          <Col>
            <Row style={{ justifyContent: "space-evenly" }}>
              <div className="onlyled-container">
                <div className="led-container" style={{ marginRight: "1em" }}>
                  <Led className="red-led"
                    customColor={(fault && "#F00") || (!fault && "#FFFD")}
                    customShadow={fault && "rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px"}
                     />
                </div>
                <div className="led-container" >
                  <Led className="yellow-led"
                    customColor={(maintenance && "#FF0") || (!maintenance && "#FFFD")}
                    customShadow={maintenance && "rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #808002 0 -1px 9px, #FF0 0 2px 12px"}
                    />
                </div>
              </div>
              <FrequencyInput />

            </Row>
            <Row>
              <Col md="4">
                <div className="led-btn-wrapper">
                  <div className="led-btn-container">
                    <div className="led-container">
                      <VirtualPageBtn sendText="onForward"
                        btnType="green">Forward</VirtualPageBtn>
                      <Led className="green-led"
                        customColor={(forw && "#ABFF00") || (!forw && "#FFFD")}
                        customShadow={forw ? "rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, #89FF00 0 2px 12px" : "0px 0px #0000"}
                      />

                    </div>
                    <div className="led-container">
                      <VirtualPageBtn sendText="onStop"
                        btnType="red">Stop</VirtualPageBtn>
                      <Led className="red-led"
                        customColor={(stop && "#F00") || (!stop && "#FFFD")}
                        customShadow={stop ? "rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px" : "0px 0px #0000"}
                      />

                    </div>
                    <div className="led-container">
                      <VirtualPageBtn sendText="onReverse"
                        btnType="blue">Reverse</VirtualPageBtn>
                      <Led className="blue-led"
                        customColor={(rev && "#24E0FF") || (!rev && "#FFFD")}
                        customShadow={rev ? "rgba(0, 0, 0, 0.2) 0 -1px 8px 1px, inset  0 -1px 9px, #3F8CFF 0 2px 14px" : "0px 0px #0000"}
                      />

                    </div>
                  </div>
                </div>
              </Col>
              <Col>
                <div className="NX-btn">
                  <VirtualPageBtn onMyClick={this.onStartClick}
                    btnType="startNX"></VirtualPageBtn>
                  <VirtualPageBtn onMyClick={this.onRefreshClick}
                    btnType="restartNX"></VirtualPageBtn>
                  <VirtualPageBtn onMyClick={this.onPauseClick}
                    btnType="stopNX"></VirtualPageBtn>
                </div>

              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}




