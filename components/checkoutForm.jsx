import React, {useEffect, useState} from 'react';
import {useStripe, useElements, CardElement, CardNumberElement} from '@stripe/react-stripe-js';
import axios from 'axios'
import {API} from '../config'

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


const CheckOutForm = ({user, address_one, city, state, amount, cardholder}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')

  const handleCardPayment = async (e) => {
    e.preventDefault()

    if(!stripe || !elements){
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    setLoading(true)
    setMessage('')

    if(!cardholder){setMessage('Cardholder name is empty'); setLoading(false); return}

    const cardElement = elements.getElement(CardElement)

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {email: user.email}
      // billing_details: {email: user.email, address: {line1: address_one, city: city, state: state}}
    })

    if(error){
      console.log('error', error)
      if(error) error.code ? setMessage('Invalid information') : setMessage('We are having trouble validating your card information')
      setLoading(false)
    }else {
      try {
        const responsePayment = await axios.post(`${API}/payment/checkout`, {'payment_method': paymentMethod.id, 'email': user.email, 'amount': amount, 'name': user.username})

        const {client_secret, status} = responsePayment.data

        if(status === 'requires_payment_method'){
          try {
            const result = await stripe.confirmCardPayment(client_secret, {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                  email: user.email
                },
              }
            })
            setLoading(false)
            if(result.error) setMessage(`${result.error.message}. For ${result.error.decline_code}`)
            setSuccess('Payment was made')
          } catch (error) {
            setLoading(false)
            if(error) setMessage('An error occurred while processing your card. Try again in a little bit.')
            console.log(error)
          }
        }
        
      } catch (error) {
        console.log(error.response)
        if(error) error.response ? setMessage(error.response.data) : setMessage('An error occurred while processing your card. Try again in a little bit.')
        setLoading(false)
      }
    }

    
  }

  return (
    <>
      <CardElement className="checkout-container-left-form" options={CARD_ELEMENT_OPTIONS} />
      <div className="checkout-container-button-container">
        <button className="checkout-container-button" disabled={!stripe} onClick={handleCardPayment}>Confirm</button>
        {loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading" allowFullScreen></iframe> : null }
      </div>
      {message && <span className="checkout-container-left-message">{message}</span>}
      {success && <span className="checkout-container-left-success"><svg><use xlinkHref="sprite.svg#icon-checkmark"></use></svg>{success}</span>}
    </>
  )
}

export default CheckOutForm
