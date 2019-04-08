import React, { Component } from 'react'
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import {
  ResponsiveContainer
} from 'recharts';

import './CSS/Management.ChartStyle.css';
import DriveTempDC from './charts/DriveTempDC';
import MotorTempDC from './charts/MotorTempDC';
import TorqueTC from './charts/TorqueTC';
import CurrentTC from './charts/CurrentTC';

export default class ManagementChart extends Component {

  render() {
    return (
      <div style={{height: "100%", width: "100%"}}> 
        <Container className="parameter-display" style={{height: "100%", width: "100%"}}>
          <Row className="radial-box" >
            <Col md={{ size: 4 }} style={{ marginLeft: "2.5rem" }}>
              <div className="drive-temp-box" >
                <DriveTempDC />
              </div>
            </Col>
            <Col md={{ size: 4 }} style={{ marginLeft: "2.5rem" }}>
              <div className="motor-temp-box"
                style={{ marginBottom: "2rem" }}
              >
                <MotorTempDC />
              </div>
            </Col>
          </Row>

          <Row style={{height: "26%", justifyContent: "center"}} > 
            <Col md="10" style={{height: "100%"}}>
              <ResponsiveContainer className="motor-area-chart torque" >
                <TorqueTC />
              </ResponsiveContainer>
            </Col>
          </Row>

          
          <Row style={{height: "26%", justifyContent: "center" }} > 
            <Col md="10" style={{height: "100%"}}>
              <ResponsiveContainer className="motor-area-chart ampere" >
                <CurrentTC />
              </ResponsiveContainer>
            </Col>
          </Row>

        </Container>

      </div>
    )
  }
}
