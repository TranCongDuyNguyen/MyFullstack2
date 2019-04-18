import React, { Component } from 'react'
import io from "socket.io-client";

import TrendChart from './TrendChart';
import '../CSS/TrendChartStyle.css';
let isStop = false;

export default class DriveTempTC extends Component {
    state = {
        data: [{
            time: "00:00:00",
            driveT: 0
        }]
    }
    componentDidMount() {
        this.socket = io("http://localhost:5000");
        this.socket.on(this.props.ioTopic, function (driveTBuffer) {
            if (!isStop) {
                this.setState((state) => {
                    return {
                        data: driveTBuffer
                    }
                });
            }
        }.bind(this));
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function (error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
    onStopClick = () => {
        isStop = !isStop;
        this.socket.emit("stopStoring", this.props.stopFlag);
    }
    onReviewClick = () => {
        if (isStop) {
            this.socket.emit("reviewStore", this.props.reviewFlag);
            this.socket.on(this.props.reviewData, function (reviewData) {
                    this.setState((state) => {
                        return {
                            data: reviewData
                        }
                    });
                
            }.bind(this));
        }
    }
    render() {
        return (
            <div className="temp">
                <div className="review-btn" onClick={this.onReviewClick}><i class="fas fa-angle-left"></i></div>
                <TrendChart data={this.state.data}
                    dataKey="driveT"
                    yAxisName="&deg;C"
                    customColor="#F7A072"
                    colorId="driveTTC"
                    onStopClick={this.onStopClick} ></TrendChart>
            </div>
        )
    }


}
