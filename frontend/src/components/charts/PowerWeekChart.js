import React, { Component } from 'react'
import io from "socket.io-client";
import StatisticChart from './StatisticChart';

export default class PowerDayChart extends Component {
    state = {
        data: [
            { power: 0, time: "Monday" },
            { power: 0, time: "Tuesday" },
            { power: 0, time: "Wednesday" },
            { power: 0, time: "Thursday" },
            { power: 0, time: "Friday" },
            { power: 0, time: "Saturday" },
            { power: 0, time: "Sunday" }
        ]
    }
    componentDidMount() {
        this.socket = io();
        this.socket.on("powerInWeek", function (piwBuffer) {
                this.setState((state) => {
                    return {
                        data:piwBuffer
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
  render() {
    return (
        <StatisticChart data={this.state.data}
            width={750}
            height={300}
            dataKey="power"
            yAxisName="Power (W)"
            customColor="#89BBFE"
            colorId="powerTC">

        </StatisticChart>
    )
  }
}
