import React, { Component } from 'react'
import axios from 'axios';

import WorkCalendar from '../WorkCalendar';
import CalendarModal from '../CalendarModal';

const config = {
  headers: {
    "Content-type": "application/json"
  }
};

export default class ManagementPage extends Component {
  state = {
    modal: false,
    contentToggle: false,
    alert: false,
    eventDate: null,
    events: []
  };

  modalToggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  select = (selectionInfo) => {
    this.setState(prevState => ({
      eventDate: selectionInfo.startStr,
      modal: !prevState.modal
    }));
  }

  onRaiseEvent = (eventInfo) => {
    let date = this.state.eventDate;
    let event = {
      plan: eventInfo.plan,
      from: eventInfo.from,
      to: eventInfo.to,
      money: eventInfo.moneyDis,
      calendarDate: date
    }
    
    this.putHandler(event);
    this.getHandler();
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  onGetEventId = (eventId) => {
    function onOpenQue() {    
      this.setState({
        alert: !this.state.alert
      })
        function onRemoveEvent() {
          this.setState({
            alert: !this.state.alert,
            contentToggle: !this.state.contentToggle,
            events: this.state.events.filter((x) => x.id !== eventId)
          })
          axios.delete("/api/plan/" + eventId, config);
        }
        return onRemoveEvent.bind(this);
    }
    return onOpenQue.bind(this);
  }
  componentDidMount() {
    this.getHandler();
  }

  putHandler = (event) => {

    axios.post('/api/plan', event, config)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
  getHandler = () => {
    axios.get('/api/plan').then(res => {
      let events = res.data; 
      let eventsArr = [];
      for (let event of events) {
        let id = event._id;
        let title = `${event.plan} \nFrom ${event.from} to ${event.to} \nEstimated cost: ${event.money}`;
        let date = event.calendarDate;
        let calendarEvent = {id, title, date};
        eventsArr.push(calendarEvent);
      }
      this.setState({
        events: eventsArr
      })
    })
  }
  render() {
    const { modal } = this.state;
    return (
      <div>
        <CalendarModal modal={modal}
          toggle={this.modalToggle}
          raise={this.onRaiseEvent}
        ></CalendarModal>
        <WorkCalendar
          select={this.select}
          events={this.state.events}
          removeEvent = {this.onGetEventId}
          contentToggle = {this.state.contentToggle}
          alert={this.state.alert}>
        </WorkCalendar>
      </div>
    )
  }
}
