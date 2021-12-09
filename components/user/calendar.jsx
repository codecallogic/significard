import React from 'react'
import {useState, useEffect} from 'react'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'

const localizer = momentLocalizer(moment)

const CalendarUI = ({recipients}) => {
  console.log(recipients)
  const [events, setEvents] = useState([])

  useEffect(() => {
    let array = []
    
    if(recipients){
      recipients.forEach((item) => {
        let object = new Object()
        object.id = item._id
        object.title = item.event ? `${item.recipient_name}'s ${item.event} card` : `${item.recipient_name}'s ${item.event_other} card`
        object.start = item.card_arrival
        object.end = item.card_arrival
        array.push(object)
      })
      console.log(array)
      setEvents(array)
    }

  }, [])
  
  return (
    <div className="profile-dashboard-calendar">
      <Calendar
        localizer={localizer} 
        events={events}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  )
}

export default CalendarUI