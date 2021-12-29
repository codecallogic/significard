import React from 'react'
import {useState, useEffect} from 'react'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import holidays from '../../utils/holidays'

const localizer = momentLocalizer(moment)

const CalendarUI = ({recipients}) => {
  // console.log(recipients)
  const [events, setEvents] = useState(holidays)

  useEffect(() => {
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

    if(recipients){
      recipients.forEach((item) => {
        if(item.cards.length > 0){
          item.cards.forEach((card) => {
            console.log(card)
    
            let cardObject = new Object()
            cardObject.id = card._id
            cardObject.title = card.event ? `${card.recipient_name}'s ${card.event} card` : `${card.recipient_name}'s ${card.event_other} card`
            cardObject.start = card.card_arrival
            cardObject.end = card.card_arrival
            cardObject.color = '#56BDF4'
            cardObject.type = 'card'
            
            setEvents(oldArray => [...oldArray, cardObject])
          })
        }
      })
    }

  }, [])

  useEffect(() => {
    console.log(events)
  }, [events])

  // useEffect(() => {
  //   let filteredEvents = events.filter((item, idx) => new Date(item.start) < new Date('December 23, 2021'))

  //   setEvents(filteredEvents)
  // }, [events])

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
            new Date(item.start) > new Date(Date.now()) ? new Date(item.start) < new Date(Date.now() + 31536000000) ?
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
            :
            null
            : 
            null
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarUI