import Nav from '../components/nav'
import NavMobile from '../components/navMobile'
import Footer from '../components/footer'
import withUser from './withUser'
import {API} from "../config"
import axios from 'axios'
import {useEffect} from 'react'

const Confirmation = ({newUser, order}) => {

  useEffect(() => {
    console.log(order)
    window.localStorage.clear();
  }, [])
  
  return (
    <>
    <Nav loggedIn={newUser} color={'white'}></Nav>
    <NavMobile loggedIn={newUser} color={'white'}></NavMobile>
    <div className="confirmation">
      <div className="confirmation-title"><img src="/media/emojis/partying-face.png" alt="" /></div>
      <div className="confirmation-title">Congrats! Your order is complete.</div>
      <div className="confirmation-subtitle"><span>This is the only time you'll need to complete the quiz. For each additional recipient you can add the details right in your profile.</span></div>
      <div className="confirmation-order-container">
        <div className="confirmation-order-title">
          Order number: #{order.order}
        </div>
        <div className="confirmation-order-subtitle">
          You will receive an order confirmation email with the details of your order and a link to your profile to track its progress shortly.
        </div>
        <div className="confirmation-order-details-container">
          <div className="confirmation-order-details-billing">
            <div className="confirmation-order-details-billing-title">
              Payment Method
            </div>
            <div className="confirmation-order-details-billing-name">{order.cardholder_name}</div>
            <div className="confirmation-order-details-billing-address">{order.billing_address}</div>
            <div className="confirmation-order-details-billing-city">{order.billing_city}, {order.billing_state}</div>
            <div className="confirmation-order-details-billing-address">{order.billing_zip}</div>
            <div className="confirmation-order-details-billing-card"><strong>Billing to:</strong> CARD XXX-{order.last4}</div>
          </div>
          <div className="confirmation-order-details-billing ship_to">
            <div className="confirmation-order-details-billing-title">
              Ship to:
            </div>
            <div className="confirmation-order-details-billing-name">{order.shipping_name}</div>
            <div className="confirmation-order-details-billing-address">{order.shipping_address}</div>
            <div className="confirmation-order-details-billing-city">{order.shipping_city}, {order.shipping_state}</div>
            <div className="confirmation-order-details-billing-address">{order.shipping_zip}</div>
          </div>
        </div>
        <div className="confirmation-order-summary-container">
          <div className="confirmation-order-summary-billing">
            <div className="confirmation-order-summary-billing-title">
              Summary
            </div>
            <div className="confirmation-order-summary-billing-event">
              <span>{order.event} Day (x{order.package_quantity})</span>
              <span>${order.package_price}</span>
            </div>
            <div className="confirmation-order-summary-billing-tax">
              <span>Sales Tax</span>
              <span>{((order.tax * 100 / 100).toFixed(4) * 100).toFixed(2)} %</span>
            </div>
            <div className="confirmation-order-summary-billing-total">
              <span>Total</span>
              <span>${Math.ceil(order.amount * 100) / 100}</span>
            </div>
          </div>
          <div className="confirmation-order-summary-package">
            <div className="confirmation-order-summary-package-title">
              Package: {order.package_plan.replace(/_/g, ' ')}
            </div>
            <div className="confirmation-order-summary-package-delivery">
            📩  <span>Estimated arrival date: {order.delivery_date} </span>
            </div>
          </div>
        </div>
        <div className="recipient-modal-plan-box-checkout-button w-50">
          <button onClick={() => window.location.href = `/account/${order.user_id}`}><span>Go to your profile</span></button>
        </div>
        <div className="confirmation-subtitle-mobile"><span>This is the only time you'll need to complete the quiz. For each additional recipient you can add the details right in your profile.</span></div>
      </div>
    </div>
    <Footer></Footer>
    </>
  )
}

Confirmation.getInitialProps = async ({query}) => {
  console.log(query)
  try {
    const responseSaveCard = await axios.post(`${API}/payment/save-card`, {future_use: query.id, id: query.transaction})
  } catch (error) {
    console.log(error)
    if(error) console.log(error)
  }

  let orderData = new Object()
  
  try {
    const responseTransaction = await axios.post(`${API}/payment/get-transaction`, {'id': query.transaction})
    orderData = responseTransaction.data
  } catch (error) {
    console.log(error)
  }

  // console.log(orderData)
  
  return {
    order: orderData
  }
}

export default withUser(Confirmation)
 