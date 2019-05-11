import React, { Component } from 'react'
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CurrencyInput from 'react-currency-input';
import TimePicker from 'react-time-picker';

import './CSS/CalendarModalStyle.css';

export default class CalendarModal extends Component {
  state = {
    plan:'',
    moneyDis: '',
    money: 0,
    from: '',
    to: ''

  }
  onPlan = (e) => {
    this.setState({
      plan: e.target.value
    })
  }
  onFromTime = (time) => {
      this.setState({
        from: time
      })
  }
     
  onToTime = (time) => {
    this.setState({
      to: time
    })
}
onRaiseClick = () => {
  this.props.raise(this.state);
  this.setState({
    plan: "",
    moneyDis: "",
    from: "",
    to: ""
  })
} 

  handleChange = (event, maskedvalue, floatvalue) => {
    this.setState({
      moneyDis: maskedvalue,
      money: floatvalue,
      from: "00:00"
    })
  }

  render() {
    const { modal, toggle } = this.props;
    return (
      <div>
        <Modal isOpen={modal} toggle={toggle} className={this.props.className}>
          <ModalHeader toggle={toggle} style={{ padding: "0.25em 1rem" }}>Your plan</ModalHeader>
          <ModalBody>
            <div style={{ marginBottom: "0.5em" }}>
              <span>Description:</span>
              <span><Input type="textarea" value={this.state.plan} onChange={this.onPlan}></Input></span>
            </div>
            <div>
              <span>Estimated Cost: </span>
              <div><CurrencyInput className="currency-input"
                value={this.state.moneyDis}
                onChangeEvent={this.handleChange}
                precision="0"
                suffix=" VNĐ" />
              </div>
            </div>
            <div className="time-box">
            <span style={{ marginRight: "6em" }}>
              <div>From:</div> 
              <TimePicker className="from"
                          disableClock={true} 
                          locale="sv-sv"
                          value={this.state.from}
                          onChange={this.onFromTime}></TimePicker>
            </span>
            <span>
              <div>To:</div>  
              <TimePicker className="to"
                disableClock={true} 
                locale="sv-sv"
                value={this.state.to}
                onChange={this.onToTime}></TimePicker>
            </span>
          </div>
          </ModalBody>
          <ModalFooter>
            <Button className="raise-cm" onClick={this.onRaiseClick}>Raise</Button>{' '}
            <Button className="cancel-cm" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
