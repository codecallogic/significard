import Nav from '../components/nav'
import Footer from '../components/footer'
import {useEffect, useState} from 'react'
import withUser from './withUser'
import axios from 'axios'
import {API} from '../config'
import {useRouter} from 'next/router'
import PlacesAutocomplete, {geocodeByPlaceId} from 'react-places-autocomplete'
import {usStates} from '../utils/quiz'
import {connect } from 'react-redux'
import store from 'store-js'

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
  const [state, setState] = useState('')
  const [zip_code, setZipCode] = useState('')
  const [delivery, setDeliveryDate] = useState('')
  const [state_list, setStateList] = useState(false)

  const quizProgressNav = (e, next) => {
    window.localStorage.setItem('quiz_question', next)
    window.location.href = '/quiz'
  }

  useEffect(() => {
    console.log(total)
  }, [total])

  useEffect( async () => {
    let recipientData = new Object()

    if(window.localStorage.getItem('package_plan')){
      recipientData.recipient = window.localStorage.getItem('recipient')
      recipientData.recipient_other = window.localStorage.getItem('recipient_other')
      recipientData.age = window.localStorage.getItem('age')
      recipientData.event = window.localStorage.getItem('event')
      recipientData.event_other = window.localStorage.getItem('event_other')
      recipientData.card_arrival = window.localStorage.getItem('card_arrival')
      recipientData.rank = JSON.parse(window.localStorage.getItem('rank'))
      recipientData.tags = JSON.parse(window.localStorage.getItem('tags'))
      recipientData.other = window.localStorage.getItem('other')
      recipientData.involvement = window.localStorage.getItem('involvement')
      recipientData.package_plan = window.localStorage.getItem('package_plan')
      recipientData.package_quantity = window.localStorage.getItem('package_quantity')
      recipientData.mail_to = window.localStorage.getItem('mail_to')
      recipientData.name = window.localStorage.getItem('name')
      recipientData.address_one = window.localStorage.getItem('address_one')
      recipientData.address_two = window.localStorage.getItem('address_two')
      recipientData.city = window.localStorage.getItem('city')
      recipientData.state = window.localStorage.getItem('state')
      recipientData.zip_code = window.localStorage.getItem('zip_code')
      recipientData.nickname = window.localStorage.getItem('nickname')
      recipientData.message = window.localStorage.getItem('message')
      recipientData.signature = window.localStorage.getItem('signature')
      recipientData.message_later = window.localStorage.getItem('message_later')
      recipientData.description = window.localStorage.getItem('description')
      recipientData.quiz_session = window.localStorage.getItem('quiz_session')
    }

    // console.log(store.get('user'))
    
    // console.log(recipientData)

    if(!recipientData.recipient){
      if(!recipientData.recipient_other){
        return  (window.localStorage.setItem('quiz_question', 'recipient'), window.location.href = '/quiz')
      }else{
        null
      }
    }


    if(!recipientData.age) return  (window.localStorage.setItem('quiz_question', 'age'), window.location.href = '/quiz')
    if(!recipientData.event) return  (window.localStorage.setItem('quiz_question', 'events'), window.location.href = '/quiz')
    if(recipientData.event == 'other' && !recipientData.event_other) return  (window.localStorage.setItem('quiz_question', 'events'), window.location.href = '/quiz')
    if(!recipientData.card_arrival) return  (window.localStorage.setItem('quiz_question', 'events'), window.location.href = '/quiz')
    if(!recipientData.rank) return  (window.localStorage.setItem('quiz_question', 'ranking'), window.location.href = '/quiz')
    if(!recipientData.tags) return  (window.localStorage.setItem('quiz_question', 'tags'), window.location.href = '/quiz')
    if(!recipientData.other) return  (window.localStorage.setItem('quiz_question', 'other'), window.location.href = '/quiz')
    if(!recipientData.involvement) return  (window.localStorage.setItem('quiz_question', 'involvement'), window.location.href = '/quiz')
    if(!recipientData.package_plan) return  (window.localStorage.setItem('quiz_question', 'package'), window.location.href = '/quiz')
    if(!recipientData.package_quantity) return  (window.localStorage.setItem('quiz_question', 'package'), window.location.href = '/quiz')
    if(!recipientData.mail_to) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')

    if(recipientData.mail_to == 'user' || recipientData.mail_to == 'recipient'){
      if(!recipientData.name) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
      if(!recipientData.address_one) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
      if(!recipientData.zip_code) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
      if(!recipientData.state) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
      if(!recipientData.city) return  (window.localStorage.setItem('quiz_question', 'mail'), window.location.href = '/quiz')
    }

    if(!recipientData.message_later){
      if(!recipientData.nickname) return  (window.localStorage.setItem('quiz_question', 'message'), window.location.href = '/quiz')
      if(!recipientData.message) return  (window.localStorage.setItem('quiz_question', 'message'), window.location.href = '/quiz')
      if(!recipientData.signature) return  (window.localStorage.setItem('quiz_question', 'message'), window.location.href = '/quiz')
    }
    if(!recipientData.description) return  (window.localStorage.setItem('quiz_question', 'description'), window.location.href = '/quiz')


    if(recipientData.package_plan === 'best deal')(setPackagePrice(6.99), setTax(6.99 * .1))

    if(recipientData.package_plan == 'better deal')(setPackagePrice(9.99), setTax(9.99 * .1))

    if(recipientData.package_plan == 'good deal')(setPackagePrice(11.99), setTax(11.99 * .1))

    recipientData.package_plan === 'best deal' ? setTotal((6.99 * recipientData.package_quantity) + (6.99 * recipientData.package_quantity * .1)) : null
    recipientData.package_plan === 'better deal' ? setTotal((9.99 * recipientData.package_quantity) + (9.99 * recipientData.package_quantity * .1)) : null
    recipientData.package_plan === 'good deal' ? setTotal((11.99 * recipientData.package_quantity) + (11.99 * recipientData.package_quantity * .1)) : null

    let result = null
    if(recipientData.package_quantity <= 4) result = 13.99
    if(recipientData.package_quantity > 4 ) result = 11.99
    if(recipientData.package_quantity > 9) result = 9.99
    if(recipientData.package_quantity > 19) result = 6.99
    
    if(recipientData.package_plan == 'custom')(setPackagePrice(result), setTax(result * .1))
    recipientData.package_plan === 'custom' ? setTotal((result * recipientData.package_quantity) + (result * recipientData.package_quantity * .1)) : null


    let delivery = new Date(Date.now() + 12096e5)

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var month = monthNames[delivery.getUTCMonth()]
    var day = delivery.getUTCDate()
    var year = delivery.getUTCFullYear()

    setDeliveryDate(`${month} ${day}, ${year}`)
    setRecipient(recipientData)

  }, [])

  const handleBillingAutoFill = () => {
    let el = document.getElementById('shipping_address')
    if(el.checked == false){
      setAddress(recipient.address_one)
      setCity(recipient.city)
      setZipCode(recipient.zip_code)
      setState(recipient.state)
    }

    if(el.checked == true){
      setAddress('')
      setCity('')
      setZipCode('')
      setState('')
    }
  }

  const handleZipCode = async (id) => {
    let geo
    
    if(id){
     geo = await geocodeByPlaceId(id)
    }

    if(geo){
      geo[0].address_components.forEach((item) => {
        if(item.types.includes('postal_code')){
          setZipCode(item.long_name)
        } 
      })
    }
  }
  
  return (
    <>
      <Nav></Nav>
      <div className="checkout">
        <div className="checkout-back" onClick={(e) => quizProgressNav(e, 'message')}>
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
            {recipient.mail_to == 'user' && 
            <div className="form-group-checkbox">
              <input type="checkbox" id="shipping_address"/>
              <label htmlFor="shipping_address" onClick={() => handleBillingAutoFill()}></label>
              <div className="form-group-checkbox-text">Same as shipping address</div>
            </div>
            }
            <div className="checkout-group-container">
              <span className="form-group-single checkout-group margin-0">
                <input type="text" placeholder="Cardholder Name" value={cardholder} onChange={(e) => setCardholder(e.target.value)} required/>
              </span>
            </div>
            <PlacesAutocomplete value={address} onChange={(e) => setAddress(e)} onSelect={(e) => (setAddress(e.split(',')[0]), setCity(e.split(',')[1]), setState(e.split(',')[2], handleZipCode(document.getElementById('address_place_id_checkout').value)))} searchOptions={searchOptionsAddress}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="form-group-single mail checkout-group form-autocomplete-container">
                  <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'Address'})} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address'} required/>
                  {loading ? <div>...loading</div> : null}
                  {suggestions.map((suggestion, idx) => {
                    const className = suggestion.active
                    ? 'form-autocomplete-suggestion-active_100'
                    : 'form-autocomplete-suggestion_100';
                    const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                    return <div  className="form-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}<input id="address_place_id_checkout" value={suggestion.placeId} readOnly/></div> 
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
            <div className="form-group-double mail checkout-group-single">
              <input type="text" placeholder="State" value={state} onChange={ (e) => setState(e.target.value)} onFocus={(e) => (e.target.placeholder = '', setStateList(true))} readOnly required/>
              {state_list && 
              <div className="form-group-single-dropdown-list">
                  <div className="form-group-double-dropdown-list-container">
                    {usStates.map( (item, idx) => (
                      <div className="form-group-double-dropdown-list-item" onClick={(e) => (setState(item.abbreviation), setStateList(false))} key={idx} >{item.name}</div>
                    ))
                    }
                  </div>
              </div>
              }
            </div>
            <Elements stripe={stripePromise}>
              <CheckOutForm user={newUser} amount={total} cardholder={cardholder} address={address} city={city} state={state} zip_code={zip_code} delivery={delivery} package_price={package_price} tax={tax} recipient={recipient}></CheckOutForm>
            </Elements>
          </div>
          <div className="checkout-container-right">
            <div className="checkout-container-right-package">Package: {recipient.package_plan ? recipient.package_plan : ''} </div>
            {recipient.mail_to == 'recipient' && <div className="checkout-container-right-ship_to">Ship to {recipient.recipient ? `${recipient.recipient}'s address` : recipient.recipient_other ? `${recipient.recipient_other}'s address`: ''} </div>}
            <div className="checkout-container-right-delivery">📩 <span>Estimated arrival date: {delivery}</span></div>
            <div className="checkout-container-right-price"><span>{recipient.event ? `${recipient.event} (${recipient.package_quantity}x)` : ''}</span><span>{`$ ` + Math.ceil(package_price * 100) / 100}</span></div>
            <div className="checkout-container-right-tax"><span>Sales Tax</span><span>{`$ ` + (Math.ceil(tax * 100) / 100).toFixed(2)}</span></div>
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
