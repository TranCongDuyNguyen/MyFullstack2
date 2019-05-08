import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';

export default class WorkCalendar extends Component {
  state = {

  }
  render() {
      const {select} = this.props;
    return (
      <div>
      <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin, interactionPlugin ]} 
      header={{left: 'prev,next today', center:'title', right:'dayGridMonth,dayGridWeek,dayGridDay'}}
      editable={true}
      selectable={true}
      select={select}
      eventTextColor="#FFF"
      eventBackgroundColor='#000'
      eventBorderColor='#000'
      events={ [
        { title: 'event 1', date: '2019-04-01' },
        { title: 'event 2', date: '2019-04-02' }
      ] }/>
      </div>
    )
  }
}
