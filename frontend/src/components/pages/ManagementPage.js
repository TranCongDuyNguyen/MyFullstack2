import React, { Component } from 'react'

import WorkCalendar from '../WorkCalendar';
import CalendarModal from '../CalendarModal';
export default class ManagementPage extends Component {

  state = {
    modal: false,
    eventDate: ''
  };

  modalToggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  select = (selectionInfo) => {
    console.log(selectionInfo.start.getHours());
    console.log(selectionInfo.startStr);
    this.setState(prevState => ({
      eventDate: selectionInfo.startStr,
      modal: !prevState.modal
    }));
  }

  onRaiseEvent = (eventInfo) => {
    console.log(eventInfo);
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
 
  render() {
    const {modal} = this.state;
    return (
      <div>
        <CalendarModal modal={modal}
                      toggle={this.modalToggle}
                      raise={this.onRaiseEvent}
                      ></CalendarModal>
        <WorkCalendar select={this.select}></WorkCalendar>
      </div>
    )
  }
}
