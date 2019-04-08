import React, { Component } from 'react'
import io from "socket.io-client";

import DoughnutChart from './DoughnutChart';

export default class TorqueDC extends Component {
    state = {
        data: [
            {
                name: "Torque",
                torque: 60
            },
            {
                name: "Ref",
                refKey: 100
            }
        ],
        flash: false
    }
    newData = JSON.parse(JSON.stringify(this.state.data)); //deep clone

    render() {
        const { data } = this.state;
        return (
            <div className="torque-dc">
                <DoughnutChart data={data.concat([])}
                    dataKey="torque"
                    threshold={60}
                    offset={20}
                    colorId="torque"
                    startGradColor="#56bc2f"
                    endGradColor="#a8e063"
                    theUnit = "Nm"
                    flash={this.state.flash}>
                </DoughnutChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000", { transports: ['websocket'] }).connect();
        this.socket.on(this.props.ioTopic, function (motorObj) {
            this.newData[0].torque = motorObj.torque;
            this.setState((state) => {
                return {
                    data: this.newData
                }
            });
            if (motorObj.torque > 80) {
                this.setState({
                    flash: !this.state.flash
                })
            }
        }.bind(this));
    };

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function (error) {
            console.log(error);
            this.socket.disconnect();
        })
    };

}
