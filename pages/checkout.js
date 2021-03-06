import Nav from '../components/nav'
import NavMobile from '../components/navMobile'
import Footer from '../components/footer'
import {useEffect, useState} from 'react'
import withUserQuiz from './withUserQuiz'
import axios from 'axios'
import {STRIPE_LIVE_KEY, STRIPE_TEST_KEY} from '../config'
import {useRouter} from 'next/router'
import PlacesAutocomplete, {geocodeByPlaceId} from 'react-places-autocomplete'
import {usStates, usStatesLive} from '../utils/quiz'
import {connect } from 'react-redux'
import SVG from '../files/svgs'
import ReactGA from 'react-ga'

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
const stripeKey = STRIPE_TEST_KEY
const stripeLiveKey = STRIPE_LIVE_KEY
const stripePromise = loadStripe(stripeLiveKey)

const Checkout = ({newUser}) => {
  const router = useRouter()

  const [recipient, setRecipient] = useState([])
  const [package_price, setPackagePrice] = useState(0)
  const [tax, setTax] = useState(0)
  const [taxID, setTaxID] = useState('')
  const [total, setTotal] = useState(0)
  const [cardholder, setCardholder] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip_code, setZipCode] = useState('')
  const [delivery, setDeliveryDate] = useState('')
  const [state_list, setStateList] = useState(false)
  const [dropdown, setDropDown] = useState(true)

  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /^(\d+(\d{0,2})?|\.?\d{1,2})$/
    input.value = input.value.split(regex).join('')
  }

  const isNumber = (data) => {
    let reg = new RegExp(/[0-9\-\(\)\+\s]+/gm)
    return reg.test(data)
  }

  const validateIsPhoneNumber = (type) => {
    setMessage('')
    const input = document.getElementById(type)
    const cleanNum = input.value.toString().replace(/\D/g, '');
    input.onkeydown = function(event){
      if(event.keyCode == 8){
        if(cleanNum.length == 1) return setPhone('')
        return setPhone(cleanNum.substr(0, cleanNum.length - 0))
      }
    }

    const match = cleanNum.match(/^(\d{3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      return  setPhone('(' + match[1] + ') ' + (match[2] ? match[2] + "-" : "") + match[3]);
    }
    return null;
  }
 

  const quizProgressNav = (e, next) => {
    window.localStorage.setItem('quiz_question', next)
    window.location.href = '/quiz'
  }

  useEffect( async () => {
    // if(newUser.recipients.length > 0) window.location.href = `/account/${newUser.id}`

    let recipientData = new Object()

    if(window.localStorage.getItem('package_plan')){
      recipientData.recipient = window.localStorage.getItem('recipient')
      recipientData.recipient_other = window.localStorage.getItem('recipient_other')
      recipientData.recipient_name = window.localStorage.getItem('recipient_name')
      recipientData.age = window.localStorage.getItem('age')
      recipientData.event = window.localStorage.getItem('event')
      recipientData.event_other = window.localStorage.getItem('event_other')
      recipientData.card_arrival = window.localStorage.getItem('card_arrival')
      recipientData.rank = JSON.parse(window.localStorage.getItem('rank'))
      recipientData.tags = JSON.parse(window.localStorage.getItem('tags'))
      recipientData.other = window.localStorage.getItem('other')
      // recipientData.involvement = window.localStorage.getItem('involvement')
      recipientData.package_plan = window.localStorage.getItem('package_plan')
      recipientData.subscription = window.localStorage.getItem('subscription')
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
    // if(!recipientData.involvement) return  (window.localStorage.setItem('quiz_question', 'involvement'), window.location.href = '/quiz')
    if(!recipientData.package_plan) return  (window.localStorage.setItem('quiz_question', 'package'), window.location.href = '/quiz')
    // if(!recipientData.subscription) return  (window.localStorage.setItem('quiz_question', 'package'), window.location.href = '/quiz')
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
      // if(!recipientData.nickname) return  (window.localStorage.setItem('quiz_question', 'message'), window.location.href = '/quiz')
      if(!recipientData.message) return  (window.localStorage.setItem('quiz_question', 'message'), window.location.href = '/quiz')
      // if(!recipientData.signature) return  (window.localStorage.setItem('quiz_question', 'message'), window.location.href = '/quiz')
    }
    if(!recipientData.description) return  (window.localStorage.setItem('quiz_question', 'description'), window.location.href = '/quiz')

    if(recipientData.package_plan == 'social butterfly')setPackagePrice(6.99)
    if(recipientData.package_plan == 'social_butterfly')setPackagePrice(6.99)
    if(recipientData.package_plan == 'friends and fam')setPackagePrice(8.99)
    if(recipientData.package_plan == 'friends_and_fam')setPackagePrice(8.99)
    if(recipientData.package_plan == 'shy sender')setPackagePrice(11.99)
    if(recipientData.package_plan == 'shy_sender')setPackagePrice(11.99)

    if(recipientData.package_plan === 'social butterfly')setTotal((6.99 * recipientData.package_quantity / 12))
    if(recipientData.package_plan === 'social_butterfly')setTotal((6.99 * recipientData.package_quantity / 12))

    if(recipientData.package_plan === 'friends and fam')setTotal((8.99 * recipientData.package_quantity / 12))
    if(recipientData.package_plan === 'friends_and_fam')setTotal((8.99 * recipientData.package_quantity / 12))
    if(recipientData.package_plan === 'shy sender')setTotal((11.99 * recipientData.package_quantity / 12))
    if(recipientData.package_plan === 'shy_sender')setTotal((11.99 * recipientData.package_quantity / 12))

    let result = null
    if(recipientData.package_quantity <= 4) result = 13.99
    if(recipientData.package_quantity > 4 ) result = 11.99
    if(recipientData.package_quantity > 9) result = 8.99
    if(recipientData.package_quantity > 19) result = 6.99
    
    if(recipientData.package_plan == 'custom')(setPackagePrice(result))
    recipientData.package_plan === 'custom' ? setTotal((result * recipientData.package_quantity)): null

    let delivery = new Date(recipientData.card_arrival)

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
      usStatesLive.forEach((item) => {
        if(item.abbreviation.trim() == recipient.state.trim()){
          setTaxID(item.id)
          setTax(item.taxRate)
        }
      })
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
  
  const handleTax = (abbr) => {
    usStatesLive.forEach((item) => {
      if(item.abbreviation.trim() === abbr.trim()){
        setTaxID(item.id)
        setTax(item.taxRate)
      }
    })
  }

  const handleEventAnalytics = (type) => {
    if(type == 'go_back'){
      ReactGA.event({
        category: 'Button',
        action: 'Go back to quiz arrow clicked in checkout page'
      })
    }
  }
  
  return (
    <>
      <Nav loggedIn={newUser} color={'#003E5F'}></Nav>
      <NavMobile loggedIn={newUser} color={'#003E5F'}></NavMobile>
      <div className="checkout">
        <div className="checkout-back" onClick={(e) => (handleEventAnalytics('go_back'), quizProgressNav(e, 'package'))}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
        </div>
        <div className="quiz-title">Payment Method</div>
        <div className="quiz-title-mobile">Payment Method</div>
        {/* <div className="quiz-subtitle">Select one.</div> */}
        {/* <div className="quiz-subtitle-mobile">Select one.</div> */}

        <div className="checkout-container">
          <div className="checkout-container-left">
            {/* <div className="checkout-container-left-title">Payment Method</div> */}
            <div className="checkout-container-left-subtitle">What's your billing information?</div>
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
            <PlacesAutocomplete value={address} onChange={(e) => (setDropDown(true), setAddress(e))} onSelect={(e) => (setDropDown(true), setAddress(e.split(',')[0]), setCity(e.split(',')[1]), setState(e.split(',')[2], handleZipCode(document.getElementById('address_place_id_checkout').value), handleTax(e.split(',')[2])))} searchOptions={searchOptionsAddress}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="form-group-single mail checkout-group form-autocomplete-container address-line-2">
                  <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'Address'})} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address'} required/>
                  {dropdown && suggestions.length > 0 && <span onClick={(e) => setDropDown(false)}><SVG svg={'close'}></SVG></span>}
                  {loading ? <div>...loading</div> : null}
                  {dropdown && suggestions.map((suggestion, idx) => {
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
                    {usStatesLive.map( (item, idx) => (
                      <div className="form-group-double-dropdown-list-item" onClick={(e) => (setState(item.abbreviation), setStateList(false), setTax(item.taxRate), setTaxID(item.id))} key={idx} >{item.name}</div>
                    ))
                    }
                  </div>
              </div>
              }
            </div>
            <div className="form-group-double mail checkout-group-double">
              <input id="phoneNumber" type="text" placeholder="Mobile Phone Number" value={phone} onChange={ (e) => e.target.value.length < 15 ? (setMessage(''), isNumber(e.target.value) ? (setPhone(e.target.value), validateIsPhoneNumber('phoneNumber')) : null) : null} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Mobile Phone Number'} required/>
            </div>
            <Elements stripe={stripePromise}>
              <CheckOutForm user={newUser} amount={(total + (total * tax)).toFixed(2)} cardholder={cardholder} address={address} city={city} state={state} zip_code={zip_code} delivery={delivery} package_price={package_price} tax={tax} recipient={recipient} taxID={taxID} phone={phone} subscription={recipient.subscription} message={message} setMessage={setMessage}></CheckOutForm>
            </Elements>
          </div>
          <div className="checkout-container-right">
            <div className="checkout-container-right-package">Package: {recipient.package_plan ? recipient.package_plan.replace(/_/g, ' ') : ''} </div>
            {recipient.mail_to == 'recipient' && <div className="checkout-container-right-ship_to">Ship to {recipient.recipient ? `${recipient.recipient}'s address` : recipient.recipient_other ? `${recipient.recipient_other}'s address`: ''} </div>}
            <div className="checkout-container-right-delivery">???? <span>Estimated arrival date: {delivery}</span></div>
            <div className="checkout-container-right-price"><span>{recipient.package_plan ? `${recipient.package_plan ? recipient.package_plan.replace(/_/g, ' ') : ''} (${recipient.package_quantity}x)` : ''}</span><span>{`$ ` + Math.ceil(package_price * 100 * +recipient.package_quantity) / 100}</span></div>
            <div className="checkout-container-right-price-event"><span>First card: {recipient.event ? `${recipient.event ? recipient.event : ''} for ${recipient.recipient_name ? recipient.recipient_name : recipient.recipient_other ? recipient.recipient_other : 'recipient'}` : ''}</span></div>
            <div className="checkout-container-right-tax"><span>Sales Tax</span><span>{((tax * 100 / 100).toFixed(4) * 100).toFixed(2) + `% `}</span></div>
            <div className="checkout-container-right-total">
              <span>Total {recipient.package_plan == 'custom' ? '' : 'per month'}</span>
              {recipient.package_plan == 'custom' ? 
              <span>{`$ ` + ((+recipient.package_quantity * +package_price) + ((+recipient.package_quantity * +package_price) * +tax)).toFixed(2)}</span>
              :
              <span>{`$ ` + ((+recipient.package_quantity * +package_price / 12) + ((+recipient.package_quantity * +package_price / 12) * +tax)).toFixed(2)}</span>
              }
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withUserQuiz(Checkout))
