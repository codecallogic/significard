import SVG from '../../files/svgs'
import {useEffect, useState} from 'react'

const Orders = ({user, credits, recipients, setDashboard, setSideNav}) => {

  const [allRecipients, setAllRecipients] = useState(recipients)
  const [filter, setFilter] = useState('upcoming')

  useEffect(() => {
    let recipientsArray = [...recipients]
    let cardsArray = []
    
    recipients.forEach((item) => {  
      item.cards.forEach((card) => {
        cardsArray.push(card)
      })
    })

    recipientsArray = [...recipientsArray, ...cardsArray]
    recipientsArray.sort((a, b) => new Date(a['card_arrival']) > new Date(b['card_arrival']) ? 1 : -1)
    setAllRecipients([...recipientsArray])
  
  }, [recipients])
  
  const formatDate = (e) => {
    let date = new Date(e)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var month = monthNames[date.getUTCMonth()]
    var day = date.getUTCDate()
    var year = date.getUTCFullYear()
    return `${month} ${day}, ${year}`
  }

  
  return (
    <div className="profile-dashboard-orders">
      <div className="profile-dashboard-recipients-edit-title-credits"><span>&nbsp;</span> You have {credits ? credits : '0'} cards</div>
      <div className="profile-dashboard-orders-title">
        <div className={`profile-dashboard-orders-title-sent ` + (filter == 'upcoming' ? 'profile-dashboard-orders-title-sent-selected' : '')} onClick={ () => setFilter('upcoming')}>Upcoming</div>
        <div className={`profile-dashboard-orders-title-sent ` + (filter == 'shipped' ? 'profile-dashboard-orders-title-sent-selected' : '')} onClick={ () => setFilter('shipped')}>Sent</div>
        <div className="profile-dashboard-orders-title-addCard" onClick={() => setDashboard('profile')}><SVG svg={'plus'}></SVG>Add Card</div>
      </div>
      {filter == 'upcoming' && 
      <div className="profile-dashboard-orders-card">
        {allRecipients.length > 0 && allRecipients.map((item) => 
          item.task_state !== 'shipped' ?
            <div className="profile-dashboard-orders-card-item">
              <div className="profile-dashboard-orders-card-item-name">{item.recipient_name ? item.recipient_name : 'Unknown'}</div>
              <div className="profile-dashboard-orders-card-item-event">{item.event ? item.event : item.event_other ? item.event_other : 'Unknown event'}</div>
              <div className="profile-dashboard-orders-card-item-delivery">Estimated Delivery</div>
              <div className="profile-dashboard-orders-card-item-date">{item.card_arrival ? item.card_arrival : 'Unknown'}</div>
              <div className="profile-dashboard-orders-card-item-image">
                <img src={item.recommendations ? item.recommendations.length > 0 ? `https://d3t0rtmhddz26.cloudfront.net/thumbnails/${item.recommendations[0].image_name}` : `/media/orders-placeholder.jpeg` : `/media/orders-placeholder.jpeg`} className="profile-dashboard-orders-card-item-image-front"></img>
                <img src={item.recommendations ? item.recommendations.length > 0 ? `https://d3t0rtmhddz26.cloudfront.net/thumbnails/${item.recommendations[1].image_name}` : `/media/orders-placeholder.jpeg` : `/media/orders-placeholder.jpeg`} className="profile-dashboard-orders-card-item-image-inside"></img>
              </div>
              <div className="profile-dashboard-orders-card-item-ordered">Ordered: {formatDate(item.createdAt)}</div>
            </div>
            : 
            null
        )
        }
      </div>
      }
      {filter == 'shipped' && 
      <div className="profile-dashboard-orders-card">
        {allRecipients.length > 0 && allRecipients.map((item) => 
          item.task_state == 'shipped' ?
            <div className="profile-dashboard-orders-card-item">
              <div className="profile-dashboard-orders-card-item-name">{item.recipient_name ? item.recipient_name : 'Unknown'}</div>
              <div className="profile-dashboard-orders-card-item-event">{item.event ? item.event : item.event_other ? item.event_other : 'Unknown event'}</div>
              <div className="profile-dashboard-orders-card-item-delivery">Estimated Delivery</div>
              <div className="profile-dashboard-orders-card-item-date">{item.card_arrival ? item.card_arrival : 'Unknown'}</div>
              <div className="profile-dashboard-orders-card-item-image">
                <img src={item.recommendations ? item.recommendations ? `https://d3t0rtmhddz26.cloudfront.net/thumbnails/${item.recommendations[0].image_name}` : `/media/orders-placeholder.jpeg` : `/media/orders-placeholder.jpeg`} className="profile-dashboard-orders-card-item-image-front"></img>
                <img src={item.recommendations ? item.recommendations ? `https://d3t0rtmhddz26.cloudfront.net/thumbnails/${item.recommendations[1].image_name}` : `/media/orders-placeholder.jpeg` : `/media/orders-placeholder.jpeg`} className="profile-dashboard-orders-card-item-image-inside"></img>
              </div>
              <div className="profile-dashboard-orders-card-item-ordered">Ordered: {formatDate(item.createdAt)}</div>
            </div>
            : 
            null
        )
        }
      </div>
      }
    </div>
  )
}

export default Orders
