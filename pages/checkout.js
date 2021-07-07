import Nav from '../components/nav'
import Footer from '../components/footer'
import {useEffect, useState} from 'react'
import withUser from './withUser'
import axios from 'axios'
import {API} from '../config'
import {useRouter} from 'next/router'

// STRIPE
import {Elements, CardElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckOutForm from '../components/checkoutForm'

const stripePromise = loadStripe("pk_test_51J7NJWAFcPAVZmVLGQUNzfzOeZvL0kkT5nVkJPphZmV16Lqk9Q3tD0iijyXWVehFvCqRjGecfYgKsSmcXk1a5Exg00IVaeKVy0")

const Checkout = ({newUser}) => {
  const router = useRouter()

  const [recipient, setRecipient] = useState([])

  const quizProgressNav = (e, next) => {
    window.localStorage.setItem('quiz_question', next)
    window.location.href = '/quiz'
  }

  useEffect( async () => {
    let recipientData = new Object()

    recipientData.recipient = window.localStorage.getItem('recipient')
    recipientData.age = window.localStorage.getItem('age')
    recipientData.event = window.localStorage.getItem('event')
    recipientData.rank = JSON.parse(window.localStorage.getItem('rank'))
    recipientData.tags = JSON.parse(window.localStorage.getItem('tags'))
    recipientData.other = window.localStorage.getItem('other')
    recipientData.involvement = window.localStorage.getItem('involvement')
    recipientData.package_plan = window.localStorage.getItem('package_plan')
    recipientData.name = window.localStorage.getItem('name')
    recipientData.address_one = window.localStorage.getItem('address_one')
    recipientData.city = window.localStorage.getItem('city')
    recipientData.state = window.localStorage.getItem('state')
    recipientData.zip_code = window.localStorage.getItem('zip_code')
    recipientData.nickname = window.localStorage.getItem('nickname')
    recipientData.message = window.localStorage.getItem('message')
    recipientData.signature = window.localStorage.getItem('signature')
    recipientData.description = window.localStorage.getItem('description')
    recipientData.quiz_session = window.localStorage.getItem('quiz_session')
      
    setRecipient(recipientData)

    try {
      const responseRecipient = await axios.post(`${API}/recipient/quiz`, {newUser, recipientData})
      console.log(responseRecipient)
    } catch (error) {
      console.log(error)
    }

  }, [])
  
  return (
    <>
      <Nav></Nav>
      <div className="checkout">
        <div className="checkout-back" onClick={(e) => quizProgressNav(e, 'description')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
        </div>
        <div className="quiz-title">Payment Method</div>
        <div className="quiz-title-mobile">Payment Method</div>
        <div className="quiz-subtitle">Select one.</div>
        <div className="quiz-subtitle-mobile">Select one.</div>

        <div className="checkout-container">
          <div className="checkout-container-left">
            <div className="checkout-container-left-title">Payment Method</div>
            <div className="checkout-container-left-subtitle">What's your payment method?</div>
            <Elements stripe={stripePromise}>
              <CheckOutForm></CheckOutForm>
            </Elements>
          </div>
          <div className="checkout-container-right">
            <div className="checkout-container-right-package">Package: {recipient.package_plan ? recipient.package_plan : ''} </div>
            <div className="checkout-container-right-delivery">📩 <span>Estimated arrival date: May 8, 2021</span></div>
            <div className="checkout-container-right-price"><span>{recipient.event ? recipient.event : ''}</span><span>{recipient.package_plan == 'standard' ? '$8.99' : '10.99' }</span></div>
            <div className="checkout-container-right-price"><span>Sales Tax</span><span>$0.84</span></div>
          </div>
        </div>
        
        </div>
      <Footer></Footer>
    </>
  )
}

export default withUser(Checkout)
