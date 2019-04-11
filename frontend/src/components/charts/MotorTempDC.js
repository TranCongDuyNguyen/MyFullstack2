import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import io from "socket.io-client";

import DoughnutChart from './DoughnutChart';
import { getMotor } from '../../actions/motorAction';

class MotorTempDC extends Component {

    state = {
        data: [
            {
                name: "MotorTemp",
                motorT: 50
            },
            {
                name: "Ref",
                refKey: 100
            }
        ],
        flash: false
    }
    newData = JSON.parse(JSON.stringify(this.state.data)); //deep clone

    render() {
        const { data } = this.state;
        return (
            <div>
                <DoughnutChart data={data.concat([])}
                    dataKey="motorT"
                    threshold={60}
                    offset={20}
                    colorId="motorT"
                    startGradColor="#FFF275"
                    endGradColor="#fd1d1d"
                    theUnit = "&deg;C"
                    flash={this.state.flash}
                ></DoughnutChart>
            </div>
        )
    }

    componentDidMount() {
        this.props.getMotor();
        this.socket = io("http://localhost:5000", { transports: ['websocket'] })
        this.socket.on(this.props.ioTopic, function (motorObj) {
            this.newData[0].motorT = motorObj.motorT;
            this.setState((state) => {
                return {
                    data: this.newData
                }
            });
            if (motorObj.motorT > 80) {
                this.setState({
                    flash: !this.state.flash
                })
            }
        }.bind(this));
    };

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket.on("connect_error", function (error) {
            if (error) {
                console.log(error);    
            }
            this.socket.disconnect();
        })
    };
}

MotorTempDC.propTypes = {
    getMotor: PropTypes.func.isRequired,
    motor: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return { motor: state.motor };
}


export default connect(mapStateToProps, { getMotor })(MotorTempDC);