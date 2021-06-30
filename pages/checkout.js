import Nav from '../components/nav'
import Footer from '../components/footer'
import {useEffect, useState} from 'react'
import withUser from './withUser'
import axios from 'axios'
import {API} from '../config'
import {useRouter} from 'next/router'

const Checkout = ({newUser}) => {
  const router = useRouter()

  const quizProgressNav = (e, next) => {
    window.localStorage.setItem('quiz_question', next)
    router.push('/quiz')
  }

  useEffect( async () => {
    let recipientData = new Object()

    recipientData.recipient = window.localStorage.getItem('recipient')
    recipientData.age = window.localStorage.getItem('age')
    recipientData.event = window.localStorage.getItem('event')
    recipientData.rank = JSON.parse(window.localStorage.getItem('rank'))
    recipientData.tags = JSON.parse(window.localStorage.getItem('tags'))
    recipientData.avoid = window.localStorage.getItem('avoid')
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
          </div>
          <div className="checkout-container-right"></div>
        </div>
        
        </div>
      <Footer></Footer>
    </>
  )
}

export default withUser(Checkout)
