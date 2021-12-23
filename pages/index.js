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
    <Nav loggedIn={loggedIn} color={'#DBF667'}></Nav>
    <NavMobile loggedIn={loggedIn} color={'#DBF667'}></NavMobile>
    <div className="home-header">
      {/* <div className="home-header-image" style={{backgroundImage: `url("/media/background/header_1.png")`}}> </div> */}
      <img className="home-header-image" src="/media/homepage/header_1.png" alt="" />
      <div className="home-header-container">
        <div className="home-header-title-container">
          <div className="home-header-title">
            Celebrate the moments worth holding on to.
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
            <span>Tell us about your greeting card needs. Please keep in mind that all cards need to be ordered 3 weeks prior to the arrival date.</span>
          </div>
        </div>
        <div className="home-section_2-item">
          <div className="home-section_2-item-image-container"><img src="/media/homepage/section_2_2.png" alt="" className="home-section_2-item-image" /></div>
          <div className="home-section_2-item-description">
            <div className="home-section_2-item-description-title">Approve & Pay</div>
            <span>We'll email you your order and card details. You'll receive a digital image of your card at least 10 days prior to the arrival date.</span>
          </div>
        </div>
        <div className="home-section_2-item">
          <div className="home-section_2-item-image-container"><img src="/media/homepage/section_2_3.png" alt="" className="home-section_2-item-image" /></div>
          <div className="home-section_2-item-description">
            <div className="home-section_2-item-description-title">We'll Mail Your Contacts</div>
            <span>We’ll deliver cards directly to you or your recipient, so you can sit back and relax!</span>
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
            Ordered a card for my girlfriend. The staff were very friendly and got back to me quickly with questions to make the card. Even though I ordered last minute they were able to finish everything quickly and got it there in time for her birthday! She loved the card since it was her favorite bird cursom drawn! 10/10 will order again.
            <div className="home-section_4-item-review-bottom-container">
              <div className="home-section_4-item-review-bottom"></div>
            </div>
          </div>
          <div className="home-section_4-item-image">
            <img src="/media/homepage/review_1.png" alt="" />
          </div>
          <div className="home-section_4-item-name">Andrey Shilo</div>
        </div>
        <div className="home-section_4-item">
          <div className="home-section_4-item-review">
            I asked for a handmade card for my good friend in college. My friend loved her card! We had an amazing, socially distant, surprise birthday party for her. I highly recommend getting a card from Significard!! I am also getting one for my amazing aunt and I can’t wait for it to come in the mail!
            <div className="home-section_4-item-review-bottom-container">
              <div className="home-section_4-item-review-bottom"></div>
            </div>
          </div>
          <div className="home-section_4-item-image">
            <img src="/media/homepage/review_2.png" alt="" />
          </div>
          <div className="home-section_4-item-name">Andrey Shilo</div>
        </div>
        <div className="home-section_4-item">
          <div className="home-section_4-item-review">
            I needed a card you can’t find in stores. Significard offers the customizations and added touch of sentiment I knew my friend would appreciate. The wow factor is undeniable and it’s definitely a card people will keep forever. 10/10 would recommend!
            <div className="home-section_4-item-review-bottom-container">
              <div className="home-section_4-item-review-bottom"></div>
            </div>
          </div>
          <div className="home-section_4-item-image">
            <img src="/media/homepage/review_3.png" alt="" />
          </div>
          <div className="home-section_4-item-name">Andrey Shilo</div>
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
