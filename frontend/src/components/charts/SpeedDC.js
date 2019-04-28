import React, { Component } from 'react'

import io from "socket.io-client";

import DoughnutChart from './DoughnutChart';

export default class SpeedDC extends Component {
    state = {
        data: [
            {
                name: "Speed",
                freq: 80
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
            <div className="speed-dc">
                <DoughnutChart data={data.concat([])}
                    dataKey="freq"
                    threshold={60}
                    offset={20}
                    colorId="speed"
                    startGradColor="#7161EF"
                    endGradColor="#957FEF"
                    theUnit="Hz"
                    flash={this.state.flash}>
                </DoughnutChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000").connect();
        this.socket.on(this.props.ioTopic, function (motorObj) {
            this.newData[0].freq = motorObj[this.props.valKey];
            this.setState((state) => {
                return {
                    data: this.newData
                }
            });
            if (motorObj[this.props.valKey] > 80) {
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
