import React, { Component } from 'react'
import { Col, Row, Progress } from 'reactstrap';
import io from 'socket.io-client';
import axios from 'axios';

import MotorPic from "../../images/motor.png";
import SpeedDC from "../charts/SpeedDC";
import MotorInfo from "../MotorInfo";
import TriangleBtn from "../TriangleBtn";
import HeightModal from "../HeightModal";
import FrequencyInput from "../FrequencyInput";
import NumberInput from "../NumberInput";
import EntryNotiPanel from "../EntryNotiPanel";
import "../CSS/ProgressStyle.css";
import "../CSS/EntryPageStyle.css";
let maxscale1 = [{ val: null, bs: false, ss: false }, { val: null, bs: false, ss: false },
{ val: null, bs: false, ss: false }, { val: null, bs: false, ss: false },
{ val: null, bs: false, ss: false }, { val: null, bs: false, ss: false }];
let maxscale2 = [{ val: null, bs: false, ss: false }, { val: null, bs: false, ss: false },
{ val: null, bs: false, ss: false }, { val: null, bs: false, ss: false },
{ val: null, bs: false, ss: false }, { val: null, bs: false, ss: false }];
export default class EntryPage extends Component {
    state = {
        isModal: false,
        info1: false,
        info2: false,
        isFre1Adj: false,
        isFre2Adj: false,
        isService: false,
        text: "", //pass to height modal
        textfre1: "",
        textfre2: "",
        textfre1M: "",
        textfre2M: "",
        maxfre1: "100",
        maxfre2: "100",
        mpamp1: null,
        mptor1: null,
        mpmotorT1: null,
        mpdriveT1: null,
        mppow1: null,
        mpamp2: null,
        mptor2: null,
        mpmotorT2: null,
        mpdriveT2: null,
        mppow2: null,
        pos1: '126,86 136,80 136,92',
        pos2: '126,86 136,80 136,92',
        Hvalue: 0 //pass to tri-btn
    }
    onOpenModal = () => {
        this.setState({
            isModal: !this.state.isModal
        })
    }
    //function pass to height modal
    onChange = (e) => {
        if (e.target.value > 15) {
            e.target.value = '15';
        }
        if (e.target.value.length > 4) {
            let newS = e.target.value.slice(0, 4);
            e.target.value = newS;
        }
        this.setState({
            text: e.target.value
        })
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

        if (eid === "fre1max") {

            this.setState({
                textfre1M: e.target.value
            })
        }
        else if (eid === "fre2max") {

            this.setState({
                textfre2M: e.target.value
            })
        }
    }
    onChange3(e, maxScale) {
        let eid = e.target.id;
        if (parseInt(e.target.value) > maxScale) {
            e.target.value = maxScale.toString();
        }
        if (e.target.value.length > 4) {
            let newS = e.target.value.slice(0, 4);
            e.target.value = newS;
        }
        if (eid === "fre1set") {
            this.setState({
                textfre1: e.target.value
            })
        }
        else if (eid === "fre2set") {
            this.setState({
                textfre2: e.target.value
            })
        }
    }
    onKeyUp = (e) => {
        let text = e.target.value;
        if (e.keyCode === 13) {
            if (!text) { return; };
            this.socket.emit("setHeight", this.state.text);
            this.setState(() => ({
                Hvalue: parseInt(text)
            }))
            this.setState(() => ({
                text: ""
            }))
        }
    };
    onKeyUp3 = (e, maxScale) => {
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
            if (eid === "fre1set") {
                this.setState({
                    pos1: positionStr
                })
                this.setState(() => ({
                    textfre1: ""
                }))
            }
            else if (eid === "fre2set") {
                this.setState({
                    pos2: positionStr
                })
                this.setState(() => ({
                    textfre2: ""
                }))
            }
        }
    }
    putHandler1 = (maxscale1, config) => {
        axios.put('/api/maxscale1/1', { maxscale1 }, config)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
    putHandler2 = (maxscale1, config) => {
        axios.put('/api/maxscale1/2', { maxscale1 }, config)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
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
            if (eid === "fre1max") {
                if (e.target.value.length > 3) {
                    maxscale1[5].bs = true;
                    maxscale1[5].ss = false;
                }
                else if (e.target.value.length < 3) {
                    maxscale1[5].bs = false;
                    maxscale1[5].ss = true;
                }
                else {
                    maxscale1[5].bs = false;
                    maxscale1[5].ss = false;
                }
                maxscale1[5].val = text;
                this.putHandler1(maxscale1, config);
                this.setState(() => ({
                    textfre1M: ""
                }))
            }
            else if (eid === "fre2max") {
                if (e.target.value.length > 3) {
                    maxscale1[5].bs = true;
                    maxscale1[5].ss = false;
                }
                else if (e.target.value.length < 3) {
                    maxscale1[5].bs = false;
                    maxscale1[5].ss = true;
                }
                else {
                    maxscale1[5].bs = false;
                    maxscale1[5].ss = false;
                }
                maxscale1[5].val = text;
                this.putHandler2(maxscale1, config);
                this.setState(() => ({
                    textfre2M: ""
                }))
            }
        }
    }
    onInfoPopup = (e) => {
        if (e.target.className === "motor-image for") {
            this.setState({
                info1: !this.state.info1
            })
        }
        if (e.target.className === "motor-image rev") {
            this.setState({
                info2: !this.state.info2
            })
        }
    }
    onAdjustTriClick = (e) => {
        let eid = e.target.id;
        if (eid === "fre1DC") {
            this.setState({
                isFre1Adj: !this.state.isFre1Adj
            })
        }
        else if (eid === "fre2DC") {
            this.setState({
                isFre2Adj: !this.state.isFre2Adj
            })
        }
    }
    getHandler = () => {
        axios.get("/api/maxscale1/1").then(res => {
            maxscale1 = res.data.maxscale1;
            this.setState({
                maxfre1: maxscale1[5].val,
                bsFre1: maxscale1[5].bs,
                ssFre1: maxscale1[5].ss
            });
        }).catch(err => console.log(err));
        axios.get("/api/maxscale1/2").then(res => {
            maxscale2 = res.data.maxscale1;
            this.setState({
                maxfre2: maxscale2[5].val,
                bsFre2: maxscale2[5].bs,
                ssFre2: maxscale2[5].ss
            });
        }).catch(err => console.log(err));
    }
    onForw = () => {
        this.socket.emit("vCmdToPLC", "onForward");
    }
    onStop = () => {
        this.socket.emit("vCmdToPLC", "onStop");
    }
    onRev = () => {
        this.socket.emit("vCmdToPLC", "onReverse");
    }
    componentDidMount() {
        this.socket = io("http://localhost:5000");
        this.socket.on("motorStatus", function (status) {
            this.setState({
                isService: status.service
            });
        }.bind(this));
        this.socket.on("mp1", function (mp1) {
            this.setState({
                mpamp1: mp1[0].toString(),
                mptor1: mp1[1].toString(),
                mpmotorT1: mp1[2].toString(),
                mpdriveT1: mp1[3].toString(),
                mppow1: mp1[4].toString()
            });
        }.bind(this));
        this.socket.on("mp2", function (mp2) {
            this.setState({
                mpamp2: mp2[0].toString(),
                mptor2: mp2[1].toString(),
                mpmotorT2: mp2[2].toString(),
                mpdriveT2: mp2[3].toString(),
                mppow2: mp2[4].toString()
            });
        }.bind(this));
        this.getHandler();
    };
    componentDidUpdate() {
        this.getHandler();
    }
    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function (error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
    render() {
        const { isModal, text, Hvalue, info1, info2, pos1, pos2, isFre1Adj, isFre2Adj, maxfre1, maxfre2,
            bsFre1, bsFre2, ssFre1, ssFre2, mpamp1, mptor1, mpmotorT1, mpdriveT1, mppow1, mpamp2, 
            mptor2, mpmotorT2, mpdriveT2, mppow2 } = this.state
        return (
            <div className="entry-page">
                <HeightModal external={isModal}
                    text={text}
                    onChange={this.onChange}
                    onKeyUp={this.onKeyUp}></HeightModal>
                <Row style={{ marginTop: "4rem" }}>
                    <TriangleBtn onOpenModal={this.onOpenModal}
                        value={Hvalue}></TriangleBtn>
                    <div className="h-bar-box">
                        <div className="unit">cm</div>
                        <Progress max={15} value={10}>
                        </Progress>
                        <div className="scale-box">
                            <div className="scale-line special top"><span className="numb">14</span>-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line">-</div>
                            <div className="scale-line special bot"><span className="numb">1</span>-</div>
                        </div>
                    </div>
                    <Col md={{ size: 4, offset: 1 }}>
                        {isFre1Adj && <div className="dc-fre-adj">
                            <div    >Max Value:</div>
                            <input type="number"
                                id="fre1max"
                                className="dc-fre-adj-input"
                                value={this.state.textfre1M}
                                onChange={this.onChange2}
                                onKeyUp={this.onKeyUp2}
                            />
                            <div>Threshold:</div>
                            <input type="number"
                                id="fre1set"
                                className="dc-fre-adj-input th"
                                value={this.state.textfre1}
                                onChange={(e) => this.onChange3(e, maxfre1)}
                                onKeyUp={(e) => this.onKeyUp3(e, maxfre1)}
                            />

                        </div>}
                        <SpeedDC ioTopic="motor1DCData"
                            valKey="fre1"
                            id="fre1DC"
                            onAdjTriClick={this.onAdjustTriClick}
                            triBtnPos={pos1}
                            maxScale={maxfre1}
                            bsSize={bsFre1}
                            ssSize={ssFre1}
                        ></SpeedDC>
                        <img className="motor-image for" src={MotorPic} alt="" onClick={this.onInfoPopup} />
                        {info1 && <MotorInfo ioTopic="motor1Info" >Motor 1</MotorInfo>}
                        <div className="bottom-text">Reversing</div>
                        <div className="bottom-text">{this.state.isService ? "Service" : "Normal"}</div>
                    </Col>
                    <Col md={{ size: 4, offset: 3 }}>
                        {isFre2Adj && <div className="dc-fre-adj">
                            <div>Max Value:</div>
                            <input type="number"
                                id="fre2max"
                                className="dc-fre-adj-input"
                                value={this.state.textfre2M}
                                onChange={this.onChange2}
                                onKeyUp={this.onKeyUp2}
                            />
                            <div>Threshold:</div>
                            <input type="number"
                                id="fre2set"
                                className="dc-fre-adj-input th"
                                value={this.state.textfre2}
                                onChange={(e) => this.onChange3(e, maxfre2)}
                                onKeyUp={(e) => this.onKeyUp3(e, maxfre2)}
                            />

                        </div>}
                        <SpeedDC ioTopic="motor2DCData"
                            valKey="fre2"
                            id="fre2DC"
                            onAdjTriClick={this.onAdjustTriClick}
                            triBtnPos={pos2}
                            maxScale={maxfre2}
                            bsSize={bsFre2}
                            ssSize={ssFre2}></SpeedDC>
                        <img className="motor-image rev" src={MotorPic} alt="" onClick={this.onInfoPopup} />
                        {info2 && <MotorInfo ioTopic="motor2Info">Motor 2</MotorInfo>}
                        <div className="bottom-text">Forwarding</div>
                        <div className="bottom-text">{this.state.isService ? "Service" : "Normal"}</div>
                    </Col>
                </Row>
                <Row style={{ background: "#000d", height: "25rem", padding: "0.5em 0.5em 1em 0.4em", marginTop: "1em" }}>
                    <Col md="3" className="config" style={{ height: "10rem" }}>
                        <div className="trapezoid">Configuration</div>
                        <div className="footer-panel">
                            <div className="PID">
                                <div className="Kp">
                                    <NumberInput placeholder="Kp" ioTopic="setKp"></NumberInput>
                                </div>
                                <div className="Ki">
                                    <NumberInput placeholder="Ki" ioTopic="setKi"></NumberInput>
                                </div>
                                <div className="Kd">
                                    <NumberInput placeholder="Kd" ioTopic="setKd"></NumberInput>
                                </div>
                            </div>
                            <FrequencyInput className="freq"></FrequencyInput>
                            <div className="dots">...</div>
                        </div>
                        <div className="trapezoid mp">Forward</div>
                        <div className="footer-panel mp" style={{height: "11em"}}>
                            <div style={{textDecoration: "underline", textAlign:"center"}}>Max performance per 10 sec</div>
                            <div>Current: {mpamp1} A</div>
                            <div>Torque: {mptor1} Nm</div>
                            <div>Motor Thermal: {mpmotorT1} &deg;C</div>
                            <div>Drive Thermal: {mpdriveT1} &deg;C</div>
                            <div>Power: {mppow1} W</div>
                            <div className="dots">...</div>
                        </div>
                    </Col>
                    <Col md="3" className="operate" style={{ height: "10rem" }}>
                        <div className="trapezoid">Operation</div>
                        <div className="footer-panel">
                            <div className="btns">
                                <div className="rev-btn-entry" onClick={this.onRev}><i className="fas fa-chevron-left"></i></div>
                                <div className="stop-btn-entry" onClick={this.onStop}><i className="fas fa-pause"></i></div>
                                <div className="forw-btn-entry" onClick={this.onForw}><i className="fas fa-chevron-right"></i></div>
                            </div>
                            <div className="dots">...</div>
                        </div>
                        <div className="trapezoid mp">Reverse</div>
                        <div className="footer-panel mp" style={{height: "11em"}}>
                        <div style={{textDecoration: "underline", textAlign:"center"}}>Max performance per 10 sec</div>
                            <div>Current: {mpamp2} A</div>
                            <div>Torque: {mptor2} Nm</div>
                            <div>Motor Thermal: {mpmotorT2} &deg;C</div>
                            <div>Drive Thermal: {mpdriveT2} &deg;C</div>
                            <div>Power: {mppow2} W</div>
                            <div className="dots">...</div>
                        </div>
                    </Col>
                    <Col className="notify">
                        <div className="trapezoid">Notification</div>
                        <div className="footer-panel">
                            {/* <EntryNotiPanel></EntryNotiPanel> */}
                        </div>
                    </Col>
                </Row>

            </div>
        )
    }
}
