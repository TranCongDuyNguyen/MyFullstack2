import React, { Component } from 'react'
import io from "socket.io-client";

import DoughnutChart from './DoughnutChart';

export default class CurrentDC extends Component {
    state = {
        data: [
            {
                name: "Current",
                amp: 40
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
            <div className="current-dc">
                <DoughnutChart data={data.concat([])}
                    dataKey="amp"
                    threshold={60}
                    offset={20}
                    colorId="current"
                    startGradColor="#FFF275"
                    endGradColor="#d0ed57"
                    theUnit = "A"
                    flash={this.state.flash}>
                </DoughnutChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000", { transports: ['websocket'] }).connect();
        this.socket.on(this.props.ioTopic, function (motorObj) {
            this.newData[0].amp = motorObj.amp;
            this.setState((state) => {
                return {
                    data: this.newData
                }
            });
            if(motorObj.amp > 80) {
                this.setState({
                    flash: !this.state.flash
                })
            }
        }.bind(this));
    };

    componentWillUnmount() {
       this.socket.disconnect();
       this.socket.on("connect_error", function(error) {
        console.log(error);
        this.socket.disconnect();
    })
    };

}
