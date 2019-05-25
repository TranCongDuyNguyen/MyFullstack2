import React, { Component } from 'react'

import io from "socket.io-client";

import DoughnutChart from './DoughnutChart';

export default class SpeedDC extends Component {
    state = {
        data: [
            {
                name: "Speed",
                freq: 40
            },
            {
                name: "Ref",
                refKey: this.props.maxScale
            }
        ],
        flash: false
    }
    newData = JSON.parse(JSON.stringify(this.state.data)); //deep clone

    render() {
        const { data } = this.state;
        let data1 = [
            {
                name: "Torque",
                tor: Math.abs(data[0].freq)
            },
            {
                name: "Ref",
                refKey: this.props.maxScale
            }
        ]
        return (
            <div className="speed-dc">
                <DoughnutChart data={data.concat([])}
                    data1={data1}
                    dataKey="freq"
                    fault={this.props.faultLvl}                             /**/
                    warn={this.props.warnLvl}
                    colorId="speed"
                    startGradColor="#141e30"
                    endGradColor="#243b55"
                    theUnit="Hz"
                    flash={this.state.flash}
                    onAdjTriClick={this.props.onAdjTriClick}
                    id={this.props.id}
                    triBtnPos={this.props.triBtnPos}
                    maxScale={this.props.maxScale}
                    bSize={this.props.bSize}
                    sSize={this.props.sSize}>
                </DoughnutChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io().connect();
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
