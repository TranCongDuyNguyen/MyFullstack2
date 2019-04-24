import React, { Component } from 'react'
import { Col, Row, Progress } from 'reactstrap';
import io from 'socket.io-client';

import MotorPic from "../../images/motor.png";
import SpeedDC from "../charts/SpeedDC";
import MotorInfo from "../MotorInfo";
import TriangleBtn from "../TriangleBtn";
import HeightModal from "../HeightModal";
import "../CSS/ProgressStyle.css";
import "../CSS/EntryPageStyle.css";

export default class EntryPage extends Component {
    state = {
        isModal: false,
        text: "", //pass to height modal
        Hvalue: 0, //pass to tri-btn
        info1: false,
        info2: false
    }
    onOpenModal = () => {
        this.setState({
            isModal: !this.state.isModal
        })
    }
    //function pass to height modal
    onChange = (e) => {
        if(e.target.value > 15) {
            e.target.value = '15';
        }
        if(e.target.value.length > 4) {
            let newS = e.target.value.slice(0,4);
            e.target.value = newS;
        }
        this.setState({
            text: e.target.value
        })
    }
    onKeyUp = (e) => {
        let text = e.target.value;
        if (e.keyCode ===  13) {
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
    onInfoPopup = (e) => {
        if(e.target.className === "motor-image for") {
            this.setState({
                info1: !this.state.info1
            })
        }
        if(e.target.className === "motor-image rev") {
            this.setState({
                info2: !this.state.info2
            })
        }
    }
    componentDidMount() {
        this.socket = io("http://localhost:5000");
    };
    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function (error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
    render() {
        const {isModal, text, Hvalue, info1, info2} = this.state
        return (
            <div>
                <HeightModal external={isModal}
                    text={text}
                    onChange={this.onChange}
                    onKeyUp={this.onKeyUp}></HeightModal>
                <Row style={{ marginTop: "4rem" }}>
                <TriangleBtn onOpenModal={this.onOpenModal}
                            value = {Hvalue}></TriangleBtn>
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
                        <SpeedDC></SpeedDC>
                        <img className="motor-image for" src={MotorPic} alt="" onClick={this.onInfoPopup}/>
                        {info1 && <MotorInfo ioTopic="motor1Info" >Motor 1</MotorInfo>}
                    </Col>
                    <Col md={{ size: 4, offset: 3 }}>
                        <SpeedDC></SpeedDC>
                        <img className="motor-image rev" src={MotorPic} alt="" onClick={this.onInfoPopup}/>
                        {info2 && <MotorInfo ioTopic="motor2Info">Motor 2</MotorInfo>}
                    </Col>
                </Row>

            </div>
        )
    }
}
