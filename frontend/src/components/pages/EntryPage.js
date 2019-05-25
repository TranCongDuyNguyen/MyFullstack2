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
import ClickOutside from "../ClickOutside";
import "../CSS/ProgressStyle.css";
import "../CSS/EntryPageStyle.css";

const config = {
    headers: {
        "Content-type": "application/json"
    }
}
export default class EntryPage extends Component {
    constructor(props) {
        super(props);
        this.maxscale1 = [{ val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false }];

        this.maxscale2 = [{ val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false },
        { val: "100", fault: 0, warn: 0, pos: '126,86 136,80 136,92', bs: false, ss: false }];
    }
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
        textfre1W: "",
        textfre2W: "",
        fFre1Lvl: "",
        fFre2Lvl: "",
        wFre1Lvl: "",
        wFre2Lvl: "",
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
        Hvalue: 0, //pass to tri-btn
        Hexp: 0,
        Hfb: 0,
        ssp1: 0,
        ssp2: 0
    }
    getHandler1 = () => {
        axios.get("/api/maxscale1/1").then(res => {
            this.maxscale1 = res.data.maxscale1;
            this.setState({
                maxfre1: this.maxscale1[5].val,
                bsFre1: this.maxscale1[5].bs,
                ssFre1: this.maxscale1[5].ss,
                pos1: this.maxscale1[5].pos,
                fFre1Lvl: this.maxscale1[5].fault,
                wFre1Lvl: this.maxscale1[5].warn
            });
        }).catch(err => console.log(err));
    }
    getHandler2 = () => {
        axios.get("/api/maxscale1/2").then(res => {
            this.maxscale2 = res.data.maxscale1;
            this.setState({
                maxfre2: this.maxscale2[5].val,
                bsFre2: this.maxscale2[5].bs,
                ssFre2: this.maxscale2[5].ss,
                pos2: this.maxscale2[5].pos,
                fFre2Lvl: this.maxscale2[5].fault,
                wFre2Lvl: this.maxscale2[5].warn
            });
        }).catch(err => console.log(err));
    }
    putHandler1 = (maxscale1, config) => {
        axios.put('/api/maxscale1/1', { maxscale1 }, config)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
    putHandler2 = (maxscale2, config) => {
        axios.put('/api/maxscale1/2', { maxscale1: maxscale2 }, config)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
    componentDidMount() {
        console.log(this.maxscale1);
        this.socket = io();
        this.socket.on("motorStatus", function (status) {
            this.setState({
                isService: status.service,
                Hexp: status.hiex,
                Hfb: status.hifb
            });
        }.bind(this));
        this.socket.on("motorStatus2", function (status) {
            this.setState({
                ssp1: status.ssp1,
                ssp2: status.ssp2
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
        this.getHandler1();
        this.getHandler2();
    };
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
    onChange1(e, maxScale) {
        let eid = e.target.id;
        if (parseFloat(e.target.value) > maxScale) {
            e.target.value = maxScale.toString();
        }
        if (e.target.value.length > 4) {
            let newS = e.target.value.slice(0, 4);
            e.target.value = newS;
        }
        if (eid === "fre1set1") {
            this.setState({
                textfre1W: e.target.value
            })
        }
        else if (eid === "fre2set1") {
            this.setState({
                textfre2W: e.target.value
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
        if (parseFloat(e.target.value) > maxScale) {
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
            this.socket.emit("setHeight", Number(this.state.text).toFixed(2));
            this.setState(() => ({
                Hvalue: text
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
            if (eid === "fre1set") {
                this.maxscale1[5].pos = positionStr;
                this.maxscale1[5].fault = parseFloat(text);
                this.putHandler1(this.maxscale1, config);
                this.getHandler1();
                this.setState(() => ({
                    textfre1: ""
                }))
            }
            else if (eid === "fre2set") {
                this.maxscale2[5].pos = positionStr;
                this.maxscale2[5].fault = parseFloat(text);
                this.putHandler2(this.maxscale2, config);
                this.getHandler2();
                this.setState(() => ({
                    textfre2: ""
                }))
            }
        }
    }

    onKeyUp2 = (e) => {
        let eid = e.target.id;
        let text = e.target.value;
        if (e.keyCode === 13) {
            if (!text) { return; };
            if (eid === "fre1max") {
                if (e.target.value < 10) {
                    this.maxscale1[5].bs = true;
                    this.maxscale1[5].ss = false;
                }
                else if (e.target.value > 999) {
                    this.maxscale1[5].bs = false;
                    this.maxscale1[5].ss = true;
                }
                else {
                    this.maxscale1[5].bs = false;
                    this.maxscale1[5].ss = false;
                }
                this.maxscale1[5].val = text;
                this.putHandler1(this.maxscale1, config);
                this.getHandler1();
                this.setState(() => ({
                    textfre1M: ""
                }))
            }
            else if (eid === "fre2max") {
                if (e.target.value < 10 ) {
                    this.maxscale2[5].bs = true;
                    this.maxscale2[5].ss = false;
                }
                else if (e.target.value > 999) {
                    this.maxscale2[5].bs = false;
                    this.maxscale2[5].ss = true;
                }
                else {
                    this.maxscale2[5].bs = false;
                    this.maxscale2[5].ss = false;
                }
                this.maxscale2[5].val = text;
                this.putHandler2(this.maxscale2, config);
                this.getHandler2();
                this.setState(() => ({
                    textfre2M: ""
                }))
            }
        }
    }
    onKeyUp1 = (e) => {
        let eid = e.target.id;
        let text = e.target.value;
        if (e.keyCode === 13) {
            if (!text) { return; };
            if (eid === "fre1set1") {
                this.maxscale1[5].warn = parseFloat(text);
                this.putHandler1(this.maxscale1, config);
                this.getHandler1();
                this.setState({
                    textfre1W: ""
                })
            }
            else if (eid === "fre2set1") {
                this.maxscale2[5].warn = parseFloat(text);
                this.putHandler2(this.maxscale2, config);
                this.getHandler2();
                this.setState({
                    textfre2W: ""
                })
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


    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function (error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
    render() {
       
        const { isModal, text, Hvalue, info1, info2, pos1, pos2, isFre1Adj, isFre2Adj, maxfre1, maxfre2,
            bsFre1, bsFre2, ssFre1, ssFre2, mpamp1, mptor1, mpmotorT1, mpdriveT1, mppow1, mpamp2, Hexp,
            mptor2, mpmotorT2, mpdriveT2, mppow2, fFre1Lvl, fFre2Lvl, wFre1Lvl, wFre2Lvl, ssp1, ssp2,
            Hfb } = this.state
        let hexpVal = Number(Hexp).toFixed(2).toString().slice(0,4);
        let hfbVal = Number(Hfb).toFixed(2).toString().slice(0,4);
        if(hexpVal.charAt((hexpVal.length - 1)) === ".") {
            hexpVal = hexpVal.slice(0, hexpVal.length - 1);
        }
        if(hfbVal.charAt((hfbVal.length - 1)) === ".") {
            hfbVal = hfbVal.slice(0, hfbVal.length - 1);
        }
        console.log(hfbVal);
        return (
            <div className="entry-page" style={{backgroundImage: 'linear-gradient(to top, #dfe9f3 0%, #EEEE 100%)'}}>
                <HeightModal external={isModal}
                    text={text}
                    onChange={this.onChange}
                    onKeyUp={this.onKeyUp}></HeightModal>
                <div className="space" style={{ height: "4em" }}></div>
                
                <Row >
                    <TriangleBtn onOpenModal={this.onOpenModal}
                        hiex= {hexpVal}></TriangleBtn>
                    <div className="h-bar-box">
                        <div className="unit">{`${hfbVal} cm`}</div>
                        <Progress max={15} value={hfbVal}>
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
                            <div>Max Value:</div>
                            <input type="number"
                                id="fre1max"
                                className="dc-fre-adj-input"
                                value={this.state.textfre1M}
                                onChange={this.onChange2}
                                onKeyUp={this.onKeyUp2}
                            />
                            <div>Fault level:</div>
                            <input type="number"
                                id="fre1set"
                                className="dc-fre-adj-input"
                                value={this.state.textfre1}
                                onChange={(e) => this.onChange3(e, maxfre1)}
                                onKeyUp={(e) => this.onKeyUp3(e, maxfre1)}
                            />
                            <div>Warn level:</div>
                            <input type="number"
                                id="fre1set1"
                                className="dc-fre-adj-input th"
                                value={this.state.textfre1W}
                                onChange={(e) => this.onChange1(e, fFre1Lvl)}
                                onKeyUp={this.onKeyUp1} />
                        </div>}
                        <SpeedDC ioTopic="motor1DCData2"
                            valKey="RSp0"
                            id="fre1DC"
                            onAdjTriClick={this.onAdjustTriClick}
                            triBtnPos={pos1}
                            maxScale={maxfre1}
                            bSize={bsFre1}
                            sSize={ssFre1}
                            faultLvl={fFre1Lvl}
                            warnLvl={wFre1Lvl}
                        ></SpeedDC>
                        <img className="motor-image for" src={MotorPic} alt="" onClick={this.onInfoPopup} />
                        {info1 && <MotorInfo ioTopic={["motor1Info1", "motor1Info2"]} >Motor 1</MotorInfo>}
                        <div className="bottom-text">Reversing</div>
                        <div className="bottom-text">{this.state.isService ? "Service" : "Normal"}</div>
                        {info1 && <div className="set-sp1-box">
                            Speed Setpoint:
                            <div className="ssp">{ssp1}</div>
                        </div>}
                    </Col>
                    <Col md={{ size: 4, offset: 3 }} className="entry-motor-img-2">
                        {isFre2Adj && <div className="dc-fre-adj">
                            <div>Max Value:</div>
                            <input type="number"
                                id="fre2max"
                                className="dc-fre-adj-input"
                                value={this.state.textfre2M}
                                onChange={this.onChange2}
                                onKeyUp={this.onKeyUp2}
                            />
                            <div>Fault level:</div>
                            <input type="number"
                                id="fre2set"
                                className="dc-fre-adj-input"
                                value={this.state.textfre2}
                                onChange={(e) => this.onChange3(e, maxfre2)}
                                onKeyUp={(e) => this.onKeyUp3(e, maxfre2)}
                            />
                            <div>Warn level:</div>
                            <input type="number"
                                id="fre2set1"
                                className="dc-fre-adj-input th"
                                value={this.state.textfre2W}
                                onChange={(e) => this.onChange1(e, fFre2Lvl)}
                                onKeyUp={this.onKeyUp1} />
                        </div>}
                        <SpeedDC ioTopic="motor2DCData2"
                            valKey="RSp1"
                            id="fre2DC"
                            onAdjTriClick={this.onAdjustTriClick}
                            triBtnPos={pos2}
                            maxScale={maxfre2}
                            bSize={bsFre2}
                            sSize={ssFre2}
                            faultLvl={fFre2Lvl}
                            warnLvl={wFre2Lvl}></SpeedDC>
                        <img className="motor-image rev" src={MotorPic} alt="" onClick={this.onInfoPopup} />
                        {info2 && <MotorInfo ioTopic={["motor2Info1", "motor2Info2"]}>Motor 2</MotorInfo>}
                        <div className="bottom-text">Forwarding</div>
                        <div className="bottom-text">{this.state.isService ? "Service" : "Normal"}</div>
                        {info2 && <div className="set-sp1-box sp2">
                            Speed Setpoint:
                            <div className="ssp">{ssp2}</div>
                        </div>}
                    </Col>
                </Row>
                <Row style={{ background: "#000d", height: "25rem", padding: "0.5em 0.5em 1em 0.4em", marginTop: "1em" }}
                    className="entry-footer">
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
                        <div className="footer-panel mp" style={{ height: "11em" }}>
                            <div style={{ textDecoration: "underline", textAlign: "center" }}>Max performance per 10 sec</div>
                            <div>Current: {mpamp1} A</div>
                            <div>Torque: {mptor1} Nm</div>
                            <div>Motor Thermal: {mpmotorT1} %</div>
                            <div>Drive Thermal: {mpdriveT1} %</div>
                            <div>Power: {mppow1} kW</div>
                            <div className="dots">...</div>
                        </div>
                    </Col>
                    <Col md="3" className="operate" style={{ height: "10rem" }}>
                        <div className="trapezoid">Operation</div>
                        <div className="footer-panel">
                        <ClickOutside >            
                        </ClickOutside>
                            <div className="K-tau">
                                <div className="K">
                                    <NumberInput placeholder="K" ioTopic="setK"></NumberInput>
                                </div>
                                <div className="Tau">
                                    <NumberInput placeholder="Tau" ioTopic="setTau"></NumberInput>
                                </div>
                            </div>

                            <div className="dots">...</div>
                        </div>
                        <div className="trapezoid mp">Reverse</div>
                        <div className="footer-panel mp" style={{ height: "11em" }}>
                            <div style={{ textDecoration: "underline", textAlign: "center" }}>Max performance per 10 sec</div>
                            <div>Current: {mpamp2} A</div>
                            <div>Torque: {mptor2} Nm</div>
                            <div>Motor Thermal: {mpmotorT2} %</div>
                            <div>Drive Thermal: {mpdriveT2} %</div>
                            <div>Power: {mppow2} kW</div>
                            <div className="dots">...</div>
                        </div>
                    </Col>
                    <Col md="6" className="notify">
                        <div className="trapezoid">Notification</div>
                        <div className="footer-panel">
                            <EntryNotiPanel ioTopic="operationNoties"></EntryNotiPanel>
                        </div>
                    </Col>
                </Row>

            </div>
        )
    }
}
