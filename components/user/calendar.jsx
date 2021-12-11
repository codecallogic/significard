import React from 'react'
import {useState, useEffect} from 'react'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import holidays from '../../utils/holidays'

const localizer = momentLocalizer(moment)

const CalendarUI = ({recipients}) => {
  const [events, setEvents] = useState(holidays)

  useEffect(() => {
    let array = []
    
    if(recipients){
      recipients.forEach((item) => {
        let object = new Object()
        object.id = item._id
        object.title = item.event ? `${item.recipient_name}'s ${item.event} card` : `${item.recipient_name}'s ${item.event_other} card`
        object.start = item.card_arrival
        object.end = item.card_arrival
        object.color = '#56BDF4'
        object.type = 'card'
        setEvents(oldArray => [...oldArray, object])
      })
    }

  }, [])

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.color
    }
    return {
      style: style
    }
  }
  
  return (
    <div className="profile-dashboard-calendar">
      <div className="profile-dashboard-calendar-view">
        <Calendar
          localizer={localizer} 
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month']}
          eventPropGetter={eventStyleGetter}
        />
      </div>
      <div className="profile-dashboard-calendar-events">
        <div className="profile-dashboard-calendar-events-title">Upcoming Events</div>
        {/* .sort( (a, b) => a['start'] > b['start'] ? -1 : 1) */}
        <div className="profile-dashboard-calendar-events-list">
          {events && events.sort( (a, b) => new Date(a['start']) > new Date(b['start']) ? 1 : -1).map((item, idx) => 
            // console.log(new Date(item.start))
            <div 
            key={idx}
            className="profile-dashboard-calendar-events-list-item">
              <span className={`profile-dashboard-calendar-events-list-item-bullet` + (item.color == '#56BDF4' ? '-blue' : '-orange')}></span>
              <div className="profile-dashboard-calendar-events-list-item-container">
                <div className="profile-dashboard-calendar-events-list-item-title">
                  {item.title}
                  <div className="profile-dashboard-calendar-events-list-item-date">
                  {item.start}
                </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarUI