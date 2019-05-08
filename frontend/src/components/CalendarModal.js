import React, { Component } from 'react'
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CurrencyInput from 'react-currency-input';

import './CSS/CalendarModalStyle.css';

export default class CalendarModal extends Component {
  state = {
    moneyDis: '',
    money: 0,
    from: '',
    to: ''

  }
  
  onTimeChange = (e) => {
    if(e.target.id === "from") {
      this.setState({
        from: e.target.value
      })
    }
    else if(e.target.id === "to") {
      this.setState({
        to: e.target.value
      })
    }
    
  }

  handleChange = (event, maskedvalue, floatvalue) => {
    this.setState({
      moneyDis: maskedvalue,
      money: floatvalue
    })
  }

  render() {
    const { modal, toggle, raise } = this.props;
    return (
      <div>
        <Modal isOpen={modal} toggle={toggle} className={this.props.className}>
          <ModalHeader toggle={toggle} style={{ padding: "0.25em 1rem" }}>Your plan</ModalHeader>
          <ModalBody>
            <div style={{ marginBottom: "0.5em" }}>
              <span>Description:</span><span><Input type="textarea"></Input></span>
            </div>
            <div className="time-box">
              <span style={{ marginRight: "10em" }}>From: 
                <Input type="time"
                  id="from"
                  style={{ width: "100%" }}
                  onChange={this.onTimeChange}
                >
                </Input>
              </span>
              <span>To: 
                <Input type="time"
                id="to" 
                style={{ width: "100%" }}
                onChange={this.onTimeChange}
              >
                </Input>
              </span>
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

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => raise(this.state)}>Raise</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
