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
import "../CSS/MonitorPageStyle.css";

export default class Motor1Page extends Component {
    state = {
        isHideTor: false,
        isHideCur: false,
        isHideMotorT: false,
        isHideDriveT: false,
        isHidePower: false
    }
    onDeleteCur = () => {
        if (this.state.isHideCur) {
            this.setState({
                isHideCur: !this.state.isHideCur
            })
        }
    }
    onAddCur = () => {
        if (!this.state.isHideCur) {
            this.setState({
                isHideCur: !this.state.isHideCur
            })
        }
    }
    onDeleteTor = () => {
        if (this.state.isHideTor) {
            this.setState({
                isHideTor: !this.state.isHideTor
            })
        }
    }
    onAddTor = () => {
        if (!this.state.isHideTor) {
            this.setState({
                isHideTor: !this.state.isHideTor
            })
        }
    }
    onDeleteMotorT = () => {
        if (this.state.isHideMotorT) {
            this.setState({
                isHideMotorT: !this.state.isHideMotorT
            })
        }
    }
    onAddMotorT = () => {
        if (!this.state.isHideMotorT) {
            this.setState({
                isHideMotorT: !this.state.isHideMotorT
            })
        }
    }
    onDeleteDriveT = () => {
        if (this.state.isHideDriveT) {
            this.setState({
                isHideDriveT: !this.state.isHideDriveT
            })
        }
    }
    onAddDriveT = () => {
        if (!this.state.isHideDriveT) {
            this.setState({
                isHideDriveT: !this.state.isHideDriveT
            })
        }
    }
    onDeletePower = () => {
        if (this.state.isHidePower) {
            this.setState({
                isHidePower: !this.state.isHidePower
            })
        }
    }
    onAddPower = () => {
        if (!this.state.isHidePower) {
            this.setState({
                isHidePower: !this.state.isHidePower
            })
        }
    }
    render() {
        let { isHideCur, isHideDriveT, isHideMotorT, isHidePower, isHideTor } = this.state;
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
                                <img src="https://via.placeholder.com/150" alt=""></img>
                            </div>
                        </Col>
                        <Col md="6" className="rightside">
                            <Row className="current-and-torque">
                                <div className="current-box" >
                                    <CurrentDC ioTopic="motor1DCData" />
                                    <div className="trend-button"
                                        onClick={this.onAddCur}>
                                        <i className="fas fa-chart-line"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                <div className="torque-box">
                                    <TorqueDC ioTopic="motor1DCData" />
                                    <div className="trend-button"
                                        onClick={this.onAddTor}>
                                        <i className="fas fa-chart-line"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                            </Row>
                            <Row className="thermal">
                                <div className="motorT-box" >
                                    <MotorTempDC ioTopic="motor1DCData" />
                                    <div className="trend-button"
                                        onClick={this.onAddMotorT}>
                                        <i className="fas fa-chart-line"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                <div className="driveT-box">
                                    <DriveTempDC ioTopic="motor1DCData" />
                                    <div className="trend-button"
                                        onClick={this.onAddDriveT}>
                                        <i className="fas fa-chart-line"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                            </Row>
                            <Row className="otime-and-setting">
                                <div className="power-box" >
                                    <PowerDC ioTopic="motor1DCData" />
                                    <div className="trend-button"
                                        onClick={this.onAddPower}>
                                        <i className="fas fa-chart-line"
                                            style={{
                                                margin: "0 auto",
                                                fontSize: "1.5em"
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                <div>
                                    <OperatingTime ioTopic={["motor1Status", "motor1OTime"]} />
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Container>

                <Container className="motor-1-tc" style={{ height: "100%" }}>
                    <Row style={{ marginBottom: "1em" }}>
                        <Col md="6">
                            <div className={curState}>
                                <button className="exit-button"
                                    onClick={this.onDeleteCur}>&times;</button>
                                <CurrentTC ioTopic="motor1TCAmp" />
                            </div>
                        </Col>
                        <Col md="6">
                            <div className={torState}>
                                <button className="exit-button"
                                    onClick={this.onDeleteTor}>&times;</button>
                                <TorqueTC ioTopic="motor1TCTor" />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "1em" }}>
                        <Col md="6">
                            <div className={motorTState}>
                                <button className="exit-button"
                                    onClick={this.onDeleteMotorT}>&times;</button>
                                <MotorTempTC ioTopic="motor1TCMotorT" />
                            </div>
                        </Col>
                        <Col md="6">
                            <div className={driveTState}>
                                <button className="exit-button"
                                    onClick={this.onDeleteDriveT}>&times;</button>
                                <DriveTempTC ioTopic="motor1TCDriveT" />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                        <Col md="6">
                            <div className={powerState}>
                                <button className="exit-button"
                                    onClick={this.onDeletePower}>&times;</button>
                                <PowerTC ioTopic="motor1TCPower" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
