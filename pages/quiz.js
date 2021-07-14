import Nav from '../components/nav'
import Footer from '../components/footer'
import withUser from './withUser'
import Slider from '../components/slider/slider'
import {useState, useEffect} from 'react'
import {eventsList, stylesList, stylesListDrop, packageList, usStates} from '../utils/quiz'
import {manageTags} from '../helpers/forms'
import { useDispatch, connect } from 'react-redux'
import {useRouter} from 'next/router'
import {nanoid} from 'nanoid'
import PlacesAutocomplete from 'react-places-autocomplete'
import axios from 'axios'
import {API} from '../config'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const quiz = ({quizState}) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [quiz, setQuiz] = useState('recipient')
  const [recipient, setRecipient] = useState('')
  const [toggleEvents, setToggleEvents] = useState(false)
  const [events, setEvents] = useState(toggleEvents ? parseInt('8') : parseInt('20'))
  const [address, setAddress] = useState('')
  const [tags, setTags] = useState('')
  const [state_list, setStateList] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // manageTags('interests', quizState.tags)
    if(window.localStorage.getItem('quiz_question')) window.localStorage.getItem('quiz_question').length > 0 ? window.localStorage.getItem('quiz_question') == 'checkout' ? window.location.href = '/checkout' : setQuiz(window.localStorage.getItem('quiz_question')) : null
  }, [])

  const quizProgress = (e, next) => {
    if(next == 'ranking') (window.localStorage.removeItem('rank'), dispatch({type: 'RESET_RANK', name: 'ranking', payload: []}))
    window.localStorage.setItem('quiz_question', quiz)
    let els = document.querySelectorAll('.quiz-recipient-item')
    let els2 = document.querySelectorAll('.quiz-recipient-age-item')
    let els3 = document.querySelectorAll('.quiz-recipient-event-item')
    let els4 = document.querySelectorAll('.quiz-recipient-involvement-item')
    let els5 = document.querySelectorAll('.quiz-recipient-mail-item')

    els.forEach( (el) => {el.classList.remove("quiz-recipient-item-active")})
    els2.forEach( (el) => {el.classList.remove("quiz-recipient-age-item-active")})
    els3.forEach( (el) => {el.classList.remove("quiz-recipient-age-event-active")})
    els4.forEach( (el) => {el.classList.remove("quiz-recipient-involvement-item-active")})
    els5.forEach( (el) => {el.classList.remove("quiz-recipient-mail-item-active")})

    els.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-item-active") : null})
    els2.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-age-item-active") : null})
    els3.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-event-item-active") : null})
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
      try {
        const responseTag = await axios.post(`${API}/recipient/check-word`, {tags})
        
      } catch (error) {
        if(error) return  error.response ? setMessage(error.response.data) : setMessage('Invalid tag')
      }
      e.preventDefault();
      manageTags('addTag')
      let closeIcon = document.querySelectorAll('.form-tag')
      let postHidden = document.getElementById("tagValue")
      let values = postHidden.getAttribute('value').split(',')

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
            type: 'UPDATE_TAGS',
            payload: newValues
          })
        })
      })

      dispatch({
        type: 'UPDATE_TAGS',
        payload: values
      })
      setTags('')
    }
  }

  // HANDLE CHANGE
  const handleChange = (question, e, idx, type) => {
    if(question == 'ranking'){
      let span = e.querySelectorAll('span')
      let ranking = new Object()

      ranking.style = span[0].textContent.toLowerCase()
      ranking.rank = idx + 1
      
      dispatch({type: 'UPDATE_RANK', name: question, payload: ranking})

      return 
    }

    if(question == 'avoid'){
      window.localStorage.setItem(question, e.target.value); 
      return dispatch({type: 'UPDATE_TEXTAREA', name:'avoid', payload: e.target.value})
    }

    if(question == 'other'){
      window.localStorage.setItem(question, e.target.value); 
      return dispatch({type: 'UPDATE_TEXTAREA', name:'other', payload: e.target.value})
    }

    if(question == 'package_plan'){
      window.localStorage.setItem(question, type)
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
      return dispatch({type: 'UPDATE_CHANGE', name: question, payload: type})
    }

    if(question == 'message'){
      window.localStorage.setItem(question, type)
      return dispatch({type: 'UPDATE_TEXTAREA', name: question, payload: type})
    }

    if(question == 'signature'){
      window.localStorage.setItem(question, type)
      return dispatch({type: 'UPDATE_CHANGE', name: question, payload: type})
    }
    console.log(e.target.textContent.toLowerCase())
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
      if(quizState.nickname.length < 1){ inputs.push('true')}
      if(quizState.message.length < 1){ inputs.push('true')}
      if(quizState.signature.length < 1){ inputs.push('true')}

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

      // console.log(/^\d{5}(-\d{4})?$/.test(quizState.zip_code))
      
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

  const handleSelect = async (question, e, idx, type) => {
    console.log(e.split(','))
    if(question == 'mail'){
      window.localStorage.setItem(type, e.split(',')[0])
      return dispatch({type: 'UPDATE_CHANGE', name: type, payload: e.split(',')[0]})
    }
  }

  const handleZipCode = (e) => {
    e.preventDefault()
    if(!/^\d{5}(-\d{4})?$/.test(quizState.zip_code)) return setMessage('Zip code is invalid');
    quizProgressNav(e, 'message')
  }
  
  return (
    
    <>
      <Nav></Nav>
      <div className="quiz">
        {quiz == 'recipient' && <>
          <div className="quiz-title">Who are we sending a card to?</div>
          <div className="quiz-title-mobile">Who are we sending a card to?</div>
          <div className="quiz-subtitle">For now just pick <span>one person</span>. Later, you can finish adding other loved ones in your profile.</div>
          <div className="quiz-subtitle-mobile">For now just pick <span>one person</span>. Later, you can finish adding other loved ones in your profile.</div>
          <div className="quiz-recipient">
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Friend</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Partner</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Mom</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Dad</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Sister</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Brother</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Grandma</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Grandpa</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Daughter</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), handleChange('recipient', e))}>Other</div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e, 'age')} disabled={quizState.recipient.length < 1 ? true : false}>Next</button></div>
          {quizState.recipient && <div className="quiz-next" onClick={(e) => quizProgressNav(e, 'age')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>}
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
          <div className="quiz-title">What are the events you'd like to send cards for your {window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient'}?</div>
          <div className="quiz-title-mobile">Select an event for {quizState.recipient ? quizState.recipient : 'recipient'}.</div>
          <div className="quiz-subtitle">Pick one or more events. Select the estimated arrival date for each card. Make sure it's at least 3 weeks away!</div>
          <div className="quiz-subtitle-mobile">Select the estimated arrival date for the event.</div>
          <div className="quiz-recipient-event">
            {eventsList.slice(0, toggleEvents ? 20 : 8).map( (item, idx) => 
            <div key={idx} className={`quiz-recipient-event-item`} onClick={(e) => item.subtitle == 'more' ? setToggleEvents(!toggleEvents) : (quizProgress(e,'ranking'), handleChange('event', e))}>
              {item.imageName ? <img src={`/media/emojis/${item.imageName}`}></img> : null}
              <span className={item.subtitle == 'more' ? 'expand' : null}>{item.subtitle == 'more' ? toggleEvents ? 'less' : 'more' : item.subtitle}</span>
            </div>
            )
            }
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'ranking')} disabled={quizState.event.length < 1 ? true : false}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.event && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'ranking')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          }
        </>
        }
        {quiz == 'ranking' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'events')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">How would you rank the styles that describe your {window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient'}?</div>
          <div className="quiz-title-mobile">Rate the cards for {recipient ? recipient : 'recipient'}.</div>
          <div className="quiz-subtitle">How would you rank the styles that describe your {recipient ? recipient : 'recipient'}?</div>
          <div className="quiz-subtitle-mobile">What does {recipient ? recipient : 'recipient'} like? Drag and drog from 1 (most important) to 6 (least important).</div>
          <div className="quiz-recipient-style">
            {stylesList.map( (item, idx) => 
            <div key={idx} onDragOver={(e)=> onDragOver(e)} onDrop={(e) => onDropBack(e)}  className="quiz-recipient-style-item-container">
              <div id={`event-${idx}`} draggable onDragStart={(e) => onDragStart(e)}  style={{transform: `rotate(${item.rotate}deg)`}} className="quiz-recipient-style-item">
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
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'tags')} disabled={quizState.rank.length < 1 ? true : false}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.rank.length >= 1 && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'tags')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          }
        </>
        }
        {quiz == 'tags' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'ranking')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Anything specific your {window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient'} might like?</div>
          <div className="quiz-title-mobile">Anything specific your {window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : 'recipient'} might like?</div>
          <div className="quiz-subtitle">Animals, flowers, foods etc. Add as many words as you'd like!</div>
          <div className="quiz-subtitle-mobile">Animals, flowers, foods etc. Add as many words as you'd like!</div>
          <div className="quiz-recipient-tags">
            <div className="quiz-recipient-tags-box">
              <input type="hidden" name="tags" id="tagValue" value="" required></input>
              <input type="text" id="researchInterests" name="tags" value={tags} onChange={ (e) => (setTags(e.target.value), setMessage(''))} onKeyPress={(e) => handleKeyPress(e)}/>
              <button onClick={(e) => handleKeyPress(e, 'true')}>Add</button>
            </div>
            <div className="form-tag-container"></div>
            {message ? <div className="form-message-error-tags">{message}</div> : <div className="form-message-error-tags"></div>}
            <div className="quiz-recipient-tags-checkbox"><input type="checkbox" name="unsure" onClick={(e) => (setTimeout(() => {
              quizProgressNav(e,'other')
            }, 500), dispatch({type: 'UPDATE_TAGS', payload: []})
            )}/><span>I'm not sure</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'other')} disabled={quizState.tags.length < 1 ? true : false}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.tags.length >= 1 && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'other')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          }
        </>
        }
        {/* {quiz == 'avoid' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'tags')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Anything you want us to avoid?</div>
          <div className="quiz-title-mobile">Anything you want us to avoid?</div>
          <div className="quiz-subtitle">Color, theme, animals etc.</div>
          <div className="quiz-subtitle-mobile">Color, theme, animals etc.</div>
          <div className="quiz-recipient-avoid">
            <textarea type="text" name="avoid" cols="100" value={quizState.avoid} onChange={ (e) => handleChange('avoid', e)}/>
            <div className="quiz-recipient-avoid-checkbox"><input type="checkbox" name="avoid" onClick={(e) => setTimeout(() => {
              quizProgressNav(e,'other')
            }, 500)}/><span>Nope</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'other')} disabled={quizState.avoid.length < 1 ? true : false}>Next</button></div>
          {quizState.avoid && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'other')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>}
        </>
        } */}
        {quiz == 'other' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'tags')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Is there anything else you want us to know or any designs we should avoid?</div>
          <div className="quiz-title-mobile">Is there anything else you want us to know or any designs we should avoid?</div>
          <div className="quiz-subtitle">Color, theme, animals, etc.</div>
          <div className="quiz-subtitle-mobile">Color, theme, animals, etc.</div>
          <div className="quiz-recipient-other">
            <textarea type="text" name="other" cols="100" value={quizState.other !== 'blank' ? quizState.other : ''} onChange={ (e) => handleChange('other', e)}/>
            <div className="quiz-recipient-other-checkbox"><input type="checkbox" name="other" value="blank" onClick={(e) => (handleChange('other', e), setTimeout(() => {
              quizProgressNav(e,'involvement')
            }, 500))}/><span>Nope</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" disabled={quizState.other.length < 1 ? true : false} onClick={(e) => quizProgressNav(e,'involvement')}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.other && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'involvement')}>
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
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'involvement')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Choose a package</div>
          <div className="quiz-title-mobile">Choose a package</div>
          <div className="quiz-recipient-package">
            <div className="quiz-recipient-package-item">
              <div className="quiz-recipient-package-item-title">Standard</div>
              <div className="quiz-recipient-package-item-subtitle">Cards that you can recycle</div>
              <div className="quiz-recipient-package-item-image-container">
                <img src={`/media/package/standard.png`} alt="" />
                {/* {packageList.slice(0, 3).map((item, idx) =>
                  <img key={idx} style={{transform: `rotate(${item.rotate}deg)`}} src={`/media/package/${item.image}`} alt="" />
                )} */}
              </div>
              <div className="quiz-recipient-package-item-price">$8.99 /card</div>
              <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div>
              <button className="quiz-recipient-package-item-button" onClick={ (e) => (quizProgressNav(e,'mail'), handleChange('package_plan', e, null, 'standard'))}>Select</button>
              <div>Free Shipping</div>
            </div>
            <div className="quiz-recipient-package-item">
              <div className="quiz-recipient-package-item-title">Plantable</div>
              <div className="quiz-recipient-package-item-subtitle">Cards that you can plant</div>
              <div className="quiz-recipient-package-item-image-container">
                {/* {packageList.slice(3, 6).map((item, idx) =>
                  <img key={idx} style={{transform: `rotate(${item.rotate}deg)`}} src={`/media/package/${item.image}`} alt="" />
                )} */}
                <img src={`/media/package/plantable.png`} alt="" />
              </div>
              <div className="quiz-recipient-package-item-price">$10.99 /card</div>
              <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div>
              <button className="quiz-recipient-package-item-button" onClick={ (e) => (quizProgressNav(e,'mail'), handleChange('package_plan', e, null, 'plantable'))}>Select</button>
              <div>Free Shipping</div>
            </div>
          </div>
          <Slider quizProgressNav={quizProgressNav} handleChange={handleChange}></Slider>
          <div className="quiz-recipient-package-bulk">For bulk orders <a href="">click here</a></div>
          <div className="quiz-recipient-package-description">
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
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'mail')} disabled={quizState.package_plan.length < 1 ? true : false}>Next</button><div className="quiz-button-container"></div></div>
          {quizState.package_plan && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'mail')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>}
        </>
        }
        {quiz == 'mail' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'package')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Where should we mail your card?</div>
          <div className="quiz-title-mobile">Where should we mail your card?</div>
          <div className="quiz-recipient-mail">
            <div className="quiz-recipient-mail-item" onClick={(e) => (setAddress('me'), quizProgress(e))}>
              To me
            </div>
            <div className="quiz-recipient-mail-item" onClick={(e) => (setAddress('recipient'), quizProgress(e))}>
              To {window.localStorage.getItem('recipient') ? window.localStorage.getItem('recipient') : quizState.recipient ? quizState.recipient : ' the recipient'}
            </div>
          </div>
          {address == 'me' &&
          <div className="quiz-recipient-mail-address">
            <div className="quiz-recipient-mail-address-container">
              <div className="quiz-recipient-mail-address-heading">Your address:</div>
              <form>
                <div className="form-group-single  mail">
                  <input type="text" placeholder="Full Name" value={quizState.name} onChange={ (e) => handleChange('mail', e, null, 'name')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Full Name'} required/>
                </div>
                <PlacesAutocomplete value={quizState.address_one} onChange={(e) => handleChange('mail_api', e, null, 'address_one')} onSelect={(e) => {handleSelect('mail', e, null, 'address_one')}} searchOptions={searchOptionsAddress}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="form-group-single mail form-autocomplete-container">
                      <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'Address Line 1'})} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Address Line 1'} required/>
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
                        <input type="text" placeholder="State" value={quizState.state} onChange={ (e) => handleChange('mail', e, null, 'state')} onFocus={(e) => (e.target.placeholder = '', setStateList(true))} onBlur={(e) => (e.target.placeholder = 'State', setStateList(false))} required/>
                        {state_list && 
                        <div className="form-group-double-dropdown-list">
                            {/* TODO: Add state dropdown list */}
                            <div className="form-group-double-dropdown-list-container">
                              {usStates.map( (item, idx) => (
                                <div className="form-group-double-dropdown-list-item" onClick={(e) => (handleChange('mail_item', e.target.innerText, null, 'state'), setStateList(false))} key={idx} >{item.abbreviation}</div>
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
                <button onClick={(e) => handleZipCode(e)} className="form-button mail-button" disabled={ handleFormDisableButtons('mail') ? true : false}>Add Address</button>
                {message && <div className="form-message-error">{message}</div>}
              </form>
            </div>
          </div>
          }
          {address == 'recipient' &&
            <div className="quiz-recipient-mail-address">
              <div className="form-group-single checkbox">
                <input type="checkbox" onClick={ (e) => (dispatch({type: 'UPDATE_CHANGE', name: 'mail_to', payload: 'email recipient to asks for their address'}), setTimeout(() => {
                  quizProgressNav(e,'message')
                }, 500))}/>
                <span>I don’t know their address, email them for me to ask for their address</span>
              </div>
              <div className="quiz-recipient-mail-address-container">
                <form>
                  <div className="form-group-single  mail">
                    <input type="text" placeholder="Full Name" value={quizState.name} onChange={ (e) => handleChange('mail', e, null, 'name')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Full Name'} required/>
                  </div>
                  <PlacesAutocomplete value={quizState.address_one} onChange={(e) => handleChange('mail_api', e, null, 'address_one')} onSelect={(e) => {handleSelect('mail', e, null, 'address_one')}} searchOptions={searchOptionsAddress}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="form-group-single mail form-autocomplete-container">
                      <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'Address Line 1'})} required/>
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
                        <input type="text" placeholder="State" value={quizState.state} onChange={ (e) => handleChange('mail', e, null, 'state')} onFocus={(e) => (e.target.placeholder = '', setStateList(true))} onBlur={(e) => (e.target.placeholder = 'State')} required/>
                        {state_list && 
                        <div className="form-group-double-dropdown-list">
                            {/* TODO: Add state dropdown list */}
                            <div className="form-group-double-dropdown-list-container">
                              {usStates.map( (item, idx) => (
                                <div className="form-group-double-dropdown-list-item" onClick={(e) => (handleChange('mail_item', e.target.innerText, null, 'state'), setStateList(false))} key={idx} >{item.abbreviation}</div>
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
                  <button onClick={(e) => handleZipCode(e)} className="form-button mail-button" disabled={ handleFormDisableButtons('mail') ? true : false}>Add Address</button>
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
          <div className="quiz-subtitle">Fill in the blank!</div>
          <div className="quiz-subtitle-mobile">Fill in the blank!</div>
          <div className="quiz-recipient-message">
            <div className="quiz-recipient-message-heading">Mother's Day</div>
            <div className="quiz-recipient-message-container">
              <form>
                <div className="form-group-single message">
                  <label htmlFor="name">Name/Nickname in front of the card:</label>
                  <input type="text" name="name" required value={quizState.nickname == 'blank' ? '' : quizState.nickname} onChange={(e) => (handleChange('nickname', e, null, e.target.value), document.getElementsByName('nickname_blank')[0].checked = false)}/>
                  <div className="checkbox_2"><input type="checkbox" name="nickname_blank" onClick={(e) => handleChange('nickname', e, null, 'blank')}/><span>Leave it blank</span></div>
                </div>
                <div className="form-group-single message p-0">
                  <label htmlFor="message">Handwritten message inside:</label>
                  <textarea className="w-4" cols="100" rows="5" value={quizState.message == 'blank' || quizState.message == 'message_options' ? '' : quizState.message} onChange={(e) => (handleChange('message', e, null, e.target.value), document.getElementsByName('message_blank')[0].checked = false, document.getElementsByName('message_textarea_blank')[0].checked = false)}></textarea>
                  <div className="checkbox_2"><input type="checkbox" name="message_blank" onClick={(e) => (handleChange('message', e, null, 'blank'), document.getElementsByName('message_textarea_blank')[0].checked = false)}/><span>Leave it blank</span></div>
                  <div className="checkbox_2 w-4 info-popup"><input type="checkbox" name="message_textarea_blank" onClick={(e) => (handleChange('message', e, null, 'message_options'), document.getElementsByName('message_blank')[0].checked = false)}/>
                    <span>Give me message options for $2.00</span>
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
                  <input type="text" name="signature" required value={quizState.signature} onChange={(e) => handleChange('signature', e, null, e.target.value)}/>
                </div>
              </form>
              <div className="checkbox_2 center show-on-mobile"><input type="checkbox"onClick={ (e) => quizProgressNav(e,'description')} /><span>Not sure yet, ask me later</span></div>
            </div>
          </div>
          <div className="checkbox_2 center hide-on-mobile"><input type="checkbox" onClick={ (e) => quizProgressNav(e,'description')}/><span>Not sure yet, ask me later</span></div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'description')} disabled={ handleFormDisableButtons('message') ? true : false}>Next</button><div className="quiz-button-container"></div></div>
          {handleFormProgressButtons('message') && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'description')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
          }
        </>
        }
        {quiz == 'description' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'message')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">What best describes mom?</div>
          <div className="quiz-title-mobile">What best describes mom?</div>
          <div className="quiz-subtitle">Select one.</div>
          <div className="quiz-subtitle-mobile">Select one.</div>
          <div className="quiz-recipient-description">
            <div className="quiz-recipient-description-container">
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager" onClick={ (e) => handleCheckboxList(e, 'The life of a party')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>The life of a party</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager" onClick={ (e) => handleCheckboxList(e, 'Soft spoken')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Soft spoken</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager" onClick={ (e) => handleCheckboxList(e, 'Thoughtful')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Thoughful</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager" onClick={ (e) => handleCheckboxList(e, 'Strong minded')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Strong minded</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager" onClick={ (e) => handleCheckboxList(e, 'Super chill & down to earth')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Super chill & down to earth</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager" onClick={ (e) => handleCheckboxList(e, 'Other (please specify)')}/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Other (please specify)</label>
              </div>
              <input type="text" className="quiz-recipient-description-other" value={quizState.description_other == 'other (please specify)' ? '' : quizState.description_other} onChange={ (e) => (window.localStorage.setItem('description', e.target.value), dispatch({type: 'UPDATE_CHANGE', name: 'description_other', payload: e.target.value}))}/>
            </div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={() => (window.localStorage.setItem('quiz_question', 'checkout'), handleQuizID(), window.location.href = '/checkout')} disabled={quizState.description.length < 1 ? true : false}>Submit</button><div className="quiz-button-container"></div></div>
          {/* {quizState.description && <div className="quiz-next" onClick={() => handleRecipient()}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>} */}
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

export default connect(mapStateToProps)(withUser(quiz))
