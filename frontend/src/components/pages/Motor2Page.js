import React, { Component } from 'react'
import {
    Container,
    Row,
    Col
} from "reactstrap";
import classNames from "classnames";
import axios from "axios";

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
let maxscale1 = [{ val: null, bs: false, ss: false }, { val: null, bs: false, ss: false },
    { val: null, bs: false, ss: false }, { val: null, bs: false, ss: false },
    { val: null, bs: false, ss: false }];

export default class Motor2Page extends Component {
    state = {
        isHideTor: false,
        isHideCur: false,
        isHideMotorT: false,
        isHideDriveT: false,
        isHidePower: false,
        isPauseAllTrend: false,
        isCurAdj: false,
        isTorAdj: false,
        isMotorTAdj: false,
        isDriveTAdj: false,
        isPowerAdj: false,
        bsCur: false,
        bsTor: false,
        bsMotorT: false,
        bsDriveT: false,
        bsPow: false,
        ssCur: false,
        ssTor: false,
        ssMotorT: false,
        ssDriveT: false,
        ssPow: false,
        textcur: '',
        texttor: '',
        textmotorT: '',
        textdriveT: '',
        textpow: '',
        textcurM: '',
        texttorM: '',
        textmotorTM: '',
        textdriveTM: '',
        textpowM: '',
        maxcur: '100',
        maxtor: '100',
        maxmotorT: '100',
        maxdriveT: '100',
        maxpow: '100',
        curpos: '126,86 136,80 136,92',
        torpos: '126,86 136,80 136,92',
        motorTpos: '126,86 136,80 136,92',
        driveTpos: '126,86 136,80 136,92',
        powpos: '126,86 136,80 136,92'
    }
    getHandler = () => {
        axios.get('/api/maxscale1/2').then(res => {
            maxscale1 = res.data.maxscale1;
            this.setState({
                maxcur: maxscale1[0].val,
                maxtor: maxscale1[1].val,
                maxmotorT: maxscale1[2].val,
                maxdriveT: maxscale1[3].val,
                maxpow: maxscale1[4].val,
                bsCur: maxscale1[0].bs,
                bsTor: maxscale1[1].bs,
                bsMotorT: maxscale1[2].bs,
                bsDriveT: maxscale1[3].bs,
                bsPow: maxscale1[4].bs,
                ssCur: maxscale1[0].ss,
                ssTor: maxscale1[1].ss,
                ssMotorT: maxscale1[2].ss,
                ssDriveT: maxscale1[3].ss,
                ssPow: maxscale1[4].ss,
            })
        }).catch(err => console.log(err));
    }
    putHandler = (maxscale1, config) => {
        axios.put('/api/maxscale1/2', { maxscale1 }, config)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
    componentDidMount() {
        this.getHandler();
    }
    componentDidUpdate() {
        this.getHandler();
    }
    onDeleteTrend = (e) => {
        let eclass = e.target.className;
        if (eclass === "exit-button cur") {
            if (this.state.isHideCur) {
                this.setState({
                    isHideCur: !this.state.isHideCur
                })
            }
        }
        if (eclass === "exit-button tor") {
            if (this.state.isHideTor) {
                this.setState({
                    isHideTor: !this.state.isHideTor
                })
            }
        }
        if (eclass === "exit-button motorT") {
            if (this.state.isHideMotorT) {
                this.setState({
                    isHideMotorT: !this.state.isHideMotorT
                })
            }
        }
        if (eclass === "exit-button driveT") {
            if (this.state.isHideDriveT) {
                this.setState({
                    isHideDriveT: !this.state.isHideDriveT
                })
            }
        }
        if (eclass === "exit-button pow") {
            if (this.state.isHidePower) {
                this.setState({
                    isHidePower: !this.state.isHidePower
                })
            }
        }
    }
    onAddTrend = (e) => {
        let eclass = e.target.className;
        if (eclass === "trend-button cur" || eclass === "fas fa-chart-line cur") {
            if (!this.state.isHideCur) {
                this.setState({
                    isHideCur: !this.state.isHideCur
                })
            }
        }
        if (eclass === "trend-button tor" || eclass === "fas fa-chart-line tor") {
            if (!this.state.isHideTor) {
                this.setState({
                    isHideTor: !this.state.isHideTor
                })
            }
        }
        if (eclass === "trend-button motorT" || eclass === "fas fa-chart-line motorT") {
            if (!this.state.isHideMotorT) {
                this.setState({
                    isHideMotorT: !this.state.isHideMotorT
                })
            }
        }
        if (eclass === "trend-button driveT" || eclass === "fas fa-chart-line driveT") {
            if (!this.state.isHideDriveT) {
                this.setState({
                    isHideDriveT: !this.state.isHideDriveT
                })
            }
        }
        if (eclass === "trend-button pow" || eclass === "fas fa-chart-line pow") {
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
    onAdjustTriClick = (e) => {
        let eid = e.target.id;
        if (eid === "currentDC2") {
            this.setState({
                isCurAdj: !this.state.isCurAdj
            })
        }
        else if (eid === "torqueDC2") {
            this.setState({
                isTorAdj: !this.state.isTorAdj
            })
        }
        else if (eid === "motorTDC2") {
            this.setState({
                isMotorTAdj: !this.state.isMotorTAdj
            })
        }
        else if (eid === "driveTDC2") {
            this.setState({
                isDriveTAdj: !this.state.isDriveTAdj
            })
        }
        else if (eid === "powerDC2") {
            this.setState({
                isPowerAdj: !this.state.isPowerAdj
            })
        }
    };
    onChange(e, maxScale) {
        let eid = e.target.id;
        if (parseInt(e.target.value) > maxScale) {
            e.target.value = maxScale.toString();
        }
        if (e.target.value.length > 4) {
            let newS = e.target.value.slice(0, 4);
            e.target.value = newS;
        }
        if (eid === "curset") {
            this.setState({
                textcur: e.target.value
            })
        }
        else if (eid === "torset") {
            this.setState({
                texttor: e.target.value
            })
        }
        else if (eid === "motorTset") {
            this.setState({
                textmotorT: e.target.value
            })
        }
        else if (eid === "driveTset") {
            this.setState({
                textdriveT: e.target.value
            })
        }
        else if (eid === "powset") {
            this.setState({
                textpow: e.target.value
            })
        }
    }
    onChange2 = (e) => {
        let eid = e.target.id;
        if (e.target.value > 10000) {
            e.target.value = '9999';
        }
        if (e.target.value.length > 4) {
            let newS = e.target.value.slice(0, 4);
            e.target.value = newS;
        }

        if (eid === "curmax") {

            this.setState({
                textcurM: e.target.value
            })
        }
        else if (eid === "tormax") {

            this.setState({
                texttorM: e.target.value
            })
        }
        else if (eid === "motorTmax") {

            this.setState({
                textmotorTM: e.target.value
            })
        }
        else if (eid === "driveTmax") {

            this.setState({
                textdriveTM: e.target.value
            })
        }
        else if (eid === "powmax") {

            this.setState({
                textpowM: e.target.value
            })
        }
    }
    onKeyUp = (e, maxScale) => {
        let text = e.target.value;
        let eid = e.target.id;
        if (e.keyCode === 13) {
            if (!text) { return; };
            let R = 66;
            let r = 56;
            let center = 70;
            let setVal = maxScale - parseInt(text);
            let alpha = ((180 / maxScale) * setVal) * (Math.PI / 180);
            let beta = Math.atan(6 / 66);
            let x = center + r * Math.cos(alpha);
            let y = 86 - r * Math.sin(alpha);
            let xd = center + R * Math.cos(alpha + beta);
            let xt = center + R * Math.cos(alpha - beta);
            let yd = 86 - R * Math.sin(alpha + beta);
            let yt = 86 - R * Math.sin(alpha - beta);
            let positionStr = `${x},${y} ${xt},${yt} ${xd},${yd}`;
            if (eid === "curset") {
                this.setState({
                    curpos: positionStr
                })
                this.setState(() => ({
                    textcur: ""
                }))
            }
            else if (eid === "torset") {
                this.setState({
                    torpos: positionStr
                })
                this.setState(() => ({
                    texttor: ""
                }))
            }
            else if (eid === "motorTset") {
                this.setState({
                    motorTpos: positionStr
                })
                this.setState(() => ({
                    textmotorT: ""
                }))
            }
            else if (eid === "driveTset") {
                this.setState({
                    driveTpos: positionStr
                })
                this.setState(() => ({
                    textdriveT: ""
                }))
            }
            else if (eid === "powset") {
                this.setState({
                    powpos: positionStr
                })
                this.setState(() => ({
                    textpow: ""
                }))
            }

        }
    };
    onKeyUp2 = (e) => {
        let eid = e.target.id;
        let text = e.target.value;
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        if (e.keyCode === 13) {
            if (!text) { return; };
            if (eid === "curmax") {
                if (e.target.value.length > 3) {
                    maxscale1[0].bs = true;
                    maxscale1[0].ss = false;
                }
                else if (e.target.value.length < 3) {
                    maxscale1[0].bs = false;
                    maxscale1[0].ss = true;
                }
                else {
                    maxscale1[0].bs = false;
                    maxscale1[0].ss = false;
                }
                maxscale1[0].val = text;
                this.putHandler(maxscale1, config);
                this.setState(() => ({
                    textcurM: ""
                }))
            }
            else if (eid === "tormax") {
                if (e.target.value.length > 3) {
                    maxscale1[1].bs = true;
                    maxscale1[1].ss = false;
                }
                else if (e.target.value.length < 3) {
                    maxscale1[1].bs = false;
                    maxscale1[1].ss = true;
                }
                else {
                    maxscale1[1].bs = false;
                    maxscale1[1].ss = false;
                }
                maxscale1[1].val = text;
                this.putHandler(maxscale1, config);
                this.setState(() => ({
                    texttorM: ""
                }))
            }
            else if (eid === "motorTmax") {
                if (e.target.value.length > 3) {
                    maxscale1[2].bs = true;
                    maxscale1[2].ss = false;
                }
                else if (e.target.value.length < 3) {
                    maxscale1[2].bs = false;
                    maxscale1[2].ss = true;
                }
                else {
                    maxscale1[2].bs = false;
                    maxscale1[2].ss = false;
                }
                maxscale1[2].val = text;
                this.putHandler(maxscale1, config);
                this.setState(() => ({
                    textmotorTM: ""
                }))
            }
            else if (eid === "driveTmax") {
                if (e.target.value.length > 3) {
                    maxscale1[3].bs = true;
                    maxscale1[3].ss = false;
                }
                else if (e.target.value.length < 3) {
                    maxscale1[3].bs = false;
                    maxscale1[3].ss = true;
                }
                else {
                    maxscale1[3].bs = false;
                    maxscale1[3].ss = false;
                }
                maxscale1[3].val = text;
                this.putHandler(maxscale1, config);
                this.setState(() => ({
                    textdriveTM: ""
                }))
            }
            else if (eid === "powmax") {
                if (e.target.value.length > 3) {
                    maxscale1[4].bs = true;
                    maxscale1[4].ss = false;
                }
                else if (e.target.value.length < 3) {
                    maxscale1[4].bs = false;
                    maxscale1[4].ss = true;
                }
                else {
                    maxscale1[4].bs = false;
                    maxscale1[4].ss = false;
                }
                maxscale1[4].val = text;
                this.putHandler(maxscale1, config);
                this.setState(() => ({
                    textpowM: ""
                }))
            }
        }
    }
    render() {
        let { isHideCur, isHideDriveT, isHideMotorT, isHidePower, isHideTor, isPauseAllTrend,
            isCurAdj, isTorAdj, isMotorTAdj, isDriveTAdj, isPowerAdj, curpos, torpos, motorTpos, driveTpos, powpos,
            maxcur, maxtor, maxmotorT, maxdriveT, maxpow, bsCur, bsTor, bsMotorT, bsDriveT, bsPow,
            ssCur, ssTor, ssMotorT, ssDriveT, ssPow } = this.state;
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
                <Container className="motor-dc" style={{ marginBottom: "1em" }}>
                    <Row>
                        <Col md="6" className="leftside">
                            <div className="page-button">
                                <a href="/monitor/1" alt="">1</a>
                                <a href="/monitor/2" alt="">2</a>
                            </div>
                            <div className="motor-1-pic">
                                <img className="motor-image" src={MotorPic} alt="" />
                            </div>
                            <WarnPanel reqId={2}/>
                        </Col>
                        <Col md="6" className="rightside" >
                            <Row className="current-and-torque" style={{ justifyContent: "center" }}>
                                <div className="current-box" >
                                    {isCurAdj && <div className="dc-tribtn-adjust"
                                        style={{ border: "2px solid #d0ed57" }}>
                                        <div>Max Value:</div>
                                        <input type="number"
                                            id="curmax"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textcurM}
                                            onChange={this.onChange2}
                                            onKeyUp={this.onKeyUp2} />
                                        <div>Threshold:</div>
                                        <input type="number"
                                            id="curset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textcur}
                                            onChange={(e) => this.onChange(e, maxcur)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxcur)} />

                                    </div>}
                                    <CurrentDC ioTopic="motor2DCData"
                                        valKey="amp2"
                                        id="currentDC2"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={curpos}
                                        maxScale={maxcur}
                                        sSize={bsCur}
                                        ssSize={ssCur} />
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
                                    {isTorAdj && <div className="dc-tribtn-adjust"
                                        style={{ border: "2px solid #a8e063" }}>
                                        <div>Max Value:</div>
                                        <input type="number"
                                            id="tormax"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.texttorM}
                                            onChange={this.onChange2}
                                            onKeyUp={this.onKeyUp2} />
                                        <div>Threshold:</div>
                                        <input type="number"
                                            id="torset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.texttor}
                                            onChange={(e) => this.onChange(e, maxtor)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxtor)} />
                                    </div>}
                                    <TorqueDC ioTopic="motor2DCData"
                                        valKey="tor2"
                                        id="torqueDC2"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={torpos}
                                        maxScale={maxtor}
                                        sSize={bsTor}
                                        ssSize={ssTor} />
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
                            <Row className="thermal" style={{ justifyContent: "center" }}>
                                <div className="motorT-box" >
                                    {isMotorTAdj && <div className="dc-tribtn-adjust"
                                        style={{ border: "2px solid #fd1d1d" }}>
                                        <div>Max Value:</div>
                                        <input type="number"
                                            id="motorTmax"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textmotorTM}
                                            onChange={this.onChange2}
                                            onKeyUp={this.onKeyUp2} />
                                        <div>Threshold:</div>
                                        <input type="number"
                                            id="motorTset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textmotorT}
                                            onChange={(e) => this.onChange(e, maxmotorT)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxmotorT)} />
                                    </div>}
                                    <MotorTempDC ioTopic="motor2DCData"
                                        valKey="motor2T"
                                        id="motorTDC2"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={motorTpos}
                                        maxScale={maxmotorT}
                                        sSize={bsMotorT}
                                        ssSize={ssMotorT} />
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
                                    {isDriveTAdj && <div className="dc-tribtn-adjust"
                                        style={{ border: "2px solid #fd1d1d" }}>
                                        <div>Max Value:</div>
                                        <input type="number"
                                            id="driveTmax"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textdriveTM}
                                            onChange={this.onChange2}
                                            onKeyUp={this.onKeyUp2} />
                                        <div>Threshold:</div>
                                        <input type="number"
                                            id="driveTset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textdriveT}
                                            onChange={(e) => this.onChange(e, maxdriveT)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxdriveT)} />
                                    </div>}
                                    <DriveTempDC ioTopic="motor2DCData"
                                        valKey="drive2T"
                                        id="driveTDC2"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={driveTpos}
                                        maxScale={maxdriveT}
                                        sSize={bsDriveT}
                                        ssSize={ssDriveT} />
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
                            <Row className="otime-and-setting" style={{ justifyContent: "center" }}>
                                <div className="power-box" >
                                    {isPowerAdj && <div className="dc-tribtn-adjust"
                                        style={{ border: "2px solid #8fd3f4" }}>
                                        <div>Max Value:</div>
                                        <input type="number"
                                            id="powmax"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textpowM}
                                            onChange={this.onChange2}
                                            onKeyUp={this.onKeyUp2} />
                                        <div>Threshold:</div>
                                        <input type="number"
                                            id="powset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textpow}
                                            onChange={(e) => this.onChange(e, maxpow)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxpow)} />
                                    </div>}
                                    <PowerDC ioTopic="motor2DCData"
                                        valKey="power2"
                                        id="powerDC2"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={powpos}
                                        maxScale={maxpow}
                                        sSize={bsPow}
                                        ssSize={ssPow} />
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
                                    allPauseState={isPauseAllTrend} />
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
                                    allPauseState={isPauseAllTrend} />
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
                                    allPauseState={isPauseAllTrend} />
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
                                    allPauseState={isPauseAllTrend} />
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
                                    allPauseState={isPauseAllTrend} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
