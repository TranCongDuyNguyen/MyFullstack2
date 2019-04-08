import React, { Component } from 'react'
import {
    Container
} from 'reactstrap'
import io from 'socket.io-client';

import Led from './Led';
import FrequencyInput from './FrequencyInput';
import './CSS/Management.ControlPanelStyle.css';

export default class ManagementControlPanel extends Component {

    state = {
        run: false,
        rev: false,
        stop: false,
        maintenance: false,
        fault: false,
        service: false
    }

    render() {
        const { run, rev, stop, maintenance, fault, service } = this.state;
        return (
            <Container>
                <div className="led-container">
                    <div className="active-status">
                        <Led className="blue-led"
                            customColor={(run && "#24E0FF") || (!run && "#BBB")}
                            customShadow={run ? "rgba(0, 0, 0, 0.2) 0 -1px 8px 1px, inset  0 -1px 9px, #3F8CFF 0 2px 14px" :  "0px 0px #0000"}
                            customShadowOfText={run ? "0 0 0.4em 0.1em rgb(199, 255, 236)" :  "0px 0px #0000"}>
                            Run
                        </Led>
                        <Led className="blue-led"
                            customColor={(stop && "#24E0FF") || (!stop && "#BBB")}
                            customShadow={stop && "rgba(0, 0, 0, 0.2) 0 -1px 8px 1px, inset  0 -1px 9px, #3F8CFF 0 2px 14px"}
                            customShadowOfText={stop && "0 0 0.4em 0.1em rgb(199, 255, 236)"}>
                            Stop
                        </Led>
                        <Led className="blue-led"
                            customColor={(rev && "#24E0FF") || (!rev && "#BBB")}
                            customShadow={rev && "rgba(0, 0, 0, 0.2) 0 -1px 8px 1px, inset  0 -1px 9px, #3F8CFF 0 2px 14px"}
                            customShadowOfText={rev && "0 0 0.4em 0.1em rgb(199, 255, 236)"}>
                            Reverse
                        </Led>
                    </div>
                    <div className="service-status">
                        <Led className="green-led"
                            customColor={(service && "#ABFF00") || (!service && "#BBB")}
                            customShadow={service && "rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, #89FF00 0 2px 12px"}
                            customShadowOfText={service && "0 0 0.4em 0.1em rgb(199, 255, 236)"}>
                            Service
                        </Led>
                        <Led className="red-led"
                            customColor={(fault && "#F00") || (!fault && "#BBB")}
                            customShadow={fault && "rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px"}
                            customShadowOfText={fault && "0 0 0.4em 0.1em rgb(199, 255, 236)"}>
                            Fault
                        </Led>
                        <Led className="yellow-led"
                            customColor={(maintenance && "#FF0") || (!maintenance && "#BBB")}
                            customShadow={maintenance && "rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #808002 0 -1px 9px, #FF0 0 2px 12px"}
                            customShadowOfText={maintenance && "0 0 0.4em 0.1em rgb(199, 255, 236)"}>
                            Maintenance
                        </Led>
                    </div>
                </div>
            <div className="input-container">
                <FrequencyInput></FrequencyInput>
            </div>
            </Container>
        )
    }

    componentDidUpdate() {
        this.socket = io("http://localhost:5000", {transports: ['websocket']})
        this.socket.on("apiStatus", function (statusObj) {
            console.log(statusObj);
            this.setState({
                run: statusObj.run,
                rev: statusObj.rev,
                stop: statusObj.stop,
                maintenance: statusObj.maintenance,
                fault: statusObj.fault,
                service: statusObj.service
            })
        }.bind(this));
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function(error) {
            console.log(error);
            this.socket.disconnect();
        })
    };
}
