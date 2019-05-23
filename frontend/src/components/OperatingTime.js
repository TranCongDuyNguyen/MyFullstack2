import React, { Component } from 'react'
import io from "socket.io-client";
import axios from "axios";

import Led from './Led';
import './CSS/OperatingTimeStyle.css';

export default class OperatingTime extends Component {
    state = {
        oTime: 0,
        maintenance: false
    }

    render() {
        const { maintenance } = this.state;
        return (
            <div>
                <h5 className="operate-time">
                    Operating hours: {this.state.oTime}
                </h5>
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
        axios.get(`/api/operateTime/${this.props.reqId}`)
        .then(payload => {
            this.setState({
                oTime: payload.data.otime
            })
        }).catch(err => console.log(err));;
        this.socket = io();
        this.socket.on(this.props.ioTopic, function (oTime) {
            this.setState({
                oTime
            })
        }.bind(this))
        this.socket.on("motorStatus", function (statusObj) {
            this.setState({
                maintenance: statusObj.maint
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
