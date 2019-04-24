import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import HeightTC from "./charts/HeightTC";
import './CSS/FrequencyInputStyle.css';

export default class HeightModal extends Component {
    state = {
        internal: false
    };
    toggle = () => {
        this.setState({
            internal: !this.state.internal
        });
    }
   
    componentWillReceiveProps(nxtProps) {
        if (nxtProps.external !== this.props.external) {
            this.toggle();
        }
    };
    render() {
        const { internal } = this.state;
        return (
            <div>
                <Modal isOpen={internal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Height Trend</ModalHeader>
                    <ModalBody style={{ height: "20rem", paddingTop: "2.8em" }}>
                        <HeightTC ioTopic="heightAmount"
                            stopFlag="hStopFlag"
                            reviewFlag="hReviewFlag"
                            forwFlag="hForwFlag"
                            reviewData="reviewH"
                        ></HeightTC>
                        <div className="set-height">
                            <span style={{color: "#1985A1"}}>Height expected:</span>
                            <input type="number"
                                className="height-input"
                                min="0"
                                max="15"
                                value={this.props.text}
                                onChange={this.props.onChange}
                                onKeyUp={this.props.onKeyUp} />
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
