import React, { Component } from 'react'
import io from "socket.io-client";

import TrendChart from './TrendChart';

export default class DriveTempTC extends Component {
    state = {
        data: [{
            time: "00:00:00",
            driveT: 0
        }]
    }

    render() {
        return (
            <div className="temp">
                <TrendChart data={this.state.data}
                    dataKey="driveT"
                    yAxisName= "&deg;C"
                    customColor="#F7A072"
                    colorId="driveTTC"></TrendChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000", {transports: ['websocket']});
        this.socket.on(this.props.ioTopic, function (driveTBuffer) {
            console.log(driveTBuffer);
            this.setState((state) => {
                return {
                    data: driveTBuffer
                }
            });
        }.bind(this));
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function(error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
}
