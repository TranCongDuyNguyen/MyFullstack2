import React, { Component } from 'react'
import {Row, Col} from 'reactstrap';
import PowerWeekChart from '../charts/PowerWeekChart';

import "../CSS/StatisticPageStyle.css";

export default class StatisticPage extends Component {
  render() {
    return (
      <div style={{
        background: "linear-gradient(0deg, #29323c 0%, #485563 100%)",
        padding: "2.5em 1em 1em 1em", height:"40rem"}}>
        <Row style = {{justifyContent:"center"}}>
        <div className="tc-statistic-box">
            <PowerWeekChart></PowerWeekChart>
        </div>
            
        </Row>
      </div>
    )
  }
}
