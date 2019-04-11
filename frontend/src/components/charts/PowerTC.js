import React, { Component } from 'react'
import io from "socket.io-client";

import TrendChart from './TrendChart';

export default class PowerTC extends Component {
    state = {
        data: [{
            time: "00:00:00",
            power: 0
        }]
    }

    render() {
        return (
            <div>
                <TrendChart data={this.state.data}
                    dataKey="power"
                    yAxisName="Power (W)"
                    customColor="#89BBFE"
                    colorId="powerTC"></TrendChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000", {transports: ['websocket']});
        this.socket.on(this.props.ioTopic, function (powerBuffer) {
            this.setState((state) => {
                return {
                    data: powerBuffer
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
