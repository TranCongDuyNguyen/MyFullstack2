import React, { Component } from 'react'
import io from "socket.io-client";

import TrendChart from './TrendChart';

export default class MotorTempTC extends Component {
    state = {
        data: [{
            time: "00:00:00",
            motorT: 0
        }]
    }

    render() {
        return (
            <div className="temp">
                <TrendChart data={this.state.data}
                    dataKey="motorT"
                    yAxisName= "&deg;C"
                    customColor="#FE654F"
                    colorId="motorTTC"></TrendChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000", {transports: ['websocket']});
        this.socket.on(this.props.ioTopic, function (motorTBuffer) {
            this.setState((state) => {
                return {
                    data: motorTBuffer
                }
            });
        }.bind(this));
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function(error) {
            if (error) {
                console.log(error);    
            }
            this.socket.disconnect();
        })
    };
}
