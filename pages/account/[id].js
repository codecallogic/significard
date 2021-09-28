import withUser from '../withUser'
import Nav from '../../components/nav'
import Footer from '../../components/footer'
import SVG from '../../files/svgs'
import { useState, useEffect, useRef } from 'react'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'
import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByPlaceId } from 'react-places-autocomplete'
import {usStates,eventsList} from '../../utils/quiz'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import {manageTags} from '../../helpers/forms'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const User = ({newUser, recipients, recipient, editRecipient, updateTags}) => {
  const myRefs = useRef(null)
  const node = useRef();
  // console.log(recipients)
  const [sideNav, setSideNav] = useState('recipients')
  const [recipientID, setRecipient] = useState('')
  const [edit, setEdit] = useState('')
  const [input_dropdown, setInputDropdown] = useState('')
  const [modal, setModal] = useState('')
  const [state_list, setStateList] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')
  const [cardMenu, setCardMenu] = useState('')
  const [allRecipients, setAllRecipients] = useState(recipients ? recipients : null)
  const [toggleEvents, setToggleEvents] = useState(false)
  const [other, setOtherEvent] = useState(false)
  const [enableCalendar, setEnableCalendar] = useState('')
  const [calendar, setCalendar] = useState(new Date())
  const [checkmarkOther, setCheckmarkOther] = useState(false)
  const [tags, setTags] = useState('')
  const [invalid_tag, setInvalidTag] = useState(false)

  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
      }
    }
  }

  useEffect(() => {
    setEnableCalendar(``)
    setOtherEvent('')
  }, [calendar])

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])

  useEffect(() => {
    recipients.filter((item) => {
      if(item._id == recipientID){
        for(let key in item){
          editRecipient(key, item[key])
        }
      }
    })
  }, [recipientID])

  useEffect(() => {
    if(modal == 'tags'){
      manageTags('preload',  recipient.tags)
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

            updateTags(newValues)
          })
        })
      }
    }
  }, [modal])

  const handleSelect = async (e, type, id) => {
    let geo
    
    if(id){
     geo = await geocodeByPlaceId(id)
    }

    if(geo){
      geo[0].address_components.forEach((item) => {
        if(item.types.includes('postal_code')){
          editRecipient('zip_code', item.long_name)
        } 
      })
    }
    
    editRecipient(type, e.split(',')[0])

    if(type == 'address_one'){
      editRecipient('city', e.split(',')[1])
      editRecipient('state', e.split(',')[2])
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [])

  const handleClick = e => {
    if(node.current){
      // INSIDE CLICK
      if(node.current.contains(e.target)) return
    }

    // CLICK OUTSIDE
    setStateList(false)
  };

  const handleZipCode = (e) => {
    e.preventDefault()
    if(!/^\d{5}(-\d{4})?$/.test(recipient.zip_code)) return setMessage('Zip code is invalid');
  }

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
  }

  const updateRecipient = async (type) => {
    setLoading(type)
    try {
      const responseRecipient = await axios.post(`${API}/recipient/update-recipient`, {user: newUser, recipient: recipient})
      setAllRecipients(responseRecipient.data)
      setLoading('')
      setEdit('')
      setModal('')
      setCardMenu('empty')
    } catch (error) {
      setLoading('')
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Could not update recipient')
    }
  }
  
  const onDragStart = (e, id, type) => {
    if(edit !== 'style') return
    e.dataTransfer.setData("id", id)
    e.dataTransfer.setData("type", type)
  }

  const onDragOver = (e) => {
    // console.log(e)
    e.preventDefault()
  }

  const onDrop = (e, id) => {
    if(edit !== 'style') return
    
    if(recipient.rank[id - 1]){
      let switchText = recipient.rank[id - 1].style
      recipient.rank[id - 1].style  = e.dataTransfer.getData('type')
      recipient.rank[e.dataTransfer.getData('id') - 1].style = switchText

      editRecipient(recipient.rank)
    }else{
      return
    }
  }

  const formatDate = (e) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var month = monthNames[e.getUTCMonth()]
    var day = e.getUTCDate()
    var year = e.getUTCFullYear()
    return `${month} ${day}, ${year}`
  }

  const handleDate = (date, type) => {
    setCardMenu('empty')
    setCalendar(date)
    editRecipient('card_arrival', formatDate(date))
    type !== 'other' ? editRecipient('event_other', '') : null
    editRecipient('event', type.trim())
  }

  const delayCheckOther = () => {
    let userTyping = setTimeout(() => {
      setCheckmarkOther(true)
    }, 500)

    return () => clearTimeout(userTyping);
  }

  const showTooltip = (e, type) => {
    const els = document.querySelectorAll('.quiz-recipient-package-description-text-bubble-tooltip')
    els[type].classList.add('display')
  }

  const hideTooltip = (e, type) => {
    const els = document.querySelectorAll('.quiz-recipient-package-description-text-bubble-tooltip')
    els[type].classList.remove('display')
  }

  const resetMessage= () => {
    let el = document.getElementById('nickname')
    if(el) el.checked = false

    let el2 = document.getElementsByName('message_blank')[0]
    if(el2) el2.checked = false

    let el3 = document.getElementsByName('message_textarea_blank')[0]
    if(el3) el3.checked = false

    editRecipient('nickname', '')
    editRecipient('message', '')
    editRecipient('signature', '')
  }

  const handleKeyPress = async (e, clicked) => {
    if(e.key === 'Enter' || clicked == 'true'){
      try {
        const responseTag = await axios.post(`${API}/recipient/check-word`, {tags})
        setInvalidTag(false)
        let input = document.getElementById('researchInterests')
        input.value = responseTag.data
      } catch (error) {
        console.log(error.response)
        if(error) return  error.response ? (setMessage(error.response.data), setInvalidTag(true)) : (setMessage(`Tags cannot be more than two words`), setInvalidTag(true))
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

          updateTags(newValues)
        })
      })

      updateTags(values)
      setTags('')
    }
  }
  
  return (
    <>
      <Nav></Nav>
      <div className="profile-dashboard">
        <div className="profile-dashboard-sidenav-container">
          <div className="profile-dashboard-sidenav-item-container">
            <div className="profile-dashboard-sidenav-item">
              <SVG svg={'envelope'} classprop={'profile-dashboard-sidenav-item-icon'}></SVG>
              <SVG svg={'arrow-right'} classprop={'profile-dashboard-sidenav-item-arrow'}></SVG>
            </div>
          </div>
          <div className="profile-dashboard-sidenav-item-container">
            <div className="profile-dashboard-sidenav-item">
              <SVG svg={'user'} classprop={'profile-dashboard-sidenav-item-icon'}></SVG>
              <SVG svg={'arrow-right'} classprop={'profile-dashboard-sidenav-item-arrow'}></SVG>
            </div>
          </div>
          <div className="profile-dashboard-sidenav-item-container">
            <div className="profile-dashboard-sidenav-item" onClick={() => setSideNav('recipients')}>
              <SVG svg={'users'} classprop={'profile-dashboard-sidenav-item-icon'}></SVG>
              <SVG svg={'arrow-right'} classprop={'profile-dashboard-sidenav-item-arrow'}></SVG>
            </div>
          </div>
          <div className="profile-dashboard-sidenav-item-container">
            <div className="profile-dashboard-sidenav-item">
              <SVG svg={'calendar'} classprop={'profile-dashboard-sidenav-item-icon'}></SVG>
              <SVG svg={'arrow-right'} classprop={'profile-dashboard-sidenav-item-arrow'}></SVG>
            </div>
          </div>
        </div>
        { sideNav == 'recipients' &&
        <div className="profile-dashboard-recipients">
          <div className="profile-dashboard-recipients-item-add"><SVG svg={'plus'}></SVG><span>Add Recipient</span></div>
          {recipients.map((item, idx) => 
            <div key={idx} className="profile-dashboard-recipients-item" onClick={() => (setEdit(''), setRecipient(item._id), setCardMenu('empty'))}>{item.name}</div>
          )}
        </div>
        }
        {
          recipientID && allRecipients.filter((item) => item._id == recipientID).map((item, idx) =>
            <div key={idx} className="profile-dashboard-recipients-edit">
              <div className="profile-dashboard-recipients-edit-title">
                <div className="profile-dashboard-recipients-edit-title-recipient">{item.recipient ? item.recipient : item.recipient_other}</div>
                <div className="profile-dashboard-recipients-edit-title-name">{item.name}</div>
              </div>
              {edit == 'profile' ?
                <div className="profile-dashboard-recipients-edit-profile">
                  <div className="profile-dashboard-recipients-edit-profile-container">
                    <div className="profile-dashboard-recipients-edit-profile-personality-edit">
                      <div className="profile-dashboard-recipients-edit-profile-personality-title">Personality:</div>
                      <div className="form-group-single-dropdown-menu profile-dashboard-recipients-edit-profile-personality-input">
                        <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="description" placeholder="(Other)" onClick={() => (setInputDropdown('recipient_description'))} value={recipient.description.charAt(0).toUpperCase() + recipient.description.slice(1)} onChange={(e) => editRecipient('description', e.target.value)}></textarea>
                        { input_dropdown == 'recipient_description' &&
                          <div className="form-group-single-dropdown-menu-list" ref={myRefs}>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('description', e.target.innerText.charAt(0).toUpperCase() + e.target.innerText.slice(1).toLowerCase()), setInputDropdown(''))}>Life of the party</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('description', e.target.innerText.charAt(0).toUpperCase() + e.target.innerText.slice(1).toLowerCase()), setInputDropdown(''))}>Soft spoken</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('description', e.target.innerText.charAt(0).toUpperCase() + e.target.innerText.slice(1).toLowerCase()), setInputDropdown(''))}>Thoughtful</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('description', e.target.innerText.charAt(0).toUpperCase() + e.target.innerText.slice(1).toLowerCase()), setInputDropdown(''))}>Strong minded</div>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="profile-dashboard-recipients-edit-profile-address">
                      <div className="profile-dashboard-recipients-edit-profile-address-title">Address</div>
                      <div className="form-group-single-dropdown-menu profile-dashboard-recipients-edit-profile-personality-input">
                        <textarea rows="3" wrap="on" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="description" placeholder="(Edit Address)" value={recipient.address_one ? `${recipient.address_one}, ${item.city}, ${item.state}, ${item.zip_code}`: recipient.address_two} onClick={() => setModal('address')} readOnly></textarea>
                      </div>
                    </div>
                    <div className="profile-dashboard-recipients-edit-profile-age">
                      <div className="profile-dashboard-recipients-edit-profile-age-title">Age</div>
                      <div className="form-group-single-dropdown-menu" ref={myRefs}>
                        <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="age" placeholder="(Other)" onClick={() => setInputDropdown('recipient_age')} value={recipient.age} readOnly></textarea>
                        { input_dropdown == 'recipient_age' &&
                          <div className="form-group-single-dropdown-menu-list">
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('age', e.target.innerText), setInputDropdown(''))}>18-24</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('age', e.target.innerText), setInputDropdown(''))}>25-34</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('age', e.target.innerText), setInputDropdown(''))}>35-44</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('age', e.target.innerText), setInputDropdown(''))}>45-54</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('age', e.target.innerText), setInputDropdown(''))}>55-64</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('age', e.target.innerText), setInputDropdown(''))}>65 or Above</div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="profile-dashboard-recipients-edit-profile-edit" onClick={() => (updateRecipient('profile'))}>{loading == 'profile' ? <div className="loading loading-primary loading-small"><span></span><span></span><span></span></div> : <span>Save</span>}</div>
                </div>

                :

                <div className="profile-dashboard-recipients-edit-profile">
                <div className="profile-dashboard-recipients-edit-profile-container">
                  <div className="profile-dashboard-recipients-edit-profile-personality">
                    <div className="profile-dashboard-recipients-edit-profile-personality-title">Personality:</div>
                    <span>{item.description.charAt(0).toUpperCase() + item.description.slice(1)}</span>
                  </div>
                  <div className="profile-dashboard-recipients-edit-profile-address">
                    <div className="profile-dashboard-recipients-edit-profile-address-title">Address</div>
                    <span>{item.address_one ? item.address_one : item.address_two}</span>
                    <span>{item.city}, {item.state} {item.zip_code}</span>
                  </div>
                  <div className="profile-dashboard-recipients-edit-profile-age">
                    <div className="profile-dashboard-recipients-edit-profile-age-title">Age</div>
                    <span>{item.age}</span>
                  </div>
                </div>
                <div className="profile-dashboard-recipients-edit-profile-edit" onClick={() => setEdit('profile')}>Edit</div>
                </div>
              }
              <div className="profile-dashboard-recipients-edit-style">
                <div className="profile-dashboard-recipients-edit-style-title"><span>Card style</span> (rate it from more important to least important):</div>
                <div className="profile-dashboard-recipients-edit-style-selection">
                  {item.rank.length > 0 && item.rank.map((item, idx) =>
                    <div className={`profile-dashboard-recipients-edit-style-selection-item-${item.rank} profile-dashboard-recipients-edit-style-selection-item-box`} key={idx} onDrop={(e) => onDrop(e, item.rank)} onDragOver={(e) => onDragOver(e)}>
                    <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${item.rank}`}
                    draggable onDragStart={(e) => {onDragStart(e, item.rank,item.style)}}
                    >
                      {item.style}
                    </div>
                    </div>
                  )}
                </div>
                {edit == 'style' ? 
                   <div className="profile-dashboard-recipients-edit-profile-edit" onClick={() => (updateRecipient('style'))}>{loading == 'style' ? <div className="loading loading-primary loading-small"><span></span><span></span><span></span></div> : <span>Save</span>}</div>
                  :
                  <div className="profile-dashboard-recipients-edit-profile-edit" onClick={() => setEdit('style')}>Edit</div>
                }
                
              </div>
              <div className="profile-dashboard-recipients-edit-event">
                <div className="profile-dashboard-recipients-edit-event-title">Your cards:</div>
                <div className="profile-dashboard-recipients-edit-event-container">
                    {item.event && 
                      eventsList.map((e, idx) => 
                        e.subtitle.toLowerCase() == item.event ?
                          <div key={idx} className="profile-dashboard-recipients-edit-event-container-card">
                            {cardMenu == idx && <div className="profile-dashboard-recipients-edit-event-container-card-menu">
                              <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setModal('event')}>Edit Event</div>
                              <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setModal('message')}>Edit Message</div>
                              <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => (setModal('tags'))}>Edit Card Themes</div>
                            </div>
                            }
                            <div className="profile-dashboard-recipients-edit-event-container-card-dots" onClick={() => cardMenu !== 'empty' ? setCardMenu('empty') :  setCardMenu(idx)}><span></span><span></span><span></span></div>
                            <img className="profile-dashboard-recipients-edit-event-container-card-image" src={`/media/emojis/` + (e.imageName ? e.imageName : 'other.png')} alt="" />
                            <div className="profile-dashboard-recipients-edit-event-container-card-title">{item.event.toLowerCase() == 'other' ? item.event_other : e.subtitle}</div>
                            <div className="profile-dashboard-recipients-edit-event-container-card-subtitle-date">Est. Arrival Date: </div>
                            <div className="profile-dashboard-recipients-edit-event-container-card-date">{item.card_arrival}</div> 
                            <div className="profile-dashboard-recipients-edit-event-container-card-subtitle-date">Card themes: </div> 
                            <div className="profile-dashboard-recipients-edit-event-container-card-tags">
                              {
                                item.tags.length > 0 && item.tags.slice(0, 3).map((tag, idx) => 
                                  <div key={idx} className="profile-dashboard-recipients-edit-event-container-card-tags-tag">{ item.tags.length > 1 ? idx == 2 ? `${tag.substring(0, 10)} ` : item.tags.length - 1 == idx ? `${tag.substring(0, 10)} ` : `${tag.substring(0, 10)}, ` : `${tag.substring(0, 10)} `}</div>
                                )
                              }
                              <div onClick={() => (setModal('tags'))}className="profile-dashboard-recipients-edit-event-container-card-tags-dots"><span></span><span></span><span></span></div>
                            </div>
                          </div>
                        :
                        null
                      )
                    }
                    <div className="profile-dashboard-recipients-edit-event-container-card-add">
                      <SVG svg={'plus'}></SVG>
                      <span>Add your next card here</span>
                    </div>
                    <div className="profile-dashboard-recipients-edit-event-container-card-plus_button">
                      <span><SVG svg={'plus'}></SVG></span>
                    </div>
                </div>
              </div>
            </div>
          )
        }
        {modal == 'address' && 
        <div className="recipient-modal">
          <div className="recipient-modal-box">
            <div className="recipient-modal-box-close" onClick={() => setModal('')}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
            <div className="quiz-recipient-mail-address">
              {/* <div className="form-group-single checkbox">
                <input type="checkbox"/>
                <span>I don’t know their address, email them for me to ask for their address</span>
              </div> */}
              <div className="quiz-recipient-mail-address-container">
                <form>
                    <PlacesAutocomplete value={recipient.address_one} onChange={(e) => editRecipient('address_one', e)} onSelect={(e) => handleSelect(e, 'address_one', document.getElementById('address_place_id').value)} searchOptions={searchOptionsAddress}>
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
                      </div>
                    )}
                    </PlacesAutocomplete>
                    <PlacesAutocomplete value={recipient.address_two} onChange={(e) => editRecipient('address_two', e)} onSelect={(e) => handleSelect(e, 'address_two', document.getElementById('address_place_id').value)} searchOptions={searchOptionsAddress}>
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
                    <PlacesAutocomplete value={recipient.city} onChange={(e) => editRecipient('city', e)} onSelect={(e) => {handleSelect(e, 'city', null)}} searchOptions={searchOptionsCities}>
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div className="form-group-double mail form-autocomplete-container_3">
                        <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'City'})} required/>
                        <div className="form-group-double-dropdown">
                          <input type="text" placeholder="State" value={recipient.state} onChange={ (e) => editRecipient('state', e)} onFocus={(e) => (e.target.placeholder = '', setStateList(true))} readOnly required/>
                          {state_list && 
                          <div className="form-group-double-dropdown-list" ref={node}>
                              <div className="form-group-double-dropdown-list-container">
                                {usStates.map( (item, idx) => (
                                  <div className="form-group-double-dropdown-list-item" onClick={(e) => (editRecipient('state', item.abbreviation), setStateList(false))} key={idx} >{item.name}</div>
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
                      </div>
                    )}
                  </PlacesAutocomplete>
                  <div className="form-group-single mail">
                    <input id='zip_code' type="text" placeholder="Zip Code" value={recipient.zip_code} onChange={ (e) => (validateIsNumber('zip_code'), editRecipient('zip_code', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Zip Code'} required/>
                  </div>
                  <button onClick={(e) => (handleZipCode(e), setModal(''))}className="form-button mail-button">Save</button>
                  {message && <div className="form-message-error">{message}</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
        }
        {modal == 'event' &&
          <div className="recipient-modal">
          <div className="recipient-modal-box">
            <div className="recipient-modal-box-close" onClick={() => (setModal(''), setCardMenu('empty'))}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
              <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'age')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
            </div>
            <div className="recipient-modal-box-event">
            <div className="quiz-title recipient-modal-box-event-title">What are the events you'd like to send cards for your {recipient.firstName ? recipient.firstName : 'recipient'}?</div>
            <div className="quiz-title-mobile">What are the events you'd like to send cards for your {recipient.firstName ? recipient.firstName : 'recipient'}?</div>
            <div className="quiz-subtitle">Pick the event and tell us the arrival date.</div>
            <div className="quiz-subtitle-mobile">Select the estimated arrival date for the event.</div>
            <div className="quiz-recipient-event">
              {eventsList.slice(0, toggleEvents ? 20 : 8).map( (item, idx) => 
              <div key={idx} className={`quiz-recipient-event-item`} onClick={(e) => 
              (item.subtitle == 'more' 
              ? (setToggleEvents(!toggleEvents)) 
              : 
              (item.subtitle.toLowerCase() == 'other' ? (editRecipient('event', 'other'), setOtherEvent(true)) : (editRecipient('event', item.subtitle.toLowerCase()), setEnableCalendar(`event-${item.subtitle.toLowerCase()}`)))
              )}>
                {item.imageName ? <img src={`/media/emojis/${item.imageName}`}></img> : null}
                <span className={`quiz-recipient-event-item-text ` + (item.subtitle.toLowerCase() == recipient.event ? ' mb-4 ' : item.subtitle.toLowerCase() == 'other' && other ? ' mb-4 ' : '') + (item.subtitle == 'more' ? 'expand' : null) + (recipient.card_arrival ? recipient.card_arrival && item.subtitle.toLowerCase().trim() == recipient ? ' mb-4' : null : null)}>{item.subtitle == 'more' ? toggleEvents ? 'less' : 'more' : item.subtitle == 'Other' ? recipient.event_other ? recipient.event_other : 'Other' : item.subtitle}

                {recipient.card_arrival ? recipient.card_arrival && item.subtitle.toLowerCase().trim() == recipient.event
                ?
                <div className="quiz-recipient-event-item-arrival">
                  <span className="quiz-recipient-event-item-arrival-title">Arrival Date</span>
                  <span className="quiz-recipient-event-item-arrival-date">{recipient.card_arrival}</span>
                </div>
                : 
                null
                :
                null
                } 

                {other && item.subtitle.toLowerCase() == 'other' ? 
                <span className="quiz-recipient-event-item-other">
                  <div className="quiz-recipient-event-item-other-input-container">

                    <input className="quiz-recipient-event-item-other-input" type="text" placeholder="Please specify" autoFocus value={recipient.event_other} onClick={() => setEnableCalendar('')} onChange={(e) => (editRecipient('event_other', e.target.value), delayCheckOther())}/>

                    <div className="quiz-recipient-event-item-other-input-svg" onClick={(e) => (e.stopPropagation(), setOtherEvent(false), setEnableCalendar('event-other'))}>
                      {checkmarkOther && <SVG svg={'checkmark'}></SVG>}
                    </div>
                  </div>
                </span> 
                : null
                }
                
                {recipient.event ? enableCalendar == `event-${recipient.event}` && item.subtitle.toLowerCase().trim() == recipient.event ?
                  <span className="quiz-recipient-event-item-calendar">
                      <Calendar
                        onClickDay={(date) => handleDate(date, recipient.event.trim())}
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
            <div className="quiz-button-container recipient-modal-box-event-button"><button className="quiz-button" onClick={(e) => (updateRecipient())} disabled={recipient.card_arrival ? false : true}>{loading == 'event' ? <div className="loading loading-event"><span></span><span></span><span></span></div> : <span>Done</span>}</button><div className="quiz-button-container"></div></div>
            </div>
          </div>
          </div>
        }
        {modal == 'message' &&
          <div className="recipient-modal">
          <div className="recipient-modal-box">
            <div className="recipient-modal-box-close" onClick={() => (setModal(''), setCardMenu('empty'))}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
            <div className="recipient-modal-box-message">
            <div className="quiz-title">What would you like the card to say?</div>
            <div className="quiz-title-mobile">What would you like the card to say?</div>
            <div className="quiz-subtitle">Fill in the blank!</div>
            <div className="quiz-subtitle-mobile">Fill in the blank!</div>
            <div className="quiz-recipient-message">
              <div className="quiz-recipient-message-heading">Card: {recipient.event}</div>
              <div className="quiz-recipient-message-container">
                <form>
                  <div className="form-group-single message">
                    <label htmlFor="name">Name/Nickname in front of the card:</label>
                    <input type="text" name="name" required value={recipient.nickname} onChange={(e) => (editRecipient('nickname', e.target.value), document.getElementsByName('nickname_blank')[0].checked = false)}/>
                    <div className="checkbox_2"><input id="nickname" type="checkbox" name="nickname_blank" onClick={(e) => editRecipient('nickname', '')}/><span>Leave it blank</span></div>
                  </div>
                  <div className="form-group-single message p-0">
                    <label htmlFor="message">Handwritten message inside:</label>
                    <textarea className="w-4" rows="5" value={recipient.message == 'blank' || recipient.message == 'message_options' ? '' : recipient.message} onChange={(e) => (editRecipient('message', e.target.value), document.getElementsByName('message_blank')[0].checked = false, document.getElementsByName('message_textarea_blank')[0].checked = false)}></textarea>
                    <div className="checkbox_2"><input type="checkbox" name="message_blank" onChange={(e) => (editRecipient('message', 'blank'), document.getElementsByName('message_textarea_blank')[0].checked = false)}/><span>Leave it blank</span></div>
                    <div className="checkbox_2 w-4 info-popup"><input type="checkbox" name="message_textarea_blank" onClick={(e) => (editRecipient('message', 'message_options'), document.getElementsByName('message_blank')[0].checked = false)}/>
                      <span>Give me message options for $2.00</span>
                      <div className="quiz-recipient-package-description-text-bubble" onMouseOver={(e) => showTooltip(e, 0)} onMouseLeave={(e) => hideTooltip(e, 0)}>
                        <SVG svg={'information'}></SVG>
                        <div className="quiz-recipient-package-description-text-bubble-tooltip">
                        We got you! We’ll send you different message options for just $2.00 per card once you sign up.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-single message p-0">
                    <label htmlFor="name">Signature:</label>
                    <input type="text" name="signature" required value={recipient.signature == 'blank' ? '' : recipient.signature} onChange={(e) => editRecipient('signature', e.target.value)}/>
                  </div>
                </form>
                <div className="checkbox_2 center show-on-mobile"><input type="checkbox"/><span>Not sure yet, ask me later</span></div>
              </div>
            </div>
            <div className="checkbox_2 center hide-on-mobile"><input id="message_unsure" type="checkbox" onClick={() => resetMessage()}/><span>Not sure yet, ask me later</span></div>
            <div className="quiz-button-container recipient-modal-box-event-button"><button className="quiz-button" onClick={(e) => (updateRecipient())}>{loading == 'message' ? <div className="loading loading-event"><span></span><span></span><span></span></div> : <span>Done</span>}</button><div className="quiz-button-container"></div></div>
          </div>
          </div>
          </div>
        }
        {modal == 'tags' &&
          <div className="recipient-modal">
          <div className="recipient-modal-box">
            <div className="recipient-modal-box-close" onClick={() => (setModal(''), setCardMenu('empty'))}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
            <div className="recipient-modal-box-message">
              <div className="quiz-title">Anything specific your {recipient.recipient ? recipient.recipient : 'recipient'} might like?</div>
              <div className="quiz-title-mobile">Anything specific your {recipient.recipient ? recipient.recipient : 'recipient'} might like?</div>
              <div className="quiz-subtitle">Animals, flowers, foods etc. Add as many tags as you'd like!</div>
              <div className="quiz-subtitle-mobile">Animals, flowers, foods etc. Add as many tags as you'd like!</div>
              <div className="quiz-recipient-tags">
                <div className={`quiz-recipient-tags-box ` + (invalid_tag ? ` form-message-error-outline` : null)}>
                  <input type="hidden" name="tags" id="tagValue" value="" required></input>
                  <input type="text" id="researchInterests" name="tags" value={tags} onChange={ (e) => (setTags(e.target.value), setMessage(''))} onKeyPress={(e) => handleKeyPress(e)}/>
                  <button onClick={(e) => handleKeyPress(e, 'true')}>Add</button>
                </div>
                {message ? <div className="form-message-error">{message}</div> : <div className="form-message-error">&nbsp;</div>}
                <div className="form-tag-container"></div>
                {/* <div className="quiz-recipient-tags-checkbox"><input type="checkbox" name="unsure" onClick={(e) => (setTimeout(() => {
                  quizProgressNav(e,'other')
                }, 500), dispatch({type: 'UPDATE_TAGS', payload: []})
                )}/><span>I'm not sure</span></div> */}
              </div>
              <div className="quiz-button-container recipient-modal-box-event-button"><button className="quiz-button" onClick={() => (updateRecipient())}>{loading == 'message' ? <div className="loading loading-event"><span></span><span></span><span></span></div> : <span>Done</span>}</button><div className="quiz-button-container"></div></div>
          </div>
          </div>
          </div>
        }
      </div>
      <Footer></Footer>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    recipient: state.recipient
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editRecipient: (name, data) => dispatch({type: 'EDIT_RECIPIENT', name: name, value: data}),
    updateTags: (data) => dispatch({type: 'UPDATE_TAGS', value: data})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(User))
