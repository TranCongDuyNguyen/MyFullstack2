import React, { Component } from 'react'
import io from "socket.io-client";

import DoughnutChart from './DoughnutChart';

export default class DriveTempDC extends Component {
    state = {
        data: [
            {
                name: "DriveTemp",
                driveT: 40
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
            <div className="driveT-dc">
                <DoughnutChart data={data.concat([])}
                    dataKey="driveT"
                    threshold={60}
                    offset={20}
                    colorId="driveT"
                    startGradColor="#FFF275"
                    endGradColor="#fd1d1d"
                    theUnit="&deg;C"
                    flash={this.state.flash}></DoughnutChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000").connect();
        this.socket.on(this.props.ioTopic, function (motorObj) {
            this.newData[0].driveT = motorObj.driveT;
            this.setState((state) => {
                return {
                    data: this.newData
                }
            });
            if (motorObj.driveT > 80) {
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
