import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'; 

export default class WorkCalendar extends Component {
  state = {
    content: '',
    modal: false
  }
  toggle = () => {
    this.setState({
      modal: false
    })
  }
  render() {
      const {select} = this.props;
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
          events={ [{title:"aaaaa", date:"2019-05-01"}] }
          eventClick = {function(info) {
            this.setState({
              content: info.event.title,
              modal: true
            })
          }.bind(this)}/>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle} style={{backgroundColor:"#EEE"}}>Content</ModalHeader>
            <ModalBody style={{backgroundColor:"#333", color:"#EEE"}}>
              {this.state.content}
            </ModalBody>
        </Modal>
      </div>
    )
  }
}
