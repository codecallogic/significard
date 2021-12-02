import SVG from '../../files/svgs'

const Orders = ({user, credits}) => {
  console.log(user)
  return (
    <div className="profile-dashboard-orders">
      <div className="profile-dashboard-recipients-edit-title-credits"><span>&nbsp;</span> You have {credits ? credits : '0'} cards</div>
      <div className="profile-dashboard-orders-title">
        <div className="profile-dashboard-orders-title-sent profile-dashboard-orders-title-sent-selected">Upcoming</div>
        <div className="profile-dashboard-orders-title-sent">Sent</div>
        {/* <div className="profile-dashboard-orders-title-sent">Order History</div> */}
      </div>
      <div className="profile-dashboard-orders-card">
      {user.recipients.length > 0 && user.recipients.map((item) => 
     
        <div className="profile-dashboard-orders-card-item">
          <div className="profile-dashboard-orders-card-item-name">{item.recipient_name ? item.recipient_name : 'Unknown'}</div>
          <div className="profile-dashboard-orders-card-item-event">{item.event ? item.event : item.event_other ? item.event_other : 'Unknown event'}</div>
          <div className="profile-dashboard-orders-card-item-delivery">Estimated Delivery</div>
          <div className="profile-dashboard-orders-card-item-date">{item.card_arrival ? item.card_arrival : 'Unknown'}</div>
          <div className="profile-dashboard-orders-card-item-image">
            <img src={`https://via.placeholder.com/150C/O https://placeholder.com/`}className="profile-dashboard-orders-card-item-image-front"></img>
            <img src={`https://via.placeholder.com/150C/O https://placeholder.com/`}className="profile-dashboard-orders-card-item-image-inside"></img>
          </div>
        </div>
      )
      }
      </div>
    </div>
  )
}

export default Orders
