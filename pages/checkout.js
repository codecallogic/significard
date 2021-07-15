import Nav from '../components/nav'
import Footer from '../components/footer'
import {useEffect, useState} from 'react'
import withUser from './withUser'
import axios from 'axios'
import {API} from '../config'
import {useRouter} from 'next/router'
import PlacesAutocomplete from 'react-places-autocomplete'
import {connect } from 'react-redux'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

// STRIPE
import {Elements, CardElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckOutForm from '../components/checkoutForm'

const stripePromise = loadStripe("pk_test_51J7NJWAFcPAVZmVLGQUNzfzOeZvL0kkT5nVkJPphZmV16Lqk9Q3tD0iijyXWVehFvCqRjGecfYgKsSmcXk1a5Exg00IVaeKVy0")

const Checkout = ({newUser}) => {
  const router = useRouter()

  const [recipient, setRecipient] = useState([])
  const [package_price, setPackagePrice] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const [cardholder, setCardholder] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zip_code, setZipCode] = useState('')
  const [delivery, setDeliveryDate] = useState('')

  const quizProgressNav = (e, next) => {
    window.localStorage.setItem('quiz_question', next)
    window.location.href = '/quiz'
  }

  useEffect( async () => {
    let recipientData = new Object()

    if(window.localStorage.getItem('package_plan')){
      recipientData.recipient = window.localStorage.getItem('recipient')
      recipientData.age = window.localStorage.getItem('age')
      recipientData.event = window.localStorage.getItem('event')
      recipientData.rank = JSON.parse(window.localStorage.getItem('rank'))
      recipientData.tags = JSON.parse(window.localStorage.getItem('tags'))
      recipientData.other = window.localStorage.getItem('other')
      recipientData.involvement = window.localStorage.getItem('involvement')
      recipientData.package_plan = window.localStorage.getItem('package_plan')
      recipientData.mail_to = window.localStorage.getItem('mail_to')
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
    }

    if(!recipientData.recipient) return  (window.localStorage.setItem('quiz_question', 'recipient'), window.location.href = '/quiz')
    if(!recipientData.age) return  (window.localStorage.setItem('quiz_question', 'age'), window.location.href = '/quiz')
    if(!recipientData.event) return  (window.localStorage.setItem('quiz_question', 'events'), window.location.href = '/quiz')
    if(!recipientData.rank) return  (window.localStorage.setItem('quiz_question', 'ranking'), window.location.href = '/quiz')
    if(!recipientData.tags) return  (window.localStorage.setItem('quiz_question', 'tags'), window.location.href = '/quiz')
    if(!recipientData.other) return  (window.localStorage.setItem('quiz_question', 'other'), window.location.href = '/quiz')
    if(!recipientData.involvement) return  (window.localStorage.setItem('quiz_question', 'involvement'), window.location.href = '/quiz')
    if(!recipientData.package_plan) return  (window.localStorage.setItem('quiz_question', 'package'), window.location.href = '/quiz')
    if(!recipientData.mail_to) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')

    if(recipientData.mail_to == 'user' || recipientData.mail_to == 'recipient'){
      if(!recipientData.name) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
      if(!recipientData.address_one) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
      if(!recipientData.zip_code) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
      if(!recipientData.state) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
      if(!recipientData.city) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
    }

    if(!recipientData.nickname) return  (window.localStorage.setItem('quiz_question', 'message'), window.location.href = '/quiz')
    if(!recipientData.message) return  (window.localStorage.setItem('quiz_question', 'message'), window.location.href = '/quiz')
    if(!recipientData.signature) return  (window.localStorage.setItem('quiz_question', 'message'), window.location.href = '/quiz')
    if(!recipientData.description) return  (window.localStorage.setItem('quiz_question', 'description'), window.location.href = '/quiz')

    recipientData.package_plan === 'standard' ? (setPackagePrice(8.99), setTax(8.99 * .1)) : recipientData.package_plan == 'plantable' ? (setPackagePrice(10.99), setTax(10.99 * .1)) : null

    recipientData.package_plan === 'standard' ? setTotal(8.99 + 8.99 * .1) : recipientData.package_plan == 'plantable' ? setTotal(10.99 + 10.99 * .1): null

    let delivery = new Date(Date.now() + 12096e5)

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var month = monthNames[delivery.getUTCMonth()]
    var day = delivery.getUTCDate()
    var year = delivery.getUTCFullYear()

    setDeliveryDate(`${month} ${day}, ${year}`)
    setRecipient(recipientData)

    try {
      const responseRecipient = await axios.post(`${API}/recipient/quiz`, {newUser, recipientData})
      // console.log(responseRecipient)
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
        {/* <div className="quiz-subtitle">Select one.</div> */}
        {/* <div className="quiz-subtitle-mobile">Select one.</div> */}

        <div className="checkout-container">
          <div className="checkout-container-left">
            <div className="checkout-container-left-title">Payment Method</div>
            <div className="checkout-container-left-subtitle">What's your payment method?</div>
            <div className="checkout-group-container">
              <span className="form-group-single checkout-group margin-0">
                <input type="text" placeholder="Cardholder Name" value={cardholder} onChange={(e) => setCardholder(e.target.value)} required/>
              </span>
            </div>
            <PlacesAutocomplete value={address} onChange={(e) => setAddress(e)} onSelect={(e) => (setAddress(e.split(',')[0]), setCity(e.split(',')[1]))} searchOptions={searchOptionsAddress}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="form-group-single mail checkout-group form-autocomplete-container">
                  <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'Address'})} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address'} required/>
                  {loading ? <div>...loading</div> : null}
                  {suggestions.map((suggestion, idx) => {
                    const className = suggestion.active
                    ? 'form-autocomplete-suggestion-active_100'
                    : 'form-autocomplete-suggestion_100';
                    const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                    return <div  className="form-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}</div> 
                  })}
                </div>
              )}
            </PlacesAutocomplete>
            <PlacesAutocomplete value={city} onChange={(e) => setCity(e)} onSelect={(e) => setCity(e.split(',')[0])} searchOptions={searchOptionsCities}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="form-group-double mail checkout-group-double form-autocomplete-container_3">
                  <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'City'})} required/>
                  {loading ? <div>...loading</div> : null}
                  {suggestions.map((suggestion, idx) => {
                    const className = suggestion.active
                    ? 'form-autocomplete-suggestion-active_100'
                    : 'form-autocomplete-suggestion_100';
                    const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                    return <div  className="form-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}</div> 
                  })}
                </div>
              )}
            </PlacesAutocomplete>
            <div className="form-group-double mail checkout-group-double">
                <input type="text" placeholder="Zip Code" value={zip_code} onChange={ (e) => setZipCode(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Zip Code'} required/>
            </div>
            <Elements stripe={stripePromise}>
              <CheckOutForm user={newUser} amount={package_price + tax} cardholder={cardholder} address={address} city={city} zip_code={zip_code}></CheckOutForm>
            </Elements>
          </div>
          <div className="checkout-container-right">
            <div className="checkout-container-right-package">Package: {recipient.package_plan ? recipient.package_plan : ''} </div>
            <div className="checkout-container-right-delivery">📩 <span>Estimated arrival date: {delivery}</span></div>
            <div className="checkout-container-right-price"><span>{recipient.event ? recipient.event : ''}</span><span>{`$ ` + Math.ceil(package_price * 100) / 100}</span></div>
            <div className="checkout-container-right-tax"><span>Sales Tax</span><span>{`$ ` + Math.ceil(tax * 100) / 100}</span></div>
            <div className="checkout-container-right-total"><span>Total</span><span>{`$ ` + Math.ceil(total * 100) / 100}</span></div>
          </div>
        </div>
        
        </div>
      <Footer></Footer>
    </>
  )
}

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = dispath => {
 return {

 }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Checkout))
