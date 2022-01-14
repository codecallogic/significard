import React, {useEffect, useState} from 'react';
import {useStripe, useElements, CardElement, CardNumberElement} from '@stripe/react-stripe-js';
import axios from 'axios'
import {API} from '../config'
import ReactGA from 'react-ga'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckOutForm = ({user, address, city, state, zip_code, delivery, amount, cardholder, package_price, tax, taxID, recipient, subscription, phone, message, setMessage}) => {
  const stripe = useStripe();
  const elements = useElements();
  // console.log(recipient)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleCardPayment = async (e) => {
    e.preventDefault()
    setMessage('')
    if(phone.length < 14) return setMessage('Invalid phone number')
    if(user){
    if(!stripe || !elements){
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    setLoading(true)

    if(!cardholder){setMessage('Cardholder field is empty'); setLoading(false); return}
    if(!address){setMessage('Address field is empty'); setLoading(false); return}
    if(!city){setMessage('City field is empty'); setLoading(false); return}
    if(!zip_code){setMessage('Zip code field is empty'); setLoading(false); return}
    if(!/^\d{5}(-\d{4})?$/.test(zip_code)){setLoading(false); setMessage('Zip code is invalid'); return }

    const cardElement = elements.getElement(CardElement)

    let error
    let paymentMethod
    
    try {
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {name: cardholder, email: user.email, address: {line1: address, city: city, postal_code: zip_code}}
      })

      error = result.error
      paymentMethod = result.paymentMethod
      
    } catch (error) {
      setLoading(false)
      console.log('PAYMENT METHOD ERROR', error)
      if(error) error.response ? setMessage(error.response.data) : setMessage('An error occurred submitting your information, please try again later')
    }    

    if(error){
      console.log(error)
      setLoading(false)
      if(error) return error.message ? setMessage(error.message) : setMessage('We are having trouble validating your card information')
    }else {
      try {
        
        let orderNumber = Math.floor(100000000 + Math.random() * 900000000)
        // console.log(paymentMethod)
        const responsePayment = await axios.post(`${API}/payment/checkout`, {'payment_method': paymentMethod.id, 'email': user.email, 'amount': amount, 'name': user.username, 'order': orderNumber, 'cardholder_name': cardholder, 'billing_address': address, 'billing_city': city, 'billing_state': state, 'billing_zip': zip_code, 'shipping_name': recipient.name, 'shipping_address': recipient.address_one, 'shipping_city': recipient.city, 'shipping_state': recipient.state, 'shipping_zip': recipient.zip_code, 'event': recipient.event, 'package_price': package_price, 'tax': tax, 'taxID': taxID, 'package_plan': recipient.package_plan, 'package_quantity': recipient.package_quantity, 'delivery_date': delivery, 'last4': paymentMethod.card.last4, 'user': user, 'subscription': subscription, 'phone': phone, 'recipient_name': recipient.recipient_name})
        
        const {client_secret, status, payment_id, order} = responsePayment.data

        if(status === 'requires_payment_method'){
          try {
            const result = await stripe.confirmCardPayment(client_secret, {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {name: cardholder, email: user.email, address: {line1: address, city: city, postal_code: zip_code}}
              },
              setup_future_usage: 'off_session'
            })
            if(result.error){ setLoading(false); console.log('CONFIRM CARD PAYMENT ERROR', result.error)}
            if(result.error) return setMessage(`${result.error.message}. For ${result.error.decline_code}`)
            
            const responseRecipient = await axios.post(`${API}/recipient/quiz`, {user, recipient})
            const responseSaveTransaction = await axios.post(`${API}/payment/save-transaction`, {'payment_method': paymentMethod.id, 'email': user.email, 'amount': amount, 'name': user.username, 'order': orderNumber, 'cardholder_name': cardholder, 'billing_address': address, 'billing_city': city, 'billing_state': state, 'billing_zip': zip_code, 'shipping_name': recipient.name, 'shipping_address': recipient.address_one, 'shipping_city': recipient.city, 'shipping_state': recipient.state, 'shipping_zip': recipient.zip_code, 'event': recipient.event, 'package_price': package_price, 'tax': tax, 'taxID': taxID, 'package_plan': recipient.package_plan, 'package_quantity': recipient.package_quantity, 'delivery_date': delivery, 'last4': paymentMethod.card.last4, 'user': user, 'subscription': subscription, 'phone': phone, 'recipient_name': recipient.recipient_name})
            
            window.localStorage.removeItem('recipient')
            window.location.href = `/${orderNumber}?id=${result.paymentIntent.id}`

          } catch (error) {
            setLoading(false)
            console.log('REQUIRES_PAYMENT_METHOD', error)
            if(error) return setMessage('An error occurred while processing your card. Please try again later.')
          }
        }

        if(status === 'requires_action'){
          try {
            const result = await stripe.confirmCardPayment(client_secret)
            if(result.error){ setLoading(false); console.log('CONFIRM CARD PAYMENT ERROR', result.error)}
            if(result.error) return setMessage(`${result.error.message}. For ${result.error.decline_code}`)
           

            const responseRecipient = await axios.post(`${API}/recipient/quiz`, {user, recipient})
            const responseSaveTransaction = await axios.post(`${API}/payment/save-transaction`, {'payment_method': paymentMethod.id, 'email': user.email, 'amount': amount, 'name': user.username, 'order': orderNumber, 'cardholder_name': cardholder, 'billing_address': address, 'billing_city': city, 'billing_state': state, 'billing_zip': zip_code, 'shipping_name': recipient.name, 'shipping_address': recipient.address_one, 'shipping_city': recipient.city, 'shipping_state': recipient.state, 'shipping_zip': recipient.zip_code, 'event': recipient.event, 'package_price': package_price, 'tax': tax, 'taxID': taxID, 'package_plan': recipient.package_plan, 'package_quantity': recipient.package_quantity, 'delivery_date': delivery, 'last4': paymentMethod.card.last4, 'user': user, 'subscription': subscription, 'phone': phone, 'recipient_name': recipient.recipient_name})

            window.localStorage.removeItem('recipient')
            window.location.href = `/${orderNumber}?id=${result.paymentIntent.id}`
            
          } catch (error) {
            setLoading(false)
            console.log('REQUIRES_ACTION', error)
            if(error) return setMessage('An error occurred while processing your card. Please try again later.')
          }
         
        }

        if(status === 'succeeded'){
          try {
            const responseRecipient = await axios.post(`${API}/recipient/quiz`, {user, recipient})
            const responseSaveTransaction = await axios.post(`${API}/payment/save-transaction`, {'payment_method': paymentMethod.id, 'email': user.email, 'amount': amount, 'name': user.username, 'order': orderNumber, 'cardholder_name': cardholder, 'billing_address': address, 'billing_city': city, 'billing_state': state, 'billing_zip': zip_code, 'shipping_name': recipient.name, 'shipping_address': recipient.address_one, 'shipping_city': recipient.city, 'shipping_state': recipient.state, 'shipping_zip': recipient.zip_code, 'event': recipient.event, 'package_price': package_price, 'tax': tax, 'taxID': taxID, 'package_plan': recipient.package_plan, 'package_quantity': recipient.package_quantity, 'delivery_date': delivery, 'last4': paymentMethod.card.last4, 'user': user, 'subscription': subscription, 'phone': phone, 'recipient_name': recipient.recipient_name})
            
            window.localStorage.removeItem('recipient')
            window.location.href = `/${orderNumber}?id=${payment_id}`

          } catch (error) {
            setLoading(false)
            console.log('ERROR SAVING RECIPIENT OR TRANSACTION', error)
            if(error) return setMessage(`You have been charged but theres was issue processing your order ${orderNumber}. Please contact support.`)
          }
        }
        
      } catch (error) {
        setLoading(false)
        console.log(error)
        console.log('PAYMENT CONFIRMATION ERROR', error)
        if(error) error.response ? setMessage(error.response.data) : setMessage('An error occurred submitting your information, please try again later')
      }
    }
    }
  }

  const handleEventAnalytics = (type) => {
    if(type == 'confirm'){
      ReactGA.event({
        category: 'Button',
        action: 'Confirm payment clicked in checkout page'
      })
    }
  }

  return (
    <>
      <CardElement className="checkout-container-left-form" options={CARD_ELEMENT_OPTIONS}/>
      <div className="checkout-container-left-updates">
        {/* <div className="checkout-container-left-updates-title">Order Updates</div>
        <div className="checkout-container-left-updates-subtitle">You'll get order updates by email.</div>
        <div className="checkout-container-left-updates-subtitle-two">Get order updates by text</div> */}
        {/* <div className="form-group-double mail checkout-group-double">
          <input id="phoneNumber" type="text" placeholder="Mobile Phone Number" value={phone} onChange={ (e) => e.target.value.length < 15 ? (validateIsNumber('phoneNumber'), setPhone(e.target.value), validateIsPhoneNumber('phoneNumber')) : null} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Mobile Phone Number'} required/>
        </div> */}
        {/* <div className="checkout-container-left-updates-subtitle-three">To make the process easier, please add your phone number.</div> */}
      </div>
      <div className="checkout-container-button-container">
        <button className="checkout-container-button" disabled={!stripe} onClick={(e) => (handleEventAnalytics('confirm'), handleCardPayment(e))}>{loading ? <div className="loading loading-primary loading-small"><span></span><span></span><span></span></div> : 'Confirm'}</button>
      </div>
      {message && <span className="checkout-container-left-message">{message}</span>}
      {success && <span className="checkout-container-left-success"><svg><use xlinkHref="sprite.svg#icon-checkmark"></use></svg>{success}</span>}
    </>
  )
}

export default CheckOutForm
