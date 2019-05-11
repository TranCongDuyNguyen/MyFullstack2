import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap'; 

import './CSS/EventPopupStyle.css';
let popupQue;
let remove;
export default class WorkCalendar extends Component {
  state = {
    alertToggle: false,
    content: '',
    money: '',
    time: '',
    modal: false
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }
  alertToggle = () => {
    this.setState({
      alertToggle: !this.state.alertToggle
    })
  }
  componentWillReceiveProps(nxtProps) {
    if(nxtProps.alert !== this.props.alert) {
        this.setState({
          alertToggle: !this.state.alertToggle
        })
    }
    if(nxtProps.contentToggle !== this.props.contentToggle) {
      this.setState({
        modal: !this.state.modal
      })
  }
  }
  render() {
    const {select, events} = this.props;
   
    return (
      <div style={{backgroundColor:"#FFF9"}}>
        <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin, interactionPlugin ]} 
          header={{left: 'prev,next today', center:'title', right:'dayGridMonth,dayGridWeek,dayGridDay'}}
          editable={true}
          selectable={true}
          select={select}
          eventTextColor="#FFF"
          eventBackgroundColor='#000'
          eventBorderColor='#000'
          events={ events }
          eventClick = {function(info) {
            popupQue = this.props.removeEvent(info.event.id);
            let strArr1 = info.event.title.split("Estimated cost:");
            let str1 = strArr1[0];
            let money = strArr1[1];
            let content = str1.substring(0, str1.lastIndexOf("From"));
            let time = str1.substring(str1.lastIndexOf("From"));
            this.setState({
              content,
              money,
              time,
              modal: true
            })
          }.bind(this)}/>
        
          <Modal isOpen={this.state.modal} toggle={this.toggle} className="plan-modal">
            <ModalHeader toggle={this.toggle} style={{backgroundColor:"#EEE"}}>Content</ModalHeader>
            <ModalBody style={{backgroundColor:"#333", color:"#EEE"}} className="scrollbar" id="style-2">
              <div>{this.state.content}</div>
              <div>{this.state.time}</div>
              <div><span className="money-modal">Estimated cost</span>{`: ${this.state.money}`}</div>
              <div className="force-overflow-plan"></div>
            </ModalBody>
            <ModalFooter style={{backgroundColor:"#EEE", height:"2em"}}>
              <Button className="remove-event"
                      onClick={()=> {
                        remove = popupQue();
                      }}>Discard</Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={this.state.alertToggle} toggle={this.alertToggle} className="que">
            <ModalBody style={{backgroundColor:"#333", color:"#EEE"}}>
              Do you really want to remove this event?
            </ModalBody>
            <ModalFooter style={{backgroundColor:"#EEE"}} className="que-popup">
            <Button onClick={remove}>Yes</Button>
            <Button >No</Button>
            </ModalFooter>
        </Modal>

      </div>
    )
  }
}
