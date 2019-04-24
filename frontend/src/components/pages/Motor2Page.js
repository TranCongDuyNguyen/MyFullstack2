import React, { Component } from 'react'
import {
    Container,
    Row,
    Col
} from "reactstrap";
import classNames from "classnames";

import TorqueDC from '../charts/TorqueDC';
import CurrentDC from '../charts/CurrentDC';
import DriveTempDC from '../charts/DriveTempDC';
import MotorTempDC from '../charts/MotorTempDC';
import PowerDC from '../charts/PowerDC';
import CurrentTC from '../charts/CurrentTC';
import TorqueTC from '../charts/TorqueTC';
import MotorTempTC from '../charts/MotorTempTC';
import DriveTempTC from '../charts/DriveTempTC';
import PowerTC from '../charts/PowerTC';
import OperatingTime from '../OperatingTime';
import WarnPanel from '../WarnPanel';
import "../CSS/MonitorPageStyle.css";
import MotorPic from "../../images/motor.png";

export default class Motor2Page extends Component {
    state = {
        isHideTor: false,
        isHideCur: false,
        isHideMotorT: false,
        isHideDriveT: false,
        isHidePower: false,
        isPauseAllTrend: false
    }
    onDeleteTrend = (e) => {
        let eclass = e.target.className;
        if(eclass === "exit-button cur") {
            if (this.state.isHideCur) {
                this.setState({
                    isHideCur: !this.state.isHideCur
                })
            }
        }
        if(eclass === "exit-button tor") {
            if (this.state.isHideTor) {
                this.setState({
                    isHideTor: !this.state.isHideTor
                })
            }
        }
        if(eclass === "exit-button motorT") {
            if (this.state.isHideMotorT) {
                this.setState({
                    isHideMotorT: !this.state.isHideMotorT
                })
            }
        }
        if(eclass === "exit-button driveT") {
            if (this.state.isHideDriveT) {
                this.setState({
                    isHideDriveT: !this.state.isHideDriveT
                })
            }
        }
        if(eclass === "exit-button pow") {
            if (this.state.isHidePower) {
                this.setState({
                    isHidePower: !this.state.isHidePower
                })
            }
        }
    }
    onAddTrend = (e) => {
        let eclass = e.target.className;
        if(eclass === "trend-button cur" || eclass === "fas fa-chart-line cur"){
            if (!this.state.isHideCur) {
                this.setState({
                    isHideCur: !this.state.isHideCur
                })
            }
        }
        if(eclass === "trend-button tor" || eclass === "fas fa-chart-line tor"){
            if (!this.state.isHideTor) {
                this.setState({
                    isHideTor: !this.state.isHideTor
                })
            }
        }
        if(eclass === "trend-button motorT" || eclass === "fas fa-chart-line motorT"){
            if (!this.state.isHideMotorT) {
                this.setState({
                    isHideMotorT: !this.state.isHideMotorT
                })
            }
        }
        if(eclass === "trend-button driveT" || eclass === "fas fa-chart-line driveT"){
            if (!this.state.isHideDriveT) {
                this.setState({
                    isHideDriveT: !this.state.isHideDriveT
                })
            }
        }
        if(eclass === "trend-button pow" || eclass === "fas fa-chart-line pow"){
            if (!this.state.isHidePower) {
                this.setState({
                    isHidePower: !this.state.isHidePower
                })
            }
        }
    }
    onPauseAllTrend = () => {
        this.setState({
            isPauseAllTrend: !this.state.isPauseAllTrend
        })
    }
    render() {
        let { isHideCur, isHideDriveT, isHideMotorT, isHidePower, isHideTor, isPauseAllTrend } = this.state;
        let curState = classNames({
            "tc-box": true,
            "hide": !isHideCur
        })
        let torState = classNames({
            "tc-box": true,
            "hide": !isHideTor
        })
        let motorTState = classNames({
            "tc-box": true,
            "hide": !isHideMotorT
        })
        let driveTState = classNames({
            "tc-box": true,
            "hide": !isHideDriveT
        })
        let powerState = classNames({
            "tc-box": true,
            "hide": !isHidePower
        })
        return (
            <div style={{
                background: "linear-gradient(0deg, #29323c 0%, #485563 100%)",
                padding: "1em 1em 1em 1em"
            }}>
                <Container className="motor-1-dc" style={{ marginBottom: "1em" }}>
                    <Row>
                        <Col md="6" className="leftside">
                            <div className="page-button">
                                <a href="/monitor/1" alt="">1</a>
                                <a href="/monitor/2" alt="">2</a>
                            </div>
                            <div className="motor-1-pic">
                                <img className="motor-image" src={MotorPic} alt=""/>
                            </div>
                            <WarnPanel ioTopic="warnList2"/>
                        </Col>
                        <Col md="6" className="rightside" >
                            <Row className="current-and-torque" style={{justifyContent: "center"}}>
                                <div className="current-box" >
                                    <CurrentDC ioTopic="motor2DCData" valKey="amp2"/>
                                    <div className="trend-button cur"
                                        onClick={this.onAddTrend}>
                                        <i className="fas fa-chart-line cur"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                <div className="torque-box">
                                    <TorqueDC ioTopic="motor2DCData" valKey="tor2"/>
                                    <div className="trend-button tor"
                                        onClick={this.onAddTrend}>
                                        <i className="fas fa-chart-line tor"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                            </Row>
                            <Row className="thermal" style={{justifyContent: "center"}}>
                                <div className="motorT-box" >
                                    <MotorTempDC ioTopic="motor2DCData" valKey="motor2T"/>
                                    <div className="trend-button motorT"
                                        onClick={this.onAddTrend}>
                                        <i className="fas fa-chart-line motorT"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                <div className="driveT-box">
                                    <DriveTempDC ioTopic="motor2DCData" valKey="drive2T"/>
                                    <div className="trend-button driveT"
                                        onClick={this.onAddTrend}>
                                        <i className="fas fa-chart-line driveT"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                            </Row>
                            <Row className="otime-and-setting" style={{justifyContent: "center"}}>
                                <div className="power-box" >
                                    <PowerDC ioTopic="motor2DCData" valKey="power2"/>
                                    <div className="trend-button pow"
                                        onClick={this.onAddTrend}>
                                        <i className="fas fa-chart-line pow"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                <div className="otime-box">
                                    <OperatingTime ioTopic={["motor2Status", "motor2OTime"]} />
                                    <div className="stop-all-trend" 
                                    onClick={this.onPauseAllTrend}
                                    >Pause all <i className="fas fa-chart-line"></i></div>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Container>

                <Container className="motor-1-tc" style={{ height: "100%" }}>
                    <Row style={{ marginBottom: "1em" }}>
                        <Col md="6">
                            <div className={curState}>
                                <button className="exit-button cur"
                                    onClick={this.onDeleteTrend}>&times;</button>
                                <CurrentTC ioTopic="motor2TCAmp" 
                                 stopFlag="amp2StopFlag"
                                 reviewFlag="amp2ReviewFlag"
                                 forwFlag="amp2ForwFlag"
                                 reviewData="reviewAmp2"
                                 allPauseState={isPauseAllTrend}/>
                            </div>
                        </Col>
                        <Col md="6">
                            <div className={torState}>
                                <button className="exit-button tor"
                                    onClick={this.onDeleteTrend}>&times;</button>
                                <TorqueTC ioTopic="motor2TCTor" 
                                 stopFlag="tor2StopFlag"
                                 reviewFlag="tor2ReviewFlag"
                                 forwFlag="tor2ForwFlag"
                                 reviewData="reviewTor2"
                                 allPauseState={isPauseAllTrend}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "1em" }}>
                        <Col md="6">
                            <div className={motorTState}>
                                <button className="exit-button motorT"
                                    onClick={this.onDeleteTrend}>&times;</button>
                                <MotorTempTC ioTopic="motor2TCMotorT" 
                                stopFlag="motor2TStopFlag"
                                reviewFlag="motor2TReviewFlag"
                                forwFlag="motor2TForwFlag"
                                reviewData="reviewMotor2T"
                                allPauseState={isPauseAllTrend}/>
                            </div>
                        </Col>
                        <Col md="6">
                            <div className={driveTState}>
                                <button className="exit-button driveT"
                                    onClick={this.onDeleteTrend}>&times;</button>
                                <DriveTempTC ioTopic="motor2TCDriveT" 
                                 stopFlag="drive2TStopFlag"
                                 reviewFlag="drive2TReviewFlag"
                                 forwFlag="drive2TForwFlag"
                                 reviewData="reviewDrive2T"
                                 allPauseState={isPauseAllTrend}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                        <Col md="6">
                            <div className={powerState}>
                                <button className="exit-button pow"
                                    onClick={this.onDeleteTrend}>&times;</button>
                                <PowerTC ioTopic="motor2TCPower" 
                                 stopFlag="power2StopFlag"
                                 reviewFlag="power2ReviewFlag"
                                 forwFlag="power2ForwFlag"
                                 reviewData="reviewPower2"
                                 allPauseState={isPauseAllTrend}/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
