import React, { Component } from 'react'
import io from "socket.io-client";

import DoughnutChart from './DoughnutChart';


export default class MotorTempDC extends Component {

    state = {
        data: [
            {
                name: "MotorTemp",
                motorT: 0
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
                    data1={data.concat([])}
                    dataKey="motorT"
                    fault={this.props.faultLvl}                             /**/
                    warn={this.props.warnLvl}
                    colorId="motorT"
                    startGradColor="#FFF275"
                    endGradColor="#fd1d1d"
                    theUnit = "%"
                    flash={this.state.flash}
                    onAdjTriClick={this.props.onAdjTriClick}
                    id={this.props.id}
                    triBtnPos={this.props.triBtnPos}
                    maxScale={this.props.maxScale}
                    bSize={this.props.bSize}
                    sSize={this.props.sSize}></DoughnutChart>
            </div>
        )
    }

    componentDidMount() {
        this.socket = io()
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




