import Nav from '../components/nav'
import NavMobile from '../components/navMobile'
import Footer from '../components/footer'
import withUserQuiz from './withUserQuiz'
import Slider from '../components/slider/slider'
import React, {useState, useEffect, useLayoutEffect, useRef, Fragment} from 'react'
import {eventsList, stylesList, stylesListDrop, packageList, usStates} from '../utils/quiz'
import {manageTags} from '../helpers/forms'
import { useDispatch, connect } from 'react-redux'
import {useRouter} from 'next/router'
import {nanoid} from 'nanoid'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByPlaceId } from 'react-places-autocomplete'
import axios from 'axios'
import {API} from '../config'
import SVGs from '../files/svgs'
import store from 'store-js'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const quiz = ({newUser, quizState}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const node = useRef();
  // console.log(quizState)
  
  const [quiz, setQuiz] = useState('recipient')
  const [recipient, setRecipient] = useState('')
  const [toggleEvents, setToggleEvents] = useState(false)
  const [events, setEvents] = useState(toggleEvents ? parseInt('8') : parseInt('20'))
  const [address, setAddress] = useState('')
  const [tags, setTags] = useState('')
  const [state_list, setStateList] = useState(false)
  const [message, setMessage] = useState('')
  const [invalid_tag, setInvalidTag] = useState(false)
  const [message_blank, setMessageBlank] = useState(false)
  const [message_later, setMessageLater] = useState(false)
  const [other, setOther] = useState('')
  const [name_popup, setPopUp] = useState('')
  const [popup_type, setPopUpType] = useState('')
  const [checkmarkName, setCheckmarkName] = useState(false)
  const [checkmarkOther, setCheckmarkOther] = useState(false)
  const [enableCalendar, setEnableCalendar] = useState('')
  const [calendar, setCalendar] = useState(new Date())
  const [result, setResult] = useState('')

  useEffect(() => {
    if(window.localStorage.getItem('quiz_question')) window.localStorage.getItem('quiz_question').length > 0 ? window.localStorage.getItem('quiz_question') == 'checkout' ? window.location.href = '/checkout' : setQuiz(window.localStorage.getItem('quiz_question')) : null
    
  }, [])

  // HANDLE CLICK OUTSIDE STATE DROPDOWN
  useEffect(() => {
    store.set('user', { name:'Marcus' })
    
    // console.log(document.querySelectorAll('.recipient-other'))
    document.addEventListener("mousedown", handleClick);
  // return function to be called when unmounted
  return () => {
    document.removeEventListener("mousedown", handleClick);
  };
  }, [])

  useEffect(() => {
    dispatch({type: 'UPDATE_CHANGE', name: 'card_arrival', payload: formatDate(calendar)})

    window.localStorage.getItem('card_arrival') ? null : window.localStorage.setItem('card_arrival', formatDate(calendar).trim())
    setEnableCalendar(``)
    setOther('')
  }, [calendar])

  const handleClick = e => {
    if(node.current){
      // INSIDE CLICK
      if(node.current.contains(e.target)) return
    }

    // CLICK OUTSIDE
    setStateList(false)
  };

  // AUTO FILL QUIZ DATA WITH LOCAL STORAGE
  useEffect( () => {
    if(window.localStorage.getItem('recipient')){
      dispatch({type: 'UPDATE_CHANGE', name: 'recipient', payload: window.localStorage.getItem('recipient')})

      // let els = document.querySelectorAll('.quiz-recipient-item')

      // els.forEach( (el) => {el.textContent.toLowerCase().split(' ')[0].trim() == window.localStorage.getItem('recipient').trim() ? el.classList.add("quiz-recipient-item-active") : null})
    }

    if(window.localStorage.getItem('recipient_name')){
      dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: window.localStorage.getItem('recipient_name')})
      setPopUpType(window.localStorage.getItem('recipient_type'))
    }

    if(window.localStorage.getItem('recipient_other')){
      dispatch({type: 'UPDATE_CHANGE', name: 'recipient_other', payload: window.localStorage.getItem('recipient_other')})
    }

    if(window.localStorage.getItem('age')){
      dispatch({type: 'UPDATE_CHANGE', name: 'age', payload: window.localStorage.getItem('age')})
      let els = document.querySelectorAll('.quiz-recipient-age-item')
      els.forEach( (el) => {el.textContent.toLowerCase() == window.localStorage.getItem('age') ? el.classList.add("quiz-recipient-age-item-active") : null})
    }

    if(window.localStorage.getItem('event')){
      if(window.localStorage.getItem('event_toggle')) setToggleEvents(window.localStorage.getItem('event_toggle') == 'true' ? true : false)

      dispatch({type: 'UPDATE_CHANGE', name: 'event', payload: window.localStorage.getItem('event')})
      let els = document.querySelectorAll('.quiz-recipient-event-item')
      
      els.forEach( (el) => {el.textContent.toLowerCase().split('arrival')[0] == window.localStorage.getItem('event').trim() ? el.classList.add("quiz-recipient-event-item-active") : null})
    }

    if(window.localStorage.getItem('description')){
      dispatch({type: 'UPDATE_CHANGE', name: 'description', payload: window.localStorage.getItem('description')})
      let els = document.querySelectorAll('.form-group-list-container > label')
      els.forEach((el) => {el.textContent.toLowerCase() == window.localStorage.getItem('description') ? el.click() : null})
    }

    if(window.localStorage.getItem('tags')){
      dispatch({type: 'UPDATE_CHANGE', name: 'tags', payload: JSON.parse(window.localStorage.getItem('tags'))})

      manageTags('preload', JSON.parse(window.localStorage.getItem('tags')))
      let closeIcon = document.querySelectorAll('.form-tag')
      if(closeIcon){
        closeIcon.forEach( (e) => {
          e.addEventListener('click', function(e){
            let parent = e.target.parentNode
            let parentOfParent = parent.parentNode
            parentOfParent.remove()

            let tagValues = document.querySelectorAll(".tag > span")
            let newValues = []
            
            tagValues.forEach( e => {
              newValues.push(e.innerHTML)
            })

            dispatch({
              type: 'UPDATE_TAGS_QUIZ',
              payload: newValues
            })
          })
        })
      }
    }

    if(window.localStorage.getItem('other')){
      if(window.localStorage.getItem('other') !== 'blank') dispatch({type: 'UPDATE_CHANGE', name: 'other', payload: window.localStorage.getItem('other')})
      if(window.localStorage.getItem('other') == 'blank'){
        dispatch({type: 'UPDATE_CHANGE', name: 'other', payload: window.localStorage.getItem('other')})
        let el = document.getElementById('other')
        if(el) el.checked = true
      }
    }

    if(window.localStorage.getItem('involvement')){
      dispatch({type: 'UPDATE_CHANGE', name: 'involvement', payload: window.localStorage.getItem('involvement')})
      let els = document.querySelectorAll('.quiz-recipient-involvement-item')
      els.forEach( (el) => {el.textContent.toLowerCase() == window.localStorage.getItem('involvement') ? el.classList.add("quiz-recipient-involvement-item-active") : null})
    }

    if(window.localStorage.getItem('mail_to')){
      if(window.localStorage.getItem('mail_to') == 'user'){
        let el = document.getElementById('mail_to_user')
        if(el) el.classList.add("quiz-recipient-mail-item-active")
        setAddress('me')
      }

      if(window.localStorage.getItem('mail_to') == 'recipient'){
        let el = document.getElementById('mail_to_recipient')
        if(el) el.classList.add("quiz-recipient-mail-item-active")
        setAddress('recipient')
      }
    }

    if(window.localStorage.getItem('name')){
      dispatch({type: 'UPDATE_CHANGE', name: 'name', payload: window.localStorage.getItem('name')})
    }

    if(window.localStorage.getItem('address_one')){
      dispatch({type: 'UPDATE_CHANGE', name: 'address_one', payload: window.localStorage.getItem('address_one')})
    }

    if(window.localStorage.getItem('address_two')){
      dispatch({type: 'UPDATE_CHANGE', name: 'address_two', payload: window.localStorage.getItem('address_two')})
    }

    if(window.localStorage.getItem('city')){
      dispatch({type: 'UPDATE_CHANGE', name: 'city', payload: window.localStorage.getItem('city')})
    }

    if(window.localStorage.getItem('state')){
      dispatch({type: 'UPDATE_CHANGE', name: 'state', payload: window.localStorage.getItem('state')})
    }

    if(window.localStorage.getItem('zip_code')){
      dispatch({type: 'UPDATE_CHANGE', name: 'zip_code', payload: window.localStorage.getItem('zip_code')})
    }

    if(window.localStorage.getItem('nickname')){
      if(window.localStorage.getItem('nickname') == 'blank'){
        let el = document.getElementById('nickname')
        if(el) el.checked = true
        dispatch({type: 'UPDATE_CHANGE', name: 'nickname', payload: 'blank'})
      }
      if(window.localStorage.getItem('nickname') !== 'blank'){
        dispatch({type: 'UPDATE_CHANGE', name: 'nickname', payload: window.localStorage.getItem('nickname')})
      }
    }

    if(window.localStorage.getItem('signature')){
      dispatch({type: 'UPDATE_CHANGE', name: 'signature', payload: window.localStorage.getItem('signature')})
    }

    if(window.localStorage.getItem('message_later')){
      resetMessage()
      let el = document.getElementById('message_unsure')
      if(el) el.checked = true
    }
    
  }, [quiz])

  useEffect(() => {
    handleFormDisableButtons('message')

    if(quizState.recipient_name.length > 0){
      let userTyping = setTimeout(() => {
        setCheckmarkName(true)
      }, 500)

      return () => clearTimeout(userTyping);
    }

    if(quizState.recipient_name.length == 0){
      setCheckmarkName(false)
    }

    if(quizState.recipient_other.length > 0){
      let userTyping = setTimeout(() => {
        setCheckmarkOther(true)
      }, 500)

      return () => clearTimeout(userTyping);
    }

    if(quizState.recipient_other.length == 0){
      setCheckmarkOther(false)
    }

    if(quizState.event_other.length > 0){
      let userTyping = setTimeout(() => {
        setCheckmarkOther(true)
      }, 500)

      return () => clearTimeout(userTyping);
    }

    if(quizState.event_other.length == 0){
      setCheckmarkOther(false)
    }

    if(quizState.package_quantity.length == 0){
      setResult('')
    }
    
  }, [quizState.nickname, quizState.message, quizState.signature, quizState.recipient_name, quizState.recipient_other, quizState.event_other, quizState.package_quantity])


  useLayoutEffect(() => {
    if(window.localStorage.getItem('message')){
      if(window.localStorage.getItem('message') == 'blank'){
        let el = document.getElementsByName('message_blank')[0]
        if(el) el.checked = true
        dispatch({type: 'UPDATE_CHANGE', name: 'message', payload: 'blank'})
      }
      if(window.localStorage.getItem('message') == 'message_options'){
        let el = document.getElementsByName('message_textarea_blank')[0]
        if(el) el.checked = true
        dispatch({type: 'UPDATE_CHANGE', name: 'message', payload: 'message_options'})
      }
      dispatch({type: 'UPDATE_CHANGE', name: 'message', payload: window.localStorage.getItem('message')})
    }
  }, [quiz])

  const quizProgress = (e, next, other) => {
    if(next == 'ranking') (window.localStorage.removeItem('rank'), dispatch({type: 'RESET_RANK', name: 'ranking', payload: []}))

    // if(other == 'card_arrival'){
    //   window.localStorage.setItem('event', e.trim())
    //   dispatch({type: "UPDATE_CHANGE", name: "event", payload: e} )
    // }

    let els = document.querySelectorAll('.quiz-recipient-item')
    let els2 = document.querySelectorAll('.quiz-recipient-age-item')
    let els3 = document.querySelectorAll('.quiz-recipient-event-item')
    let els4 = document.querySelectorAll('.quiz-recipient-involvement-item')
    let els5 = document.querySelectorAll('.quiz-recipient-mail-item')

    els.forEach( (el) => {el.classList.remove("quiz-recipient-item-active")})
    els2.forEach( (el) => {el.classList.remove("quiz-recipient-age-item-active")})
    els3.forEach( (el) => {el.classList.remove("quiz-recipient-event-item-active")})
    els4.forEach( (el) => {el.classList.remove("quiz-recipient-involvement-item-active")})
    els5.forEach( (el) => {el.classList.remove("quiz-recipient-mail-item-active")})

    // els3.forEach( (el) => {console.log(el.textContent.toLowerCase().split('«'))})

    // els3.forEach( (el) => {el.textContent.toLowerCase().split('arrival')[0].trim() == e.trim() ? el.classList.add("quiz-recipient-event-item-active") : null})

    els.forEach( (el) => {el.textContent.split(' ')[0].toLowerCase().trim() == e.toLowerCase().trim() ? el.classList.add("quiz-recipient-item-active") : null})
    els2.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-age-item-active") : null})
    els3.forEach( (el) => {el.textContent.toLowerCase().split('«')[0].trim() == e.trim() ? el.classList.add("quiz-recipient-event-item-active") : null})
    els4.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-involvement-item-active") : null})
    els5.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-mail-item-active") : null})

    setTimeout(() => {
      if(next) setQuiz(next)
    }, 500);
  }

  const quizProgressNav = (e, next) => {
    if(e) e.preventDefault()
    if(next == 'ranking') (window.localStorage.removeItem('rank'), dispatch({type: 'RESET_RANK', name: 'ranking', payload: []}))
    window.localStorage.setItem('quiz_question', next)
    setAddress('')
    setMessage('')
    setQuiz(next)
  }

  const showTooltip = (e, type) => {
    const els = document.querySelectorAll('.quiz-recipient-package-description-text-bubble-tooltip')
    els[type].classList.add('display')
  }

  const hideTooltip = (e, type) => {
    const els = document.querySelectorAll('.quiz-recipient-package-description-text-bubble-tooltip')
    els[type].classList.remove('display')
  }

  const onDragStart = (e) => {
    e.dataTransfer.setData("item", e.target.id);
  }

  const onDragOver = (e) => {
    if (e.target.childNodes.length > 1) { return; }
    e.preventDefault()
  }

  const onDrop = (e, idx) => {
    let id = e.dataTransfer.getData("item");
    let el = document.getElementById(id)
    
    handleChange('ranking', el, idx)
    e.target.appendChild(el)
  }

  const onDropBack = (e) => {
    let id = e.dataTransfer.getData("item");
    let el = document.getElementById(id)

    let span = el.querySelectorAll('span')

    dispatch({type: 'REMOVE_RANK', payload: span[0].textContent.toLowerCase()})

    if(e.target.id !== id) e.target.appendChild(el)
  }

  // HANDLE KEY PRESS
  const handleKeyPress = async (e, clicked) => {
    if(e.key === 'Enter' || clicked == 'true'){
      e.preventDefault();
      try {
        console.log(tags)
        const responseTag = await axios.post(`${API}/recipient/check-word`, {tags})
        setInvalidTag(false)
        let input = document.getElementById('researchInterests')
        input.value = responseTag.data
      } catch (error) {
        console.log(error.response)
        if(error) return  error.response ? (setMessage(error.response.data),setInvalidTag(true)) : (setMessage(`Tags cannot be more than two words`), setInvalidTag(true))
      }
      manageTags('addTag')
      let closeIcon = document.querySelectorAll('.form-tag')
      let postHidden = document.getElementById("tagValue")
      let values = postHidden.getAttribute('value').split(',')
      
      closeIcon.forEach( (e) => {
        e.addEventListener('click', function(item){
          let parent = item.target.parentNode
          let parentOfParent = parent.parentNode
          parentOfParent.remove()

          let tagValues = document.querySelectorAll(".tag > span")
          let newValues = []
          
          tagValues.forEach( e => {
            newValues.push(e.innerHTML)
          })

          dispatch({
            type: 'UPDATE_TAGS_QUIZ',
            payload: newValues
          })
        })
      })

      dispatch({
        type: 'UPDATE_TAGS_QUIZ',
        payload: values
      })
      setTags('')
    }
  }

  // HANDLE CHANGE
  const handleChange = (question, e, idx, type, quantity) => {
    if(question == 'ranking'){
      let span = e.querySelectorAll('span')
      let ranking = new Object()

      ranking.style = span[0].textContent.toLowerCase()
      ranking.rank = idx + 1
      
      dispatch({type: 'UPDATE_RANK', name: question, payload: ranking})

      return 
    }

    if(question == 'other'){
      window.localStorage.setItem(question, e.target.value); 
      return dispatch({type: 'UPDATE_TEXTAREA', name:'other', payload: e.target.value})
    }

    if(question == 'package_plan'){
      setMessage('')
      if(type == 'good deal') (setResult(''),  window.localStorage.setItem('subscription', 'price_1Jq0oBAFcPAVZmVLtLUI1icZ'))
      if(type == 'good_deal') (setResult(''), window.localStorage.setItem('subscription', 'price_1Jq0oBAFcPAVZmVLtLUI1icZ'))
      if(type == 'better deal') (setResult(''), window.localStorage.setItem('subscription', 'price_1Jq0orAFcPAVZmVLvZNwmwWP'))
      if(type == 'better_deal') (setResult(''), window.localStorage.setItem('subscription', 'price_1Jq0orAFcPAVZmVLvZNwmwWP'))
      if(type == 'best deal') (setResult(''), window.localStorage.setItem('subscription', 'price_1Jq0qpAFcPAVZmVLF41sZGrG'))
      if(type == 'best_deal') (setResult(''), window.localStorage.setItem('subscription', 'price_1Jq0qpAFcPAVZmVLF41sZGrG'))

      window.localStorage.setItem(question, type)
      window.localStorage.setItem('package_quantity', quantity)
      dispatch({type: 'UPDATE_CHANGE', name: 'package_quantity', payload: quantity})
      return dispatch({type: 'UPDATE_CHANGE', name: question, payload: type})
    }

    if(question == 'mail_api'){
      window.localStorage.setItem(type,  JSON.stringify(e))
      return dispatch({type: 'UPDATE_CHANGE', name: type, payload: e})
    }

    if(question == 'mail'){
      window.localStorage.setItem(type, e.target.value)
      return dispatch({type: 'UPDATE_CHANGE', name: type, payload: e.target.value})
    }

    if(question == 'mail_item'){
      window.localStorage.setItem(type,  e)
      return dispatch({type: 'UPDATE_CHANGE', name: type, payload: e})
    }

    if(question == 'nickname'){
      window.localStorage.setItem(question, type)
      let el = document.getElementById('message_unsure')
      if(el) el.checked = false
      window.localStorage.removeItem('message_later')
      return dispatch({type: 'UPDATE_CHANGE', name: question, payload: type})
    }

    if(question == 'message'){
      window.localStorage.setItem(question, type)
      let el = document.getElementById('message_unsure')
      if(el) el.checked = false
      window.localStorage.removeItem('message_later')
      return dispatch({type: 'UPDATE_TEXTAREA', name: question, payload: type})
    }

    if(question == 'signature'){
      window.localStorage.setItem(question, type)
      let el = document.getElementById('message_unsure')
      if(el) el.checked = false
      window.localStorage.removeItem('message_later')
      return dispatch({type: 'UPDATE_CHANGE', name: question, payload: type})
    }

    if(question == 'event'){
      window.localStorage.setItem('event', e)
      dispatch({type: 'UPDATE_CHANGE', name: question, payload: e})
      return 
    }

    if(question == 'event_other'){
      window.localStorage.setItem('event_other', e.target.value)
      dispatch({type: 'UPDATE_CHANGE', name: question, payload: e.target.value})
      return 
    }

    if(question == 'event_other_reset'){
      window.localStorage.setItem('event_other', e)
      dispatch({type: 'UPDATE_CHANGE', name: 'event_other', payload: e})
      return 
    }

    if(question == 'recipient'){
      window.localStorage.setItem('recipient', e.target.textContent.toLowerCase().split(' ')[0].trim())

      dispatch({type: 'UPDATE_CHANGE', name: question, payload: e.target.textContent.toLowerCase()})

      dispatch({type: 'UPDATE_CHANGE', name: 'recipient_other', payload: ''})
      
      window.localStorage.removeItem('recipient_other')
      return setOther('')
    }

    if(question == 'recipient_name'){
      window.localStorage.setItem('recipient_name', e.target.value)
      window.localStorage.setItem('recipient_type', type)
      dispatch({type: 'UPDATE_CHANGE', name: question, payload: e.target.value})
      return
    }

    if(question == 'recipient_other'){
      if(type) window.localStorage.setItem('recipient_type', type)
      window.localStorage.setItem('recipient_other', e.target.value)
      dispatch({type: 'UPDATE_CHANGE', name: question, payload: e.target.value})
      dispatch({type: 'UPDATE_CHANGE', name: 'recipient', payload: ''})
      window.localStorage.removeItem('recipient')

      dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''})
      window.localStorage.setItem('recipient_name', '')
      return 
    }

    window.localStorage.setItem(question, e.target.textContent.toLowerCase())
    dispatch({type: 'UPDATE_CHANGE', name: question, payload: e.target.textContent.toLowerCase()})
  }

  const handleFormDisableButtons = (type) => {
    if(type == 'mail'){
      let inputs = []
      if(quizState.name.length < 1){ inputs.push('true')}
      if(quizState.address_one.length < 1){ inputs.push('true')}
      if(quizState.city.length < 1){ inputs.push('true')}
      if(quizState.state.length < 1){ inputs.push('true')}
      if(quizState.zip_code.length < 1){ inputs.push('true')}

      if(inputs.length > 0) return true
    }

    if(type == 'message'){
      let inputs = []
      // if(quizState.nickname.length < 1 ){ inputs.push('true')}
      if(quizState.message.length < 1){ inputs.push('true')}
      // if(quizState.signature.length < 1){ inputs.push('true')}

      if(window.localStorage.getItem('message_later')) return setMessageLater(false)
      if(inputs.length > 0) setMessageLater(true)
      if(inputs.length < 1) setMessageLater(false)
      if(inputs.length > 0) return true
    }
  }

  const handleFormProgressButtons = (type) => {
    if(type == 'mail'){
      let inputs = []
      if(quizState.name.length > 1){ inputs.push('true')}
      if(quizState.address_one.length > 1){ inputs.push('true')}
      if(quizState.city.length > 1){ inputs.push('true')}
      if(quizState.state.length > 1){ inputs.push('true')}
      if(quizState.zip_code.length > 1){ inputs.push('true')}
      
      if(inputs.length > 4) return true
    }

    if(type == 'message'){
      let inputs = []
      if(quizState.nickname.length > 1){ inputs.push('true')}
      if(quizState.message.length > 1){ inputs.push('true')}
      if(quizState.signature.length > 1){ inputs.push('true')}

      if(inputs.length > 2) return true
    }
  }

  const handleCheckboxList = (e, description) => {
    let allInputs = document.querySelectorAll('.form-group-list-container > input')
    
    allInputs.forEach( (item) => {
      item.checked = false
    })

    e.target.checked = true

    window.localStorage.setItem('description', description.toLowerCase())
    dispatch({type: 'UPDATE_CHANGE', name: 'description', payload: description.toLowerCase()})
  }

  useEffect(() => {
    if(quiz == 'ranking') window.localStorage.setItem('rank', JSON.stringify(quizState.rank)) 
    if(quiz == 'tags') window.localStorage.setItem('tags', JSON.stringify(quizState.tags));
    if(address) address == 'me' ? (window.localStorage.setItem('mail_to', 'user'), dispatch({type: 'UPDATE_CHANGE', name: 'mail_to', payload: 'user'})) : (window.localStorage.setItem('mail_to', 'recipient'), dispatch({type: 'UPDATE_CHANGE', name: 'mail_to', payload: 'recipient'}))
  }, [quizState.rank, quizState.tags, address])

  const handleQuizID = () => {
    if(!window.localStorage.getItem('quiz_session')) window.localStorage.setItem('quiz_session', nanoid())
  }

  const handleSelect = async (question, e, idx, type, id) => {
    // let geocoder = new google.maps.Geocoder()
    // console.log(await geocoder.geocode({ placeId: id }))
    let geo
    
    if(id){
     geo = await geocodeByPlaceId(id)
    }

    if(question == 'mail'){

      if(geo){
        geo[0].address_components.forEach((item) => {
          if(item.types.includes('postal_code')){
            window.localStorage.setItem('zip_code', item.long_name)
            dispatch({type: 'UPDATE_CHANGE', name: 'zip_code', payload: item.long_name});
          } 
        })
      }
      
      window.localStorage.setItem(type, e.split(',')[0])
      dispatch({type: 'UPDATE_CHANGE', name: type, payload: e.split(',')[0]});

      if(type == 'address_one'){
        dispatch({type: 'UPDATE_CHANGE', name: 'city', payload: e.split(',')[1]}) 
        window.localStorage.setItem('city', e.split(',')[1])
        dispatch({type: 'UPDATE_CHANGE', name: 'state', payload: e.split(',')[2]})
        window.localStorage.setItem('state', e.split(',')[2])
      }

      return
    }
  }

  const handleZipCode = (e) => {
    e.preventDefault()
    if(!/^\d{5}(-\d{4})?$/.test(quizState.zip_code)) return setMessage('Zip code is invalid');
    quizProgressNav(e, 'message')
  }

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
  }

  const resetMail = (e) => {
    window.localStorage.setItem('name', '')
    dispatch({type: 'UPDATE_CHANGE', name: 'name', payload: ''})
    window.localStorage.setItem('address_one', '')
    dispatch({type: 'UPDATE_CHANGE', name: 'address_one', payload: ''})
    window.localStorage.setItem('address_two', '')
    dispatch({type: 'UPDATE_CHANGE', name: 'address_two', payload: ''})
    window.localStorage.setItem('city', '')
    dispatch({type: 'UPDATE_CHANGE', name: 'city', payload: ''})
    window.localStorage.setItem('state', '')
    dispatch({type: 'UPDATE_CHANGE', name: 'state', payload: ''})
    window.localStorage.setItem('zip_code', '')
    dispatch({type: 'UPDATE_CHANGE', name: 'zip_code', payload: ''})
  }

  const resetMessage= () => {
    let el = document.getElementById('nickname')
    if(el) el.checked = false

    let el2 = document.getElementsByName('message_blank')[0]
    if(el2) el2.checked = false

    let el3 = document.getElementsByName('message_textarea_blank')[0]
    if(el3) el3.checked = false

    
    window.localStorage.setItem('nickname', '')
    dispatch({type: 'UPDATE_CHANGE', name: 'nickname', payload: ''})
    window.localStorage.setItem('message', '')
    dispatch({type: 'UPDATE_CHANGE', name: 'message', payload: ''})
    window.localStorage.setItem('signature', '')
    dispatch({type: 'UPDATE_CHANGE', name: 'signature', payload: ''})
  }

  const uncheckOther = () => {
    let el = document.getElementById('other')
    if(el) el.checked = false
  }

  const handleDate = (date, type) => {
    setCalendar(date)
    // console.log(type)
    type !== 'other' ? handleChange('event_other_reset', '') : null
    window.localStorage.setItem('event', type.trim())
    dispatch({type: "UPDATE_CHANGE", name: "event", payload: type} )
    quizProgress(type == 'other' ? quizState.event_other : type)
  }
  
  const formatDate = (e) => {

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var month = monthNames[e.getUTCMonth()]
    var day = e.getUTCDate()
    var year = e.getUTCFullYear()
    return `${month} ${day}, ${year}`
  }

  const calculate = () => {
    setMessage('')
    if(+quizState.package_quantity == 0) return setMessage('Must be greater than 0')
    if(+quizState.package_quantity <= 4) setResult(13.99)
    if(+quizState.package_quantity > 4 ) setResult(11.99)
    if(+quizState.package_quantity > 9) setResult(9.99)
    if(+quizState.package_quantity > 19) setResult(6.99)
    if(+quizState.package_quantity > 50){setMessage('For 50+ cards, please contact us.'), setResult('')}
  }

  return (
    
    <>
      <Nav loggedIn={newUser} color={'white'}></Nav>
      <NavMobile loggedIn={newUser} color={'white'}></NavMobile>
      <div className="quiz">
        {quiz == 'recipient' && <>
          <div className="quiz-title">Who are we sending a card to?</div>
          <div className="quiz-title-mobile">Who are we sending a card to?</div>
          <div className="quiz-subtitle">For now just pick <span>one person</span>. Later, you can finish adding other recipients in your profile.</div>
          <div className="quiz-subtitle-mobile">For now just pick <span>one person</span>. Later, you can finish adding other recipients in your profile.</div>
          <div className="quiz-recipient">
            <div className="quiz-recipient-item" onClick={(e) => (handleChange('recipient', e), setPopUp('friend'), setPopUpType('friend'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>Friend
              {popup_type == 'friend' && quizState.recipient_name ? 
                <span className="quiz-recipient-item-other-container">
                  <div className="quiz-recipient-item-other-recipient">
                    {quizState.recipient_name}
                  </div>
                </span>
                :
                null
              }
              {name_popup == 'friend' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'friend')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
              }
            </div>
            <div className="quiz-recipient-item" onClick={(e) => (handleChange('recipient', e), setPopUp('partner'), setPopUpType('partner'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>Partner
              {popup_type == 'partner' && quizState.recipient_name ? 
                <span className="quiz-recipient-item-other-container">
                  <div className="quiz-recipient-item-other-recipient">
                    {quizState.recipient_name}
                  </div>
                </span>
                :
                null
              }
              {name_popup == 'partner' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'partner')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
              }
            </div>
            <div className="quiz-recipient-item" onClick={(e) => (handleChange('recipient', e), setPopUp('mom'), setPopUpType('mom'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>Mom
              {popup_type == 'mom' && quizState.recipient_name ? 
                <span className="quiz-recipient-item-other-container">
                  <div className="quiz-recipient-item-other-recipient">
                    {quizState.recipient_name}
                  </div>
                </span>
                :
                null
              }
              {name_popup == 'mom' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'mom')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
              }
            </div>
            <div className="quiz-recipient-item" onClick={(e) => (handleChange('recipient', e), setPopUp('dad'), setPopUpType('dad'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>Dad
              {popup_type == 'dad' && quizState.recipient_name ? 
                <span className="quiz-recipient-item-other-container">
                  <div className="quiz-recipient-item-other-recipient">
                    {quizState.recipient_name}
                  </div>
                </span>
                :
                null
              }
              {name_popup == 'dad' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'dad')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
              }
            </div>
            <div className="quiz-recipient-item" onClick={(e) => (handleChange('recipient', e), setPopUp('sister'), setPopUpType('sister'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>Sister
              {popup_type == 'sister' && quizState.recipient_name ? 
              <span className="quiz-recipient-item-other-container">
                <div className="quiz-recipient-item-other-recipient">
                  {quizState.recipient_name}
                </div>
              </span>
              :
              null
              }
              {name_popup == 'sister' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'sister')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
              }
            </div>
            <div className="quiz-recipient-item" onClick={(e) => (handleChange('recipient', e), setPopUp('brother'), setPopUpType('brother'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>Brother
              {popup_type == 'brother' && quizState.recipient_name ? 
              <span className="quiz-recipient-item-other-container">
                <div className="quiz-recipient-item-other-recipient">
                  {quizState.recipient_name}
                </div>
              </span>
              :
              null
              }
              {name_popup == 'brother' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'brother')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
              }
            </div>
            <div className="quiz-recipient-item" onClick={(e) => (handleChange('recipient', e), setPopUp('grandma'), setPopUpType('grandma'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>Grandma
              {popup_type == 'grandma' && quizState.recipient_name ? 
              <span className="quiz-recipient-item-other-container">
                <div className="quiz-recipient-item-other-recipient">
                  {quizState.recipient_name}
                </div>
              </span>
              :
              null
              }
              {name_popup == 'grandma' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'grandma')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
              }
            </div>
            <div className="quiz-recipient-item" onClick={(e) => (handleChange('recipient', e), setPopUp('grandpa'), setPopUpType('grandpa'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>Grandpa
              {popup_type == 'grandpa' && quizState.recipient_name ? 
              <span className="quiz-recipient-item-other-container">
                <div className="quiz-recipient-item-other-recipient">
                  {quizState.recipient_name}
                </div>
              </span>
              :
              null
              }
              {name_popup == 'grandpa' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'grandpa')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
              }
            </div>
            <div className="quiz-recipient-item" onClick={(e) => (handleChange('recipient', e), setPopUp('daughter'), setPopUpType('daughter'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>Daughter
              {popup_type == 'daughter' && quizState.recipient_name ? 
              <span className="quiz-recipient-item-other-container">
                <div className="quiz-recipient-item-other-recipient">
                  {quizState.recipient_name}
                </div>
              </span>
              :
              null
              }
              {name_popup == 'daughter' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'daughter')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
              }
            </div>
            <div className={`quiz-recipient-item recipient-other ` + (other == 'recipient' ? ` pb-4 ` : '') + (typeof window !== "undefined" ? window.localStorage.getItem('recipient_other') ? window.localStorage.getItem('recipient_other').length > 0 ? ` pb-4 ` : '' : '' : '')} onClick={(e) => (handleChange('recipient', e), setOther('recipient'))}>
            {quizState.recipient_other ? quizState.recipient_other : 'Other '}
            {popup_type == 'other' && quizState.recipient_other ? 
            <span className="quiz-recipient-item-other-container">
              <div className="quiz-recipient-item-other-recipient">
                {quizState.recipient_other}: {quizState.recipient_name}
              </div>
            </span>
            :
            null
            }
            
            {other == 'recipient' ? 
            <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
              <div className="quiz-recipient-item-other-input-container">
                <input className="quiz-recipient-item-other-input" type="text" placeholder="Please specify" autoFocus value={quizState.recipient_other} onChange={(e) => (setPopUp(''),handleChange('recipient_other', e))}/>
                <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setOther(false), document.querySelectorAll('.recipient-other')[0].classList.add("active"), setPopUp('other'), setPopUpType('other'), dispatch({type: 'UPDATE_CHANGE', name: 'recipient_name', payload: ''}))}>{checkmarkOther && <SVGs svg={'checkmark'}></SVGs>}</div>
              </div>
              </span> 
            : 
            null
            }

            {name_popup == 'other' ? 
                <span className="quiz-recipient-item-other mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-recipient-item-other-input-container">
                  <input className="quiz-recipient-item-other-input" type="text" placeholder="Recipient Name" autoFocus value={quizState.recipient_name} onChange={(e) => handleChange('recipient_name', e, 0, 'other')}/>
                  <div className="quiz-recipient-item-other-input-svg" onClick={(e) => (setPopUp(''))}>{checkmarkName && <SVGs svg={'checkmark'}></SVGs>}</div>
                </div>
                </span> 
              : 
              null
            } 
            </div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e, 'age')} disabled={quizState.recipient_other.length > 0 ? false : quizState.recipient ? quizState.recipient_name ? false : true : true}>Next</button></div>
          {quizState.recipient_other.length > 0 ? 
            <div className="quiz-next" onClick={(e) => quizProgressNav(e, 'age')}>
              <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
            </div>
            :
            quizState.recipient ? 
            quizState.recipient_name ?

            <div className="quiz-next" onClick={(e) => quizProgressNav(e, 'age')}>
              <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
            </div>

            : null
            : null
          }
        </>
        }
        {quiz == 'age' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'recipient')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">What's their age group?</div>
          <div className="quiz-title-mobile">What's their age group?</div>
          <div className="quiz-subtitle">Select one.</div>
          <div className="quiz-subtitle-mobile">Select one.</div>
          <div className="quiz-recipient-age">
            <div className="quiz-recipient-age-item" onClick={(e) => (quizProgress(e,'events'), handleChange('age', e))}>18-24</div>
            <div className="quiz-recipient-age-item" onClick={(e) => (quizProgress(e,'events'), handleChange('age', e))}>25-34</div>
            <div className="quiz-recipient-age-item" onClick={(e) => (quizProgress(e,'events'), handleChange('age', e))}>35-44</div>
            <div className="quiz-recipient-age-item" onClick={(e) => (quizProgress(e,'events'), handleChange('age', e))}>45-54</div>
            <div className="quiz-recipient-age-item" onClick={(e) => (quizProgress(e,'events'), handleChange('age', e))}>55-64</div>
            <div className="quiz-recipient-age-item" onClick={(e) => (quizProgress(e,'events'), handleChange('age', e))}>65 or above</div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'events')} disabled={quizState.age.length < 1 ? true : false}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.age && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'events')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          }
        </>
        }
        {quiz == 'events' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'age')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Pick one event for {typeof window !== "undefined" ? window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient' : 'recipient'}.</div>
          <div className="quiz-title-mobile">Pick one event for {window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient'}.</div>
          <div className="quiz-subtitle">Select arrival date.</div>
          <div className="quiz-subtitle-mobile">Select arrival date.</div>
          <div className="quiz-recipient-event">
            {eventsList.slice(0, toggleEvents ? 20 : 8).map( (item, idx) => 
            <div key={idx} className={`quiz-recipient-event-item`} onClick={(e) => 
            (item.subtitle == 'more' 
            ? (setToggleEvents(!toggleEvents), window.localStorage.setItem('event_toggle', !toggleEvents)) 
            : 
            (item.subtitle.toLowerCase() == 'other' ? (setOther('event'), window.localStorage.removeItem('card_arrival')) : setEnableCalendar(`event-${item.subtitle.toLowerCase()}`), window.localStorage.setItem('event', item.subtitle.toLowerCase()), window.localStorage.removeItem('card_arrival'))
            )}>
              {item.imageName ? <img src={`/media/emojis/${item.imageName}`}></img> : null}
              <span className={`quiz-recipient-event-item-text ` + (item.subtitle.toLowerCase() == 'other' && window.localStorage.getItem('event') == 'other' ? ' mb-4 ' : '') + (item.subtitle == 'more' ? 'expand' : null) + (window.localStorage.getItem('card_arrival') ? window.localStorage.getItem('card_arrival') && item.subtitle.toLowerCase().trim() == window.localStorage.getItem('event') ? ' mb-4' : null : null)}>{item.subtitle == 'more' ? toggleEvents ? 'less' : 'more' : item.subtitle == 'Other' ? window.localStorage.getItem('event_other') ? window.localStorage.getItem('event_other') : 'Other': item.subtitle}

              {window.localStorage.getItem('card_arrival') ? window.localStorage.getItem('card_arrival') && item.subtitle.toLowerCase().trim() == window.localStorage.getItem('event')
              ?
              <div className="quiz-recipient-event-item-arrival">
                <span className="quiz-recipient-event-item-arrival-title">Arrival Date</span>
                <span className="quiz-recipient-event-item-arrival-date">{window.localStorage.getItem('card_arrival')}</span>
              </div>
              : 
              null
              :
              null
              } 

              {other == 'event' && item.subtitle.toLowerCase() == 'other' ? 
              <span className="quiz-recipient-event-item-other">
                <div className="quiz-recipient-event-item-other-input-container">

                  <input className="quiz-recipient-event-item-other-input" type="text" placeholder="Please specify" autoFocus value={quizState.event_other} onChange={(e) => (handleChange('event_other', e))}/>

                  <div className="quiz-recipient-event-item-other-input-svg" onClick={(e) => (e.stopPropagation(), setOther(false), setEnableCalendar('event-other'))}>
                    {checkmarkOther && <svg><use xlinkHref="sprite.svg#icon-checkmark"></use></svg>}
                  </div>
                </div>
              </span> 
              : null
              }
              
              {window.localStorage.getItem('event') ? enableCalendar == `event-${window.localStorage.getItem('event')}` && item.subtitle.toLowerCase().trim() == window.localStorage.getItem('event') ?
                <span className="quiz-recipient-event-item-calendar">
                    <Calendar
                      onClickDay={(date) => handleDate(date, window.localStorage.getItem('event').trim())}
                      value={calendar}
                      minDate={new Date(Date.now() + 12096e5)}
                    />
                </span>
                :
                null
                :
                null
                }
            </span>
            </div>
            )
            }
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'description')} disabled={quizState.card_arrival && quizState.event ? false : true}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.event && quizState.card_arrival && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'description')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          }
        </>
        }
        {quiz == 'description' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'events')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">What best describes {typeof window !== "undefined" ? window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient' : 'recipient'}?</div>
          <div className="quiz-title-mobile">What best describes {window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient'}?</div>
          <div className="quiz-subtitle">Select one.</div>
          <div className="quiz-subtitle-mobile">Select one.</div>
          <div className="quiz-recipient-description">
            <div className="quiz-recipient-description-container">
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" id="The life of a party" onClick={ (e) => handleCheckboxList(e, 'The life of a party')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                  <label htmlFor="The life of a party">The life of a party</label>
                </div>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" id="Soft spoken" onClick={ (e) => handleCheckboxList(e, 'Soft spoken')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                  <label htmlFor="Soft spoken">Soft spoken</label>
                </div>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" id="Thoughful" onClick={ (e) => handleCheckboxList(e, 'Thoughtful')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                  <label htmlFor="Thoughful">Thoughtful</label>
                </div>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" id="Strong minded" onClick={ (e) => handleCheckboxList(e, 'Strong minded')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                  <label htmlFor="Strong minded">Strong minded</label>
                </div>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" id="Super chill & down to earth" onClick={ (e) => handleCheckboxList(e, 'Super chill & down to earth')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                  <label htmlFor="Super chill & down to earth">Super chill & down to earth</label>
                </div>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" id="Other (please specify)" onClick={ (e) => handleCheckboxList(e, 'Other (please specify)')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                  <label htmlFor="Other (please specify)">Other (please specify)</label>
                </div>
              </div>
              <input type="text" className="quiz-recipient-description-other" value={quizState.description_other} onChange={ (e) => (window.localStorage.setItem('description_other', e.target.value.toLowerCase()), dispatch({type: 'UPDATE_CHANGE', name: 'description_other', payload: e.target.value.toLowerCase()}))} disabled={quizState.description == 'other (please specify)' ? false : true} required={quizState.description == 'other (please specify)' ? true : false}/>
            </div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'ranking')} disabled={quizState.description.length < 1 ? true : quizState.description == 'other (please specify)' ? quizState.description_other.length < 1 ? true : false : false}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.description.length < 1 ?  null : 
            quizState.description == 'other (please specify)' ? 
            quizState.description_other.length < 1 ? null : 
            <div className="quiz-next" onClick={(e) => quizProgressNav(e,'ranking')}>
              <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
            </div>
            :
            <div className="quiz-next" onClick={(e) => quizProgressNav(e,'ranking')}>
              <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
            </div>
          }
        </>
        }
        {quiz == 'ranking' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'description')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">How would you rank the styles that describe your {typeof window !== "undefined" ? window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient' : 'recipient'}?</div>
          <div className="quiz-title-mobile">Rate the cards for {recipient ? recipient : 'recipient'}.</div>
          <div className="quiz-subtitle">Please drag and drop.</div>
          <div className="quiz-subtitle-mobile">Please drap and drop.</div>
          <div className="quiz-recipient-style">
            {stylesList.map( (item, idx) => 
            <div key={idx} onDragOver={(e)=> onDragOver(e)} onDrop={(e) => onDropBack(e)}  className="quiz-recipient-style-item-container">
              <div id={`styles-${idx}`} draggable onDragStart={(e) => onDragStart(e)}  style={{transform: `rotate(${item.rotate}deg)`}} className="quiz-recipient-style-item">
                {item.imageName ? <img src={`/media/styles/${item.imageName}`}></img> : null}
                <span >{item.subtitle}</span>
              </div>
            </div>
            )
            }
          </div>
          <div className="quiz-recipient-style-drop">
            {stylesListDrop.map( (item, idx) => 
            <div onDrop={(e) => onDrop(e, idx)} onDragOver={(e)=> onDragOver(e)} key={idx} className="quiz-recipient-style-drop-item" style={{border: `2px solid ${item.color}`}}><span style={{backgroundColor: `${item.color}`}}>{idx + 1}</span></div>
            )
            }
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'tags')} disabled={quizState.rank.length < 6 ? true : false}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.rank.length >= 6 && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'tags')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          }
        </>
        }
        {quiz == 'tags' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'ranking')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Anything specific theme your {typeof window !== "undefined" ? window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient' : 'recipient'} might like?</div>
          <div className="quiz-title-mobile">Anything specific theme your {typeof window !== "undefined" ? window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient' : 'recipient'} might like?</div>
          <div className="quiz-subtitle">Animals, flowers, foods etc. Add one theme at a time as many as you'd like!</div>
          <div className="quiz-subtitle-mobile">Animals, flowers, foods etc. Add one theme at a time as many as you'd like!</div>
          <div className="quiz-recipient-tags">
            <div className={`quiz-recipient-tags-box ` + (invalid_tag ? ` form-message-error-outline` : null)}>
              <input type="hidden" name="tags" id="tagValue" value="" required></input>
              <input type="text" id="researchInterests" name="tags" value={tags} onChange={ (e) => (setTags(e.target.value), setMessage(''))} onKeyPress={(e) => handleKeyPress(e)}/>
              <button onClick={(e) => handleKeyPress(e, 'true')}>Add</button>
            </div>
            {message ? <div className="form-message-error">{message}</div> : <div className="form-message-error">&nbsp;</div>}
            <div className="form-tag-container"></div>
            <div className="quiz-recipient-tags-checkbox"><input type="checkbox" name="unsure" onClick={(e) => (setTimeout(() => {
              quizProgressNav(e,'other')
            }, 500), dispatch({type: 'UPDATE_TAGS_QUIZ', payload: []})
            )}/><span>I'm not sure</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'other')} disabled={quizState.tags ? quizState.tags.length < 1 ? true : false : null}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.tags && quizState.tags.length >= 1 && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'other')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          }
        </>
        }
        {quiz == 'other' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'tags')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Is there anything else you want us to know or any designs we should avoid?</div>
          <div className="quiz-title-mobile">Is there anything else you want us to know or any designs we should avoid?</div>
          <div className="quiz-subtitle">Color, theme, animals, etc.</div>
          <div className="quiz-subtitle-mobile">Color, theme, animals, etc.</div>
          <div className="quiz-recipient-other">
            <textarea type="text" name="other" cols="100" value={quizState.other !== 'blank' ? quizState.other : ''} onChange={ (e) => (uncheckOther(), handleChange('other', e))}/>
            <div className="quiz-recipient-other-checkbox"><input id="other" type="checkbox" name="other" value="blank" onClick={(e) => e.target.checked 
              ? 
              (handleChange('other', e),
                setTimeout(() => {
                  quizProgressNav(e,'package')
                }, 500)
              ) 
            
              : 
              (window.localStorage.setItem('other', ''),
              dispatch({type: 'UPDATE_CHANGE', name: 'other', payload: ''})
              )
              }/><span>Nope</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" disabled={quizState.other.length < 1 ? true : false} onClick={(e) => quizProgressNav(e,'package')}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.other && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'package')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>}
        </>
        }
        {quiz == 'involvement' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'other')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">How involved would like to be with the design process?</div>
          <div className="quiz-title-mobile">How involved would like to be with the design process?</div>
          <div className="quiz-subtitle">Select one.</div>
          <div className="quiz-subtitle-mobile">Select one.</div>
          <div className="quiz-recipient-involvement">
            <div className="quiz-recipient-involvement-item" onClick={(e) => (quizProgress(e,'package'), handleChange('involvement', e))}>Not at all <span>I give full freedom to the artist to be adventurous with the design.</span></div>
            <div className="quiz-recipient-involvement-item" onClick={(e) => (quizProgress(e,'package'), handleChange('involvement', e))}>Somewhat <span>I have some ideas, but not sure.</span></div>
            <div className="quiz-recipient-involvement-item" onClick={(e) => (quizProgress(e,'package'), handleChange('involvement', e))}>Very <span>I have each detail of the design figured out.</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'package')} disabled={quizState.involvement.length < 1 ? true : false}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.involvement && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'package')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>}
        </>
        }
        {quiz == 'package' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'other')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Choose an annual plan</div>
          <div className="quiz-title-mobile">Choose an annual plan</div>
          <div className="quiz-recipient-package">
            <div className="quiz-recipient-package-item">
              <div className="quiz-recipient-package-item-title">Best Deal</div>
              <div className="quiz-recipient-package-item-subtitle">You get 20 cards annually</div>
              <div className="quiz-recipient-package-item-image-container">
                <img src={`/media/package/standard.png`} alt="" />
              </div>
              <div className="quiz-recipient-package-item-price">$6.99 per card</div>
              {/* <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div> */}
              <button className="quiz-recipient-package-item-button" onClick={ (e) => (quizProgressNav(e,'mail'), handleChange('package_plan', e, null, 'best deal', 20))}>Select</button>
              <div>Free Shipping</div>
            </div>
            <div className="quiz-recipient-package-item">
              <div className="quiz-recipient-package-item-title">Better Deal</div>
              <div className="quiz-recipient-package-item-subtitle">You get 10 cards annually</div>
              <div className="quiz-recipient-package-item-image-container">
                <img src={`/media/package/standard.png`} alt="" />
              </div>
              <div className="quiz-recipient-package-item-price">$9.99 per card</div>
              {/* <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div> */}
              <button className="quiz-recipient-package-item-button" onClick={ (e) => (quizProgressNav(e,'mail'), handleChange('package_plan', e, null, 'better deal', 10))}>Select</button>
              <div>Free Shipping</div>
            </div>
            <div className="quiz-recipient-package-item">
              <div className="quiz-recipient-package-item-title">Good Deal</div>
              <div className="quiz-recipient-package-item-subtitle">You get 5 cards annually</div>
              <div className="quiz-recipient-package-item-image-container">
                {/* {packageList.slice(3, 6).map((item, idx) =>
                  <img key={idx} style={{transform: `rotate(${item.rotate}deg)`}} src={`/media/package/${item.image}`} alt="" />
                )} */}
                <img src={`/media/package/standard.png`} alt="" />
              </div>
              <div className="quiz-recipient-package-item-price">$11.99 per card</div>
              {/* <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div> */}
              <button className="quiz-recipient-package-item-button" onClick={ (e) => (quizProgressNav(e,'mail'), handleChange('package_plan', e, null, 'good deal', 5))}>Select</button>
              <div>Free Shipping</div>
            </div>
            <div className="quiz-recipient-package-item">
              <div className="quiz-recipient-package-item-title">Customize It</div>
              <div className="quiz-recipient-package-item-subtitle">Enter number of cards</div>
              <div className="quiz-recipient-package-item-input">
                <input id="custom_quantity" type="text" value={quizState.package_quantity} placeholder="Number of Cards" onChange={(e) => (setResult(''), validateIsNumber('custom_quantity'), handleChange('package_plan', e, null, 'custom', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Number of Cards'} onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    calculate()
                  }
                }}/>
              </div>
              {!result && <button className="quiz-recipient-package-item-button mb-2" onClick={ () => (calculate())}>Calculate</button>
              }
              {result && <button className="quiz-recipient-package-item-button mb-2" onClick={ (e) => (quizProgressNav(e,'mail'))}>Select & Continue</button>
              }
              {result && <>
              <div className="quiz-recipient-package-item-price">${result} per card</div>
              <div>Free Shipping</div>
              </>}
              {message && <div className="form-message-error">{message}</div>}
            </div>
          </div>
          <Slider result={result} setresult={setResult} calculate={calculate} quizProgressNav={quizProgressNav} handleChange={handleChange} validateisnumber={validateIsNumber} quizstate={quizState} message={message} setMessage={setMessage}></Slider>
          <div className="quiz-recipient-package-bulk">For more than 50 cards, please <a href="">contact us</a></div>
          <div className="quiz-recipient-package-footer">All packages come with the following items <span>at no extra cost</span></div>
          <div className="quiz-recipient-package-footer-2">
            <div className="quiz-recipient-package-footer-2-item">
              USPS Forever First Class Stamps
            </div>
            <div className="quiz-recipient-package-footer-2-item">
              Envelope
            </div>
            <div className="quiz-recipient-package-footer-2-item">
              Blank or preselected message inside the card
            </div>
          </div>
          {/* <div className="quiz-recipient-package-description">
              <div className="quiz-recipient-package-description-title">All cards are 5 x 7 (A7 Folded) and include: </div>
                <div className="quiz-recipient-package-description-text">• Handwritten address on the envelope.</div>
                <div className="quiz-recipient-package-description-text">• Recipients name in front of card.</div>
                <div className="quiz-recipient-package-description-text">• Blank or Preselected message inside the card (2-3 sentences)</div>
              <div className="quiz-recipient-package-description-title">Optional </div>
              <div className="quiz-recipient-package-description-text">• You can add handwritten message inside the card for extra $1.00. 
                <div className="quiz-recipient-package-description-text-bubble">
                  <svg onMouseOver={(e) => showTooltip(e, 0)} onMouseLeave={(e) => hideTooltip(e, 0)}><use xlinkHref="sprite.svg#icon-information"></use></svg>
                  <div className="quiz-recipient-package-description-text-bubble-tooltip">
                  Our team of artists will beautifully handwrite your message inside the card
                  </div>
                </div>
              </div>
              <div className="quiz-recipient-package-description-text">• Get advice on what to write inside the card for extra $2.00. 
                <div className="quiz-recipient-package-description-text-bubble">
                  <svg onMouseOver={(e) => showTooltip(e, 1)} onMouseLeave={(e) => hideTooltip(e, 1)}><use xlinkHref="sprite.svg#icon-information"></use></svg>
                  <div className="quiz-recipient-package-description-text-bubble-tooltip">
                  Don’t know what to write? We got you! We’ll give you options on what you could write inside the card.
                  </div>
                </div>
              </div>
          </div> */}
          {/* <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'mail')} disabled={quizState.package_plan.length < 1 ? true : false}>Next</button><div className="quiz-button-container"></div></div> */}
          {quizState.package_plan == 'custom' ? 
          result ?
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'mail')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          : 
          null
          :
          quizState.package_plan ? 
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'mail')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          : 
          null
          }
        </>
        }
        {quiz == 'mail' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'package')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Where should we mail your card?</div>
          <div className="quiz-title-mobile">Where should we mail your card?</div>
          <div className="quiz-recipient-mail">
            <div id="mail_to_user" className="quiz-recipient-mail-item" onClick={(e) => (setAddress('me'), quizProgress(e, 'mail'))}>
              To me
            </div>
            <div id="mail_to_recipient" className="quiz-recipient-mail-item" onClick={(e) => (setAddress('recipient'), quizProgress(e, 'mail'))}>
              To {typeof window !== 'undefined' ? window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : window.localStorage.getItem('recipient_other') ? window.localStorage.getItem('recipient_other') : ' the recipient' : ' the recipient'}
            </div>
          </div>
          {address == 'me' &&
          <div className="quiz-recipient-mail-address">
            <div className="quiz-recipient-mail-address-container">
              <div className="quiz-recipient-mail-address-heading">Your address:</div>
              <form>
                <div className="form-group-single mail">
                  <input type="text" placeholder="Full Name" value={quizState.name} onChange={ (e) => handleChange('mail', e, null, 'name')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Full Name'} required/>
                </div>
                <PlacesAutocomplete value={quizState.address_one} onChange={(e) => handleChange('mail_api', e, null, 'address_one')} onSelect={(e) => (handleSelect('mail', e, null, 'address_one', document.getElementById('address_place_id').value))} searchOptions={searchOptionsAddress}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="form-group-single mail form-autocomplete-container">
                      <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'Address Line 1'})} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address Line 1'} required/>
                      {loading ? <div>...loading</div> : null}
                      {suggestions.map((suggestion, idx) => {
                        const className = suggestion.active
                        ? 'form-autocomplete-suggestion-active'
                        : 'form-autocomplete-suggestion';
                        const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                        return <div  className="form-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}<input id="address_place_id" value={suggestion.placeId} readOnly/></div> 
                      })}
                      {/* <input type="text" placeholder="Address Line 1" value={quizState.address_one} onChange={ (e) => handleChange('mail', e, null, 'address_one')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address Line 1'} required/> */}
                    </div>
                  )}
                </PlacesAutocomplete>
                <PlacesAutocomplete value={quizState.address_two} onChange={(e) => handleChange('mail_api', e, null, 'address_two')} onSelect={(e) => {handleSelect('mail', e, null, 'address_two')}} searchOptions={searchOptionsAddress}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="form-group-single mail form-autocomplete-container_2">
                      <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'Address Line 2'})} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address Line 2'}/>
                      {loading ? <div>...loading</div> : null}
                      {suggestions.map((suggestion, idx) => {
                        const className = suggestion.active
                        ? 'form-autocomplete-suggestion-active'
                        : 'form-autocomplete-suggestion';
                        const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                        return <div  className="form-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}</div> 
                      })}
                    </div>
                  )}
                </PlacesAutocomplete>
                <PlacesAutocomplete value={quizState.city} onChange={(e) => handleChange('mail_api', e, null, 'city')} onSelect={(e) => {handleSelect('mail', e, null, 'city')}} searchOptions={searchOptionsCities}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="form-group-double mail form-autocomplete-container_3">
                      <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'City'})} required/>
                      <div className="form-group-double-dropdown">
                        <input type="text" placeholder="State" value={quizState.state} onChange={ (e) => handleChange('mail', e, null, 'state')} onFocus={(e) => (e.target.placeholder = '', setStateList(true))} readOnly required/>
                        {state_list && 
                        <div className="form-group-double-dropdown-list" ref={node}>
                            <div className="form-group-double-dropdown-list-container">
                              {usStates.map( (item, idx) => (
                                <div className="form-group-double-dropdown-list-item" onClick={(e) => (handleChange('mail_item', item.abbreviation, null, 'state'), setStateList(false))} key={idx} >{item.name}</div>
                              ))
                              }
                          </div>
                        </div>
                        }
                      </div>
                      {loading ? <div>...loading</div> : null}
                      {suggestions.map((suggestion, idx) => {
                        const className = suggestion.active
                        ? 'form-autocomplete-suggestion-active'
                        : 'form-autocomplete-suggestion';
                        const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                        return <div  className="form-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}</div> 
                      })}
                      {/* <input type="text" placeholder="Address Line 1" value={quizState.address_one} onChange={ (e) => handleChange('mail', e, null, 'address_one')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address Line 1'} required/> */}
                    </div>
                  )}
                </PlacesAutocomplete>
                {/* <div className="form-group-double mail">
                  <input type="text" placeholder="City" value={quizState.city} onChange={ (e) => handleChange('mail', e, null, 'city')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'City'} required/>
                  <input type="text" placeholder="State" value={quizState.state} onChange={ (e) => handleChange('mail', e, null, 'state')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'State'} required/>
                </div> */}
                <div className="form-group-single mail">
                  <input type="text" placeholder="Zip Code" value={quizState.zip_code} onChange={ (e) => (handleChange('mail', e, null, 'zip_code'))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Zip Code'} required/>
                </div>
                {/* <button onClick={(e) => handleZipCode(e)} className="form-button mail-button" disabled={ handleFormDisableButtons('mail') ? true : false}>Add Address</button> */}
                {message && <div className="form-message-error">{message}</div>}
              </form>
            </div>
          </div>
          }
          {address == 'recipient' &&
            <div className="quiz-recipient-mail-address">
              {/* <div className="form-group-single checkbox">
                <input type="checkbox" onClick={ (e) => (dispatch({type: 'UPDATE_CHANGE', name: 'mail_to', payload: 'email recipient to asks for their address'}), window.localStorage.setItem('mail_to', 'email recipient to asks for their address'), dispatch({type: 'RESET_MAIl'}), resetMail(), setTimeout(() => {
                  quizProgressNav(e,'message')
                }, 500))}/>
                <span>I don’t know their address, email them for me to ask for their address</span>
              </div> */}
              <div className="quiz-recipient-mail-address-container">
                <form>
                  <div className="form-group-single  mail">
                    <input type="text" placeholder="Full Name" value={quizState.name} onChange={ (e) => handleChange('mail', e, null, 'name')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Full Name'} required/>
                  </div>
                  <PlacesAutocomplete value={quizState.address_one} onChange={(e) => handleChange('mail_api', e, null, 'address_one')} onSelect={(e) => {handleSelect('mail', e, null, 'address_one', document.getElementById('address_place_id').value)}} searchOptions={searchOptionsAddress}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="form-group-single mail form-autocomplete-container">
                      <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'Address Line 1'})} required/>
                      {loading ? <div>...loading</div> : null}
                      {suggestions.map((suggestion, idx) => {
                        const className = suggestion.active
                        ? 'form-autocomplete-suggestion-active'
                        : 'form-autocomplete-suggestion';
                        const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                        return <div  className="form-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}<input id="address_place_id" value={suggestion.placeId} readOnly/></div> 
                      })}
                      {/* <input type="text" placeholder="Address Line 1" value={quizState.address_one} onChange={ (e) => handleChange('mail', e, null, 'address_one')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address Line 1'} required/> */}
                    </div>
                  )}
                  </PlacesAutocomplete>
                  <PlacesAutocomplete value={quizState.address_two} onChange={(e) => handleChange('mail_api', e, null, 'address_two')} onSelect={(e) => {handleSelect('mail', e, null, 'address_two')}} searchOptions={searchOptionsAddress}>
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div className="form-group-single mail form-autocomplete-container_2">
                        <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'Address Line 2'})}/>
                        {loading ? <div>...loading</div> : null}
                        {suggestions.map((suggestion, idx) => {
                          const className = suggestion.active
                          ? 'form-autocomplete-suggestion-active'
                          : 'form-autocomplete-suggestion';
                          const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                          return <div  className="form-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}</div> 
                        })}
                      </div>
                    )}
                  </PlacesAutocomplete>
                  <PlacesAutocomplete value={quizState.city} onChange={(e) => handleChange('mail_api', e, null, 'city')} onSelect={(e) => {handleSelect('mail', e, null, 'city')}} searchOptions={searchOptionsCities}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="form-group-double mail form-autocomplete-container_3">
                      <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'City'})} required/>
                      {/* <input type="text" placeholder="State" value={quizState.state} onChange={ (e) => handleChange('mail', e, null, 'state')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'State'} required/> */}
                      <div className="form-group-double-dropdown">
                        <input type="text" placeholder="State" value={quizState.state} onChange={ (e) => handleChange('mail', e, null, 'state')} onFocus={(e) => (e.target.placeholder = '', setStateList(true))} readOnly required/>
                        {state_list && 
                        <div className="form-group-double-dropdown-list" ref={node}>
                            <div className="form-group-double-dropdown-list-container">
                              {usStates.map( (item, idx) => (
                                <div className="form-group-double-dropdown-list-item" onClick={(e) => (handleChange('mail_item', item.abbreviation, null, 'state'), setStateList(false))} key={idx} >{item.name}</div>
                              ))
                              }
                          </div>
                        </div>
                        }
                      </div>
                      {loading ? <div>...loading</div> : null}
                      {suggestions.map((suggestion, idx) => {
                        const className = suggestion.active
                        ? 'form-autocomplete-suggestion-active'
                        : 'form-autocomplete-suggestion';
                        const style = suggestion.active ? {backgroundColor: '#003e5f', cursor: 'pointer'} : {backgroundColor: '#fff', cursor: 'pointer'}
                        return <div  className="form-autocomplete-box" key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}</div> 
                      })}
                      {/* <input type="text" placeholder="Address Line 1" value={quizState.address_one} onChange={ (e) => handleChange('mail', e, null, 'address_one')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address Line 1'} required/> */}
                    </div>
                  )}
                </PlacesAutocomplete>
                  {/* <div className="form-group-double mail">
                    <input type="text" placeholder="City" value={quizState.city} onChange={ (e) => handleChange('mail', e, null, 'city')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'City'} required/>
                    <input type="text" placeholder="State" value={quizState.state} onChange={ (e) => handleChange('mail', e, null, 'state')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'State'} required/>
                  </div> */}
                  <div className="form-group-single mail">
                    <input type="text" placeholder="Zip Code" value={quizState.zip_code} onChange={ (e) => (handleChange('mail', e, null, 'zip_code'))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Zip Code'} required/>
                  </div>
                  {/* <button onClick={(e) => handleZipCode(e)} className="form-button mail-button" disabled={ handleFormDisableButtons('mail') ? true : false}>Add Address</button> */}
                  {message && <div className="form-message-error">{message}</div>}
                </form>
              </div>
            </div>
          }
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => (handleZipCode(e))} disabled={ handleFormDisableButtons('mail') ? true : false}>Next</button><div className="quiz-button-container"></div></div>
          {handleFormProgressButtons('mail') && <div className="quiz-next" onClick={(e) => (handleZipCode(e))}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>}
        </>
        }
        {quiz == 'message' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'mail')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">What would you like the card to say?</div>
          <div className="quiz-title-mobile">What would you like the card to say?</div>
          {/* <div className="quiz-subtitle">Fill in the blank!</div>
          <div className="quiz-subtitle-mobile">Fill in the blank!</div> */}
          <div className="quiz-recipient-message">
            <div className="quiz-recipient-message-heading">Card: {typeof window !== 'undefined' ? window.localStorage.getItem('event') ? window.localStorage.getItem('event') : quizState.event ? quizState.event : 'event' : null}</div>
            <div className="quiz-recipient-message-container">
              <form>
                {/* <div className="form-group-single message">
                  <label htmlFor="name">Name/Nickname in front of the card:</label>
                  <input type="text" name="name" required value={quizState.nickname == 'blank' ? '' : quizState.nickname} onChange={(e) => (handleChange('nickname', e, null, e.target.value), document.getElementsByName('nickname_blank')[0].checked = false)}/>
                  <div className="checkbox_2"><input id="nickname" type="checkbox" name="nickname_blank" onClick={(e) => handleChange('nickname', e, null, 'blank')}/><span>Leave it blank</span></div>
                </div> */}
                <div className="form-group-single message p-0">
                  <label htmlFor="message">Handwritten message inside:</label>
                  <textarea className="w-4" rows="5" value={quizState.message == 'blank' || quizState.message == 'message_options' ? '' : quizState.message} onChange={(e) => (handleChange('message', e, null, e.target.value), document.getElementsByName('message_blank')[0].checked = false, document.getElementsByName('message_textarea_blank')[0].checked = false)}></textarea>
                  <div className="checkbox_2"><input type="checkbox" name="message_blank" onChange={(e) => (handleChange('message', e, null, 'blank'), document.getElementsByName('message_textarea_blank')[0].checked = false)}/><span>Leave it blank</span></div>
                  <div className="checkbox_2 w-4 info-popup"><input type="checkbox" name="message_textarea_blank" onClick={(e) => (handleChange('message', e, null, 'message_options'), document.getElementsByName('message_blank')[0].checked = false)}/>
                    <span className="checkbox_2-message">Give me message options for $2.00</span>
                    <div className="quiz-recipient-package-description-text-bubble">
                      <svg onMouseOver={(e) => showTooltip(e, 0)} onMouseLeave={(e) => hideTooltip(e, 0)}><use xlinkHref="sprite.svg#icon-information"></use></svg>
                      <div className="quiz-recipient-package-description-text-bubble-tooltip">
                      We got you! We’ll send you different message options for just $2.00 per card once you sign up.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group-single message p-0">
                  <label htmlFor="name">Signature:</label>
                  <input type="text" name="signature" required value={quizState.signature == 'blank' ? '' : quizState.signature} onChange={(e) => handleChange('signature', e, null, e.target.value)}/>
                </div>
              </form>
              <div className="checkbox_2 center show-on-mobile"><input type="checkbox"/><span>Not sure yet, ask me later</span></div>
            </div>
          </div>
          <div className="checkbox_2 center hide-on-mobile"><input id="message_unsure" type="checkbox" onClick={(e) => e.target.checked ? (window.localStorage.setItem('message_later', 'not_sure'), resetMessage(), setMessageLater(false)) : (window.localStorage.removeItem('message_later'), setMessageLater(false))}/><span>Not sure yet, ask me later</span></div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => window.location.href = '/checkout'} disabled={message_later}>Continue</button><div className="quiz-button-container"></div></div>
          {/* {handleFormProgressButtons('message') && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'description')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          } */}
        </>
        }
      </div>
      <Footer></Footer>
    </>
  )
}

const mapStateToProps = state => {
  return {
    quizState: state.recipient
  }
}

export default connect(mapStateToProps)(withUserQuiz(quiz))
