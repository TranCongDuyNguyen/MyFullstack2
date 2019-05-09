import React, { Component } from 'react'
import io from 'socket.io-client';

import WorkCalendar from '../WorkCalendar';
import CalendarModal from '../CalendarModal';
export default class ManagementPage extends Component {

  state = {
    modal: false,
    eventDate: null,
    events: [{
      title: '',
      date: null
    }]
  };

  modalToggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  select = (selectionInfo) => {
    console.log(selectionInfo.startStr);
    this.setState(prevState => ({
      eventDate: selectionInfo.startStr,
      modal: !prevState.modal
    }));
  }

  onRaiseEvent = (eventInfo) => {
    console.log(eventInfo);
    let date = this.state.eventDate;
    let event = {
      plan: eventInfo.plan,
      from: eventInfo.from,
      to: eventInfo.to,
      money: eventInfo.money,
      date
    }
    
    this.socket.emit("planEvent", event);

    this.setState(prevState => ({
      events: this.state.events.concat(event),
      modal: !prevState.modal
    }));
  }
  componentDidMount() {
    this.socket = io();
  }
  componentWillUnmount() {
    this.socket.disconnect();
    this.socket.on("connect_error", function (error) {
        console.log(error);
        this.socket.disconnect();
    })
};
  render() {
    const {modal} = this.state;
    return (
      <div>
        <CalendarModal modal={modal}
                      toggle={this.modalToggle}
                      raise={this.onRaiseEvent}
                      ></CalendarModal>
        <WorkCalendar 
          select={this.select}
          events={this.state.events}>
        </WorkCalendar>
      </div>
    )
  }
}
