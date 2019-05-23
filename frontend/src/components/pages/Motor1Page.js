import React, { Component } from 'react'
import {
    Container,
    Row,
    Col
} from "reactstrap";
import classNames from "classnames";
import axios from "axios";
import io from 'socket.io-client';

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

const config = {
    headers: {
        "Content-type": "application/json"
    }
}
export default class Motor1Page extends Component {
    constructor(props) {
        super(props);
        this.maxscale1 = [{ val: "100", fault: "0", warn: "0", pos: '126,86 136,80 136,92', bs: false, ss: false }, 
        { val: "100", fault: "0", warn: "0", pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: "0", warn: "0", pos: '126,86 136,80 136,92', bs: false, ss: false }, 
        { val: "100", fault: "0", warn: "0", pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: "0", warn: "0", pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: "0", warn: "0", pos: '126,86 136,80 136,92', bs: false, ss: false }];
        this.onAdjustTriClick = this.onAdjustTriClick.bind(this);

    }
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
        emer: false,
        textcur: '',
        texttor: '',
        textmotorT: '',
        textdriveT: '',
        textpow: '',
        textcur1: '',
        texttor1: '',
        textmotorT1: '',
        textdriveT1: '',
        textpow1: '',
        textcurM: '',
        texttorM: '',
        textmotorTM: '',
        textdriveTM: '',
        textpowM: '',
        fCurLvl: '',
        fTorLvl: '',
        fMotorTLvl: '',
        fDriveTLvl: '',
        fPowLvl: '',
        wCurLvl: '',
        wTorLvl: '',
        wMotorTLvl: '',
        wDriveTLvl: '',
        wPowLvl: '',
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
        axios.get('/api/maxscale1/1').then(res => {
            this.maxscale1 = res.data.maxscale1;
            this.setState({
                maxcur: this.maxscale1[0].val,
                maxtor: this.maxscale1[1].val,
                maxmotorT: this.maxscale1[2].val,
                maxdriveT: this.maxscale1[3].val,
                maxpow: this.maxscale1[4].val,
                bsCur: this.maxscale1[0].bs,
                bsTor: this.maxscale1[1].bs,
                bsMotorT: this.maxscale1[2].bs,
                bsDriveT: this.maxscale1[3].bs,
                bsPow: this.maxscale1[4].bs,
                ssCur: this.maxscale1[0].ss,
                ssTor: this.maxscale1[1].ss,
                ssMotorT: this.maxscale1[2].ss,
                ssDriveT: this.maxscale1[3].ss,
                ssPow: this.maxscale1[4].ss,
                curpos: this.maxscale1[0].pos,
                fCurLvl: this.maxscale1[0].fault,
                wCurLvl: this.maxscale1[0].warn,
                torpos: this.maxscale1[1].pos,
                fTorLvl: this.maxscale1[1].fault,
                wTorLvl: this.maxscale1[1].warn,
                motorTpos: this.maxscale1[2].pos,
                fMotorTLvl: this.maxscale1[2].fault,
                wMotorTLvl: this.maxscale1[2].warn,
                driveTpos: this.maxscale1[3].pos,
                fDriveTLvl: this.maxscale1[3].fault,
                wDriveTLvl: this.maxscale1[3].warn,
                powpos: this.maxscale1[4].pos,
                fPowLvl: this.maxscale1[4].fault,
                wPowLvl: this.maxscale1[4].warn,
            })
        }).catch(err => console.log(err));
    }
    putHandler = (maxscale1, config) => {
        axios.put('/api/maxscale1/1', { maxscale1 }, config)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
    componentDidMount() {
        this.getHandler();
        this.socket = io();
        this.socket.on("motorStatus", function (statusObj) {
            
            this.setState({
                emer: statusObj.emer
            })
        }.bind(this))
    }
    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function (error) {
          console.log(error);
          this.socket.disconnect();
        })
    };
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
    onAdjustTriClick(e) {
        let eid = e.target.id;
        if (eid === "currentDC1") {
            this.setState({
                isCurAdj: !this.state.isCurAdj
            })
        }
        else if (eid === "torqueDC1") {
            this.setState({
                isTorAdj: !this.state.isTorAdj
            })
        }
        else if (eid === "motorTDC1") {
            this.setState({
                isMotorTAdj: !this.state.isMotorTAdj
            })
        }
        else if (eid === "driveTDC1") {
            this.setState({
                isDriveTAdj: !this.state.isDriveTAdj
            })
        }
        else if (eid === "powerDC1") {
            this.setState({
                isPowerAdj: !this.state.isPowerAdj
            })
        }
    };
    onChange(e, maxScale) {
        let eid = e.target.id;
        if (parseFloat(e.target.value) > maxScale) {
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
    onChange3(e, maxScale) {                                                        /**/
        let eid = e.target.id;
        if (parseFloat(e.target.value) > maxScale) {
            e.target.value = maxScale.toString();
        }
        if (e.target.value.length > 4) {
            let newS = e.target.value.slice(0, 4);
            e.target.value = newS;
        }
        if (eid === "curset1") {
            this.setState({
                textcur1: e.target.value
            })
        }
        else if (eid === "torset1") {
            this.setState({
                texttor1: e.target.value
            })
        }
        else if (eid === "motorTset1") {
            this.setState({
                textmotorT1: e.target.value
            })
        }
        else if (eid === "driveTset1") {
            this.setState({
                textdriveT1: e.target.value
            })
        }
        else if (eid === "powset1") {
            this.setState({
                textpow1: e.target.value
            })
        }
    }
    onKeyUp = (e, maxScale) => {                                                         /**/
        let text = e.target.value;
        let eid = e.target.id;
        if (e.keyCode === 13) {
            if (!text) { return; };
            let R = 66;
            let r = 56;
            let center = 70;
            let setVal = maxScale - parseFloat(text);
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
                this.maxscale1[0].pos = positionStr;
                this.maxscale1[0].fault = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textcur: ""
                }))
            }
            else if (eid === "torset") {
                this.maxscale1[1].pos = positionStr;
                this.maxscale1[1].fault = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    texttor: ""
                }))
            }
            else if (eid === "motorTset") {
                this.maxscale1[2].pos = positionStr;
                this.maxscale1[2].fault = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textmotorT: ""
                }))
            }
            else if (eid === "driveTset") {
                this.maxscale1[3].pos = positionStr;
                this.maxscale1[3].fault = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textdriveT: ""
                }))
            }
            else if (eid === "powset") {
                this.maxscale1[4].pos = positionStr;
                this.maxscale1[4].fault = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textpow: ""
                }))
            }

        }
    };
    onKeyUp2 = (e) => {
        let eid = e.target.id;
        let text = e.target.value;
        if (e.keyCode === 13) {
            if (!text) { return; };
            if (eid === "curmax") {
                if (e.target.value < 10) {
                    this.maxscale1[0].bs = true;
                    this.maxscale1[0].ss = false;
                }
                else if (e.target.value > 999) {
                    this.maxscale1[0].bs = false;
                    this.maxscale1[0].ss = true;
                }
                else {
                    this.maxscale1[0].bs = false;
                    this.maxscale1[0].ss = false;
                }
                this.maxscale1[0].val = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textcurM: ""
                }))
            }
            else if (eid === "tormax") {
                console.log(e.target.value);
               if (e.target.value < 10) {
                    this.maxscale1[1].bs = true;
                    this.maxscale1[1].ss = false;
                }
                else if (e.target.value > 999) {
                    this.maxscale1[1].bs = false;
                    this.maxscale1[1].ss = true;
                }
                else {
                    this.maxscale1[1].bs = false;
                    this.maxscale1[1].ss = false;
                }
                this.maxscale1[1].val = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    texttorM: ""
                }))
            }
            else if (eid === "motorTmax") {
                if (e.target.value < 10) {
                    this.maxscale1[2].bs = true;
                    this.maxscale1[2].ss = false;
                }
                else if (e.target.value > 999) {
                    this.maxscale1[2].bs = false;
                    this.maxscale1[2].ss = true;
                }
                else {
                    this.maxscale1[2].bs = false;
                    this.maxscale1[2].ss = false;
                }
                this.maxscale1[2].val = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textmotorTM: ""
                }))
            }
            else if (eid === "driveTmax") {
                if (e.target.value < 10) {
                    this.maxscale1[3].bs = true;
                    this.maxscale1[3].ss = false;
                }
                else if (e.target.value > 999) {
                    this.maxscale1[3].bs = false;
                    this.maxscale1[3].ss = true;
                }
                else {
                    this.maxscale1[3].bs = false;
                    this.maxscale1[3].ss = false;
                }
                this.maxscale1[3].val = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textdriveTM: ""
                }))
            }
            else if (eid === "powmax") {
                if (e.target.value < 10) {
                    this.maxscale1[4].bs = true;
                    this.maxscale1[4].ss = false;
                }
                else if (e.target.value > 999) {
                    this.maxscale1[4].bs = false;
                    this.maxscale1[4].ss = true;
                }
                else {
                    this.maxscale1[4].bs = false;
                    this.maxscale1[4].ss = false;
                }
                this.maxscale1[4].val = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textpowM: ""
                }))
            }
        }
    }
    onKeyUp3 = (e) => {
        let eid = e.target.id;
        let text = e.target.value;
        if (e.keyCode === 13) {
            if (!text) { return; };
            if (eid === "curset1") {
                this.maxscale1[0].warn = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textcur1: ""
                }))
            }
            else if (eid === "torset1") {
                this.maxscale1[1].warn = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    texttor1: ""
                }))
            }
            else if (eid === "motorTset1") {
                this.maxscale1[2].warn = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textmotorT1: ""
                }))
            }
            else if (eid === "driveTset1") {
                this.maxscale1[3].warn = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textdriveT1: ""
                }))
            }
            else if (eid === "powset1") {
                this.maxscale1[4].warn = text;
                this.putHandler(this.maxscale1, config);
                this.getHandler();
                this.setState(() => ({
                    textpow1: ""
                }))
            }

        }
    }
    render() {
        let { isHideCur, isHideDriveT, isHideMotorT, isHidePower, isHideTor, isPauseAllTrend,
            isCurAdj, isTorAdj, isMotorTAdj, isDriveTAdj, isPowerAdj, curpos, torpos, motorTpos, driveTpos, 
            powpos, maxcur, maxtor, maxmotorT, maxdriveT, maxpow, bsCur, bsTor, bsMotorT, bsDriveT, bsPow,
            ssCur, ssTor, ssMotorT, ssDriveT, ssPow, fCurLvl, fTorLvl, fMotorTLvl, fDriveTLvl, fPowLvl, wCurLvl, 
            wTorLvl, wMotorTLvl, wDriveTLvl, wPowLvl, emer} = this.state;
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
        let emrg = classNames({
            "emrg": emer
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
                                <div><img className="motor-image" src={MotorPic} alt="" /></div>
                                <div className={emrg}><i className="fas fa-radiation-alt"></i></div>
                            </div>
                            <WarnPanel ioTopic="warnList1" reqId={1} />
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
                                        <div>Fault level:</div>
                                        <input type="number"
                                            id="curset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textcur}
                                            onChange={(e) => this.onChange(e, maxcur)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxcur)} />
                                        <div>Warn level:</div>
                                        <input type="number"
                                            id="curset1"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textcur1}
                                            onChange={(e) => this.onChange3(e, fCurLvl)}
                                            onKeyUp={this.onKeyUp3} />

                                    </div>}
                                    <CurrentDC ioTopic="motor1DCData1"
                                        valKey="Cur0"
                                        id="currentDC1"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={curpos}
                                        maxScale={maxcur}
                                        bSize={bsCur}
                                        sSize={ssCur}
                                        faultLvl={fCurLvl}
                                        warnLvl={wCurLvl}
                                    />
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
                                <div className="torque-box" >
                                    {isTorAdj && <div className="dc-tribtn-adjust"
                                        style={{ border: "2px solid #a8e063" }}>
                                        <div>Max Value:</div>
                                        <input type="number"
                                            id="tormax"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.texttorM}
                                            onChange={this.onChange2}
                                            onKeyUp={this.onKeyUp2} />
                                        <div>Fault level:</div>
                                        <input type="number"
                                            id="torset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.texttor}
                                            onChange={(e) => this.onChange(e, maxtor)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxtor)} />
                                        <div>Warn level:</div>
                                        <input type="number"
                                            id="torset1"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.texttor1}
                                            onChange={(e) => this.onChange3(e, fTorLvl)}
                                            onKeyUp={this.onKeyUp3} />
                                    </div>}
                                    <TorqueDC ioTopic="motor1DCData1"
                                        valKey="Tor0"
                                        id="torqueDC1"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={torpos}
                                        maxScale={maxtor}
                                        bSize={bsTor}
                                        sSize={ssTor}
                                        faultLvl={fTorLvl}
                                        warnLvl={wTorLvl} />
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
                                        <div>Fault level:</div>
                                        <input type="number"
                                            id="motorTset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textmotorT}
                                            onChange={(e) => this.onChange(e, maxmotorT)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxmotorT)} />
                                        <div>Warn level:</div>
                                        <input type="number"
                                        id="motorTset1"
                                        className="dc-adjust-tribtn-input"
                                        value={this.state.textmotorT1}
                                        onChange={(e) => this.onChange3(e, fMotorTLvl)}
                                        onKeyUp={this.onKeyUp3} />
                                    </div>}
                                    <MotorTempDC ioTopic="motor1DCData2"
                                        valKey="ThM0"
                                        id="motorTDC1"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={motorTpos}
                                        maxScale={maxmotorT}
                                        bSize={bsMotorT}
                                        sSize={ssMotorT}
                                        faultLvl={fMotorTLvl}
                                        warnLvl={wMotorTLvl} />
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
                                        <div>Fault level:</div>
                                        <input type="number"
                                            id="driveTset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textdriveT}
                                            onChange={(e) => this.onChange(e, maxdriveT)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxdriveT)} />
                                        <div>Warn level:</div>
                                        <input type="number"
                                            id="driveTset1"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textdriveT1}
                                            onChange={(e) => this.onChange3(e, fDriveTLvl)}
                                            onKeyUp={this.onKeyUp3} />
                                    </div>}
                                    <DriveTempDC ioTopic="motor1DCData1"
                                        valKey="ThD0"
                                        id="driveTDC1"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={driveTpos}
                                        maxScale={maxdriveT}
                                        bSize={bsDriveT}
                                        sSize={ssDriveT}
                                        faultLvl={fDriveTLvl}
                                        warnLvl={wDriveTLvl} />
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
                                        <div>Fault level:</div>
                                        <input type="number"
                                            id="powset"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textpow}
                                            onChange={(e) => this.onChange(e, maxpow)}
                                            onKeyUp={(e) => this.onKeyUp(e, maxpow)} />
                                        <div>Warn level:</div>    
                                        <input type="number"
                                            id="powset1"
                                            className="dc-adjust-tribtn-input"
                                            value={this.state.textpow1}
                                            onChange={(e) => this.onChange3(e, fPowLvl)}
                                            onKeyUp={this.onKeyUp3} />
                                    </div>}
                                    <PowerDC ioTopic="motor1DCData1"
                                        valKey="Pow0"
                                        id="powerDC1"
                                        onAdjTriClick={this.onAdjustTriClick}
                                        triBtnPos={powpos}
                                        maxScale={maxpow}
                                        bSize={bsPow}
                                        sSize={ssPow}
                                        faultLvl={fPowLvl}
                                        warnLvl={wPowLvl} />
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
                                <div className="otime-box" style={{ width: "192px" }}>
                                    <OperatingTime ioTopic="motor1OTime" reqId={1}/>
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
                                <CurrentTC ioTopic="motor1TCAmp"
                                    stopFlag="amp1StopFlag"
                                    reviewFlag="amp1ReviewFlag"
                                    forwFlag="amp1ForwFlag"
                                    reviewData="reviewAmp1"
                                    allPauseState={isPauseAllTrend} />
                            </div>
                        </Col>
                        <Col md="6">
                            <div className={torState}>
                                <button className="exit-button tor"
                                    onClick={this.onDeleteTrend}>&times;</button>
                                <TorqueTC ioTopic="motor1TCTor"
                                    stopFlag="tor1StopFlag"
                                    reviewFlag="tor1ReviewFlag"
                                    forwFlag="tor1ForwFlag"
                                    reviewData="reviewTor1"
                                    allPauseState={isPauseAllTrend} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "1em" }}>
                        <Col md="6">
                            <div className={motorTState}>
                                <button className="exit-button motorT"
                                    onClick={this.onDeleteTrend}>&times;</button>
                                <MotorTempTC ioTopic="motor1TCMotorT"
                                    stopFlag="motor1TStopFlag"
                                    reviewFlag="motor1TReviewFlag"
                                    forwFlag="motor1TForwFlag"
                                    reviewData="reviewMotor1T"
                                    allPauseState={isPauseAllTrend} />
                            </div>
                        </Col>
                        <Col md="6">
                            <div className={driveTState}>
                                <button className="exit-button driveT"
                                    onClick={this.onDeleteTrend}>&times;</button>
                                <DriveTempTC ioTopic="motor1TCDriveT"
                                    stopFlag="drive1TStopFlag"
                                    reviewFlag="drive1TReviewFlag"
                                    forwFlag="drive1TForwFlag"
                                    reviewData="reviewDrive1T"
                                    allPauseState={isPauseAllTrend} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                        <Col md="6">
                            <div className={powerState}>
                                <button className="exit-button pow"
                                    onClick={this.onDeleteTrend}>&times;</button>
                                <PowerTC ioTopic="motor1TCPower"
                                    stopFlag="power1StopFlag"
                                    reviewFlag="power1ReviewFlag"
                                    forwFlag="power1ForwFlag"
                                    reviewData="reviewPower1"
                                    allPauseState={isPauseAllTrend} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
