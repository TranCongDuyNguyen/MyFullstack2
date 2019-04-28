import React, { Component } from 'react'
import io from "socket.io-client";

import DoughnutChart from './DoughnutChart';


export default class MotorTempDC extends Component {

    state = {
        data: [
            {
                name: "MotorTemp",
                motorT: 50
            },
            {
                name: "Ref",
                refKey: this.props.maxScale
            }
        ],
        flash: false
    }
    newData = JSON.parse(JSON.stringify(this.state.data)); //deep clone
    componentWillReceiveProps(nxtProps) {
        if(nxtProps.maxScale !== this.props.maxScale) {
            this.newData[1].refKey = nxtProps.maxScale;
            this.setState({
                data: this.newData
            })
        }
    }
    render() {
        const { data } = this.state;
        return (
            <div>
                <DoughnutChart data={data.concat([])}
                    dataKey="motorT"
                    threshold={60}
                    offset={20}
                    colorId="motorT"
                    startGradColor="#FFF275"
                    endGradColor="#fd1d1d"
                    theUnit = "&deg;C"
                    flash={this.state.flash}
                    onAdjTriClick={this.props.onAdjTriClick}
                    id={this.props.id}
                    triBtnPos={this.props.triBtnPos}
                    maxScale={this.props.maxScale}
                    sSize={this.props.sSize}
                    ssSize={this.props.ssSize}></DoughnutChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io("http://localhost:5000")
        this.socket.on(this.props.ioTopic, function (motorObj) {
            this.newData[0].motorT = motorObj[this.props.valKey];
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




