import SVG from '../../files/svgs'

const Orders = ({credits}) => {
  
  return (
    <div className="profile-dashboard-orders">
      <div className="profile-dashboard-recipients-edit-title-credits"><span>&nbsp;</span> You have {credits ? credits : '0'} credits</div>
      <div className="profile-dashboard-orders-title">
        <div className="profile-dashboard-orders-title-sent profile-dashboard-orders-title-sent-selected">Upcoming</div>
        <div className="profile-dashboard-orders-title-sent">Sent</div>
        <div className="profile-dashboard-orders-title-sent">Order History</div>
      </div>
      <div className="profile-dashboard-orders-card">
        <div className="profile-dashboard-orders-card-item">
          <div className="profile-dashboard-orders-card-item-name">Susan Smith</div>
          <div className="profile-dashboard-orders-card-item-event">Susan Smith</div>
          <div className="profile-dashboard-orders-card-item-delivery">Estimated Delivery</div>
          <div className="profile-dashboard-orders-card-item-date">Dec 25, 2020</div>
          <div className="profile-dashboard-orders-card-item-image">
            <img src={`/media/cards/card-left.png`}className="profile-dashboard-orders-card-item-image-front"></img>
            <img src={`/media/cards/card-right.png`}className="profile-dashboard-orders-card-item-image-inside"></img>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
