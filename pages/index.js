import {useEffect} from 'react'
import {connect} from 'react-redux'
import firebase from 'firebase'
import {initializeFirebase} from '../helpers/firebase'
import axios from 'axios'
import {API} from '../config'
import Nav from '../components/nav'
import NavMobile from '../components/navMobile'
import Slider from '../components/slider/homepage_slider'
import Footer from '../components/footer'
import checkUser from './checkUser'
import ReactGA from 'react-ga'

initializeFirebase()

const Home = ({loggedIn, user, userUpdate}) => {
  // console.log(loggedIn)

  useEffect(() => {
    ReactGA.pageview('/')
  }, [])

  const handleEventAnalytics = (type) => {
    if(type == 'header'){
      ReactGA.event({
        category: 'Button',
        action: 'Get started button on header homepage'
      })
    }

    if(type == 'section_2_homepage'){
      ReactGA.event({
        category: 'Button',
        action: 'Get started button on how it works section homepage'
      })
    }
  }
  
  return (
    <div className="home">
    <Nav loggedIn={loggedIn} color={'#003E5F'}></Nav>
    <NavMobile loggedIn={loggedIn} color={'#003E5F'}></NavMobile>
    <div className="home-header">
      {/* <div className="home-header-image" style={{backgroundImage: `url("/media/background/header_1.png")`}}> </div> */}
      <img className="home-header-image" src="/media/homepage/header_2.png" alt="" />
      <div className="home-header-container">
        <div className="home-header-title-container">
          <div className="home-header-title">
            Personalized Greeting Cards
          </div>

          <div className="home-header-subtitle">
            Subscribe now and let our artists find you a card that actually relates!
          </div>
          <div className="home-header-button" onClick={() => (handleEventAnalytics('header'), loggedIn ?window.location.href = `/account/${loggedIn.id}` : window.location.href = '/quiz')}>
            Get Started
          </div>
        </div>
        <div className="home-header-card-container">
          <img className="home-header-card-card_1"src="/media/homepage/header_card_3.png" alt="" />
          <img className="home-header-card-card_2"src="/media/homepage/header_card_2.png" alt="" />
        </div>
      </div>
    </div>
    <div className="home-section_2">
      <div className="home-section_2-title">How it works</div>
      <div className="home-section_2-container">
        <div className="home-section_2-item">
          <div className="home-section_2-item-image-container"><img src="/media/homepage/section_2_1.png" alt="" className="home-section_2-item-image" /></div>
          <div className="home-section_2-item-description">
            <div className="home-section_2-item-description-title">Take A Short Quiz</div>
            <span>Take our short quiz to select your 1st card for your 1st recipient (at least 2 weeks before the desired delivery date).</span>
          </div>
        </div>
        <div className="home-section_2-item">
          <div className="home-section_2-item-image-container"><img src="/media/homepage/section_2_2.png" alt="" className="home-section_2-item-image" /></div>
          <div className="home-section_2-item-description">
            <div className="home-section_2-item-description-title">Approve & Pay</div>
            <span>Select the payment plan based on how many cards you’d like to send throughout the year to ALL your recipients for their birthdays, holidays, etc.</span>
          </div>
        </div>
        <div className="home-section_2-item">
          <div className="home-section_2-item-image-container"><img src="/media/homepage/section_2_3.png" alt="" className="home-section_2-item-image" /></div>
          <div className="home-section_2-item-description">
            <div className="home-section_2-item-description-title">We'll Mail Your Contacts</div>
            <span>Our technology will match you with the best card for each occasion and mail it to you or your recipient. As an option, our artists can handwrite a message for you. </span>
          </div>
        </div>
      </div>
      <div className="home-section_2-button-container"><div className="home-section_2-button" onClick={() => (handleEventAnalytics('section_2_homepage'), loggedIn ? window.location.href = `/account/${loggedIn.id}` : window.location.href = '/quiz')}>Get Started</div></div>
    </div>
    <div className="home-section_3">
      <Slider></Slider>
    </div>
    <div className="home-section_4">
      <div className="home-section_4-title">Customer Reviews</div>
      <div className="home-section_4-container">
        <div className="home-section_4-item">
          <div className="home-section_4-item-review">
            <span>My girlfriend loves the cards she’s been receiving! I signed up so that I won’t forget to give her a card for her birthday, Valentine’s day, and Christmas. The first card was so on point! They picked the card with the design of her favorite bird, and all I had to do was to mention her favorite themes & preferences in the quiz. 10/10 recommend this subscription service! </span>
            <div className="home-section_4-item-review-bottom-container">
              <div className="home-section_4-item-review-bottom"></div>
            </div>
          </div>
          <div className="home-section_4-item-image">
            <img src="/media/homepage/review_1.png" alt="" />
          </div>
          <div className="home-section_4-item-name">Andrey S</div>
        </div>
        <div className="home-section_4-item">
          <div className="home-section_4-item-review">
            <span> I signed up for a subscription and ordered the 1st card for my good friend in college. My friend loved it! We had an amazing, socially distant, surprise birthday party for her. I highly recommend getting cards from Significard!! The next one I am supposed to receive is for my amazing aunt and I can’t wait for it to come in the mail!</span>
            <div className="home-section_4-item-review-bottom-container">
              <div className="home-section_4-item-review-bottom"></div>
            </div>
          </div>
          <div className="home-section_4-item-image">
            <img src="/media/homepage/review_2.png" alt="" />
          </div>
          <div className="home-section_4-item-name">Fiki H</div>
        </div>
        <div className="home-section_4-item">
          <div className="home-section_4-item-review">
            <span> I used to always miss someone’s birthday and shopping for cards has been a hassle for me, Significard has changed that! Nowadays, not only does it save me a trip to a store and time/stress picking out the right card, it also sends me reminders of the upcoming occasions, so my family and friends have been impressed by how thoughtful I have become :) THANK YOU, Significard! </span>
            <div className="home-section_4-item-review-bottom-container">
              <div className="home-section_4-item-review-bottom"></div>
            </div>
          </div>
          <div className="home-section_4-item-image">
            <img src="/media/homepage/review_4.png" alt="" />
          </div>
          <div className="home-section_4-item-name">Steve R</div>
        </div>
      </div>
    </div>
    <Footer loggedIn={loggedIn}></Footer>
    {/* <div className="home">
      <div>Welcome, {user.userName ? user.userName : user.userEmail}</div>
      {user.userName ? <a className="home-logout" onClick={signOut}>Logout</a> : <a href="/login"> Login</a>}
    </div> */}
    </div>
  )
}

const mapStateToProps = state => {
  return {
      user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
      userUpdate: (user) => dispatch({type: 'USER', payload: user})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(checkUser(Home))
