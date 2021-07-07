import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

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


const CheckOutForm = ({}) => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <>
      <CardElement className="checkout-container-left-form" options={CARD_ELEMENT_OPTIONS} />
      <button className="checkout-container-button" disabled={!stripe}>Confirm</button>
    </>
  )
}

export default CheckOutForm
