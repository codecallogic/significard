import SVG from '../../files/svgs'
import {useEffect, useState} from 'react'

const Orders = ({user, credits, recipients}) => {

  const [allRecipients, setAllRecipients] = useState(recipients)

  useEffect(() => {
    let recipientsArray = [...recipients]
    let cardsArray = []
    
    recipients.forEach((item) => {  
      item.cards.forEach((card) => {
        cardsArray.push(card)
      })
    })

    recipientsArray = [...recipientsArray, ...cardsArray]
    recipientsArray.sort((a, b) => a['card_arrival'] > b['card_arrival'] ? 1 : -1)
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
        <div className="profile-dashboard-orders-title-sent profile-dashboard-orders-title-sent-selected">Upcoming</div>
        <div className="profile-dashboard-orders-title-sent">Sent</div>
        {/* <div className="profile-dashboard-orders-title-sent">Order History</div> */}
      </div>
      <div className="profile-dashboard-orders-card">
      {allRecipients.length > 0 && allRecipients.map((item) => 
     
        <div className="profile-dashboard-orders-card-item">
          <div className="profile-dashboard-orders-card-item-name">{item.recipient_name ? item.recipient_name : 'Unknown'}</div>
          <div className="profile-dashboard-orders-card-item-event">{item.event ? item.event : item.event_other ? item.event_other : 'Unknown event'}</div>
          <div className="profile-dashboard-orders-card-item-delivery">Estimated Delivery</div>
          <div className="profile-dashboard-orders-card-item-date">{item.card_arrival ? item.card_arrival : 'Unknown'}</div>
          <div className="profile-dashboard-orders-card-item-image">
            <img src={`/media/orders-placeholder.jpeg`}className="profile-dashboard-orders-card-item-image-front"></img>
            <img src={`/media/orders-placeholder.jpeg`}className="profile-dashboard-orders-card-item-image-inside"></img>
          </div>
          <div className="profile-dashboard-orders-card-item-ordered">Ordered: {formatDate(item.createdAt)}</div>
        </div>
      )
      }
      {/* {allRecipients.length > 0 && allRecipients.map((item) => 
        item.cards.length > 0 && item.cards.map((card) => 
        // console.log(card)
        <div className="profile-dashboard-orders-card-item">
          <div className="profile-dashboard-orders-card-item-name">{item.recipient_name ? item.recipient_name : 'Unknown'}</div>
          <div className="profile-dashboard-orders-card-item-event">{card.event ? card.event : card.event_other ? card.event_other : 'Unknown event'}</div>
          <div className="profile-dashboard-orders-card-item-delivery">Estimated Delivery</div>
          <div className="profile-dashboard-orders-card-item-date">{card.card_arrival ? card.card_arrival : 'Unknown'}</div>
          <div className="profile-dashboard-orders-card-item-image">
            <img src={`/media/orders-placeholder.jpeg`}className="profile-dashboard-orders-card-item-image-front"></img>
            <img src={`/media/orders-placeholder.jpeg`}className="profile-dashboard-orders-card-item-image-inside"></img>
          </div>
          <div className="profile-dashboard-orders-card-item-ordered">Ordered: {formatDate(card.createdAt)}</div>
        </div>
      )
      )
      } */}
      </div>
    </div>
  )
}

export default Orders
