import React, { Component } from 'react'
import io from "socket.io-client";

import TrendChart from './TrendChart';
import '../CSS/TrendChartStyle.css';
let isStop = false;

export default class CurrentTC extends Component {
    state = {
        data: [{
            time: "00:00:00",
            amp: 0
        }]
    }
    componentDidMount() {
        this.socket = io();
        this.socket.on(this.props.ioTopic, function (ampereBuffer) {
            if (!isStop) {
                this.setState((state) => {
                    return {
                        data: ampereBuffer
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
        console.log("a");
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
    onForwClick = () => {
        if (isStop) {
            this.socket.emit("reviewStore", this.props.forwFlag);
            this.socket.on(this.props.reviewData, function (reviewData) {
                    this.setState((state) => {
                        return {
                            data: reviewData
                        }
                    });
                
            }.bind(this));
        }
    }
    componentWillReceiveProps(nxtProps) {
        if(nxtProps.allPauseState !== this.props.allPauseState) {
            this.onStopClick();
        }
    }
    render() {
        
        return (
            <div>
                <div className="review-btn" onClick={this.onReviewClick}><i className="fas fa-angle-left"></i></div>
                <div className="forw-btn" onClick={this.onForwClick}><i className="fas fa-angle-right"></i></div>
                <TrendChart data={this.state.data}
                    dataKey="amp"
                    yAxisName="Current (A)"
                    customColor="#45F0DF"
                    colorId="currentTC"
                    width={450}
                    height={210}
                    onStopClick={this.onStopClick} >
                </TrendChart>
            </div>
        )
    }
}
