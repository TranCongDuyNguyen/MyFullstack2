import React, { Component } from 'react'
import io from "socket.io-client";

import Led from './Led';
import './CSS/OperatingTimeStyle.css';

export default class OperatingTime extends Component {
    state = {
        oTime: "00:00:00",
        maintenance: false
    }

    render() {
        const { maintenance } = this.state;
        return (
            <div>
                <h2 className="operate-time">
                    {this.state.oTime}
                </h2>
                <Led className="yellow-led"
                    customColor={(maintenance && "#FF0") || (!maintenance && "#BBB")}
                    customShadow={maintenance && "rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #808002 0 -1px 9px, #FF0 0 2px 12px"}
                    customShadowOfText={maintenance && "0 0 0.4em 0.1em rgb(199, 255, 236)"}>
                    Maintenance
                </Led>
            </div>

        )
    }

    componentDidMount() {
        const ioApi = this.props.ioTopic;
        this.socket = io("http://localhost:5000", { transports: ['websocket'] }).connect();
        this.socket.on(ioApi[1], function (oTime) {
            this.setState({
                oTime
            })
        }.bind(this))
        this.socket.on(ioApi[0], function (statusObj) {
            console.log(statusObj);
            this.setState({
                maintenance: statusObj.maintenance
            })
        }.bind(this))
    }

    
  componentWillUnmount() {
    this.socket.disconnect();
    this.socket.on("connect_error", function (error) {
      console.log(error);
      this.socket.disconnect();
    })
  };
}
