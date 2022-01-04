import withUser from '../withUser'
import NavMobile from '../../components/user/nav'
import NavDesktop from '../../components/nav'
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
import {manageTags, manageCardTags} from '../../helpers/forms'
import Orders from '../../components/user/orders'
import Info from '../../components/user/info'
import CalendarUI from '../../components/user/calendar'
import {useRouter} from 'next/router'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const User = ({params, newUser, recipients, recipient, editRecipient, updateTags, resetRecipient, resetState, resetRank, updateRank, removeRank, sortRank, card, editCard, updateCardTags}) => {
  const myRefs = useRef(null)
  const node = useRef();
  // console.log(newUser)
  // console.log(recipients)
  // console.log(recipient)
  const router = useRouter()
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
  const [addNew, setAddNew] = useState(false)
  const [cardUpdate, setCardUpdate] = useState(false)
  const [cardTagsItem, setCardTagsItem] = useState(null)
  const [dashboard, setDashboard] = useState('orders')
  const [credits, setCredits] = useState(newUser.credits)
  const [width, setWidth] = useState('')

  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
        setCardMenu('empty')
      }
    }
  }

  useEffect(() => {
    if(window.innerWidth < 1100) setDashboard('')
    if(window.innerWidth > 1100) setDashboard('orders')
    
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  useEffect(() => {
    setEnableCalendar(``)
    setOtherEvent('')
  }, [calendar])

  useEffect(() => {
    if(params) params.view ? setDashboard(params.view) : null
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [router.query.change])

  useEffect(() => {
    allRecipients.filter((item) => {
      if(item._id == recipientID){
        for(let key in item){
          editRecipient(key, item[key])
        }
      }
    })
  }, [recipientID])

  useEffect(() => {
    // console.log(recipient)
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

    if(modal == 'edit_card_tags'){
      manageCardTags('preload',  cardTagsItem.tags)
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

            updateCardTags(newValues)
          })
        })
      }
    }

    //TODO: UPDATE TAGS FOR CARD UPDATE SIMILAR TO ABOVE
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

  const updateRecipient = async (type, e) => {
    if(e) e.preventDefault()
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
    e.stopPropagation()
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

      editRecipient('rank', recipient.rank)
    }else{
      return
    }
  }

  const onDropNew = (e, id) => {
    // console.log(id)
    // console.log(e.dataTransfer.getData('id'))
    
    let el = document.getElementsByClassName(`profile-dashboard-recipients-edit-style-selection-item rank-content-${e.dataTransfer.getData('id')}`)
    let el2 = document.getElementsByClassName(`profile-dashboard-recipients-edit-style-selection-item rank-content-${id}`)
    let itemEl = el[0].innerText

    if(recipient.rank.some(item => item.rank == id)) removeRank(el2[0].innerText.toLowerCase());
    if(recipient.rank.some(item => item.rank == e.dataTransfer.getData('id'))) removeRank(el[0].innerText.toLowerCase());

    updateRank({style: el[0].innerText.toLowerCase(), rank: id})
    updateRank({style: el2[0].innerText.toLowerCase(), rank: parseInt(e.dataTransfer.getData('id'))})

    el[0].innerText = el2[0].innerText
    el2[0].innerText = itemEl


    sortRank()
    // console.log(el[0].innerText)
    // setRecipient(item._id)
    // updateRank({style: e.dataTransfer.getData('type'), rank: id})
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

  const handleDateCard = (date, type) => {
    setCardMenu('empty')
    setCalendar(date)
    editCard('card_arrival', formatDate(date))
    type !== 'other' ? editCard('event_other', '') : null
    editCard('event', type.trim())
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

  const handleKeyPressCards = async (e, clicked) => {
    if(e.key === 'Enter' || clicked == 'true'){
      try {
        const responseTag = await axios.post(`${API}/recipient/check-word`, {tags})
        setInvalidTag(false)
        let input = document.getElementById('researchInterests-card')
        input.value = responseTag.data
      } catch (error) {
        console.log(error.response)
        if(error) return  error.response ? (setMessage(error.response.data), setInvalidTag(true)) : (setMessage(`Tags cannot be more than two words`), setInvalidTag(true))
      }
      e.preventDefault();
      manageCardTags('addTag')
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

          updateCardTags(newValues)
        })
      })

      updateCardTags(values)
      setTags('')
    }
  }

  const createCard = async (loading) => {
    setLoading(loading)
    try {
      const responseCard = await axios.post(`${API}/card/create`, {id: recipientID, card: card, user: newUser, recipient: recipient, credits: credits})
      console.log(responseCard.data)
      setLoading('')
      setEdit('')
      setModal('')
      setCardMenu('empty')
      setCredits(responseCard.data.user.credits)
      setAllRecipients(responseCard.data.recipients)
      responseCard.data.recipients.filter((item) => {
        if(item._id == recipientID){
          for(let key in item){
            editRecipient(key, item[key])
          }
        }
      })
    } catch (error) {
      setLoading('')
      console.log(error.response)
      if(error) error.response ? setError(error.response.data) : setError('Could not create card')
    }
  }

  const setCardForUpdate = (id, type) => {
    recipient.cards.filter((item) => {
      if(item._id === id){
        for(let key in item){
          editCard(key, item[key])
        }
      }
    })
    setCardUpdate(true)
    setModal(type)
  }

  const submitCardUpdate = async (loading) => {
    setLoading(loading)
    try {
      const responseCard = await axios.post(`${API}/card/update-card`, {id: card._id, card: card, user: newUser})
      setLoading('')
      setEdit('')
      setModal('')
      setCardMenu('empty')
      setAllRecipients(responseCard.data)
      responseCard.data.filter((item) => {
        if(item._id == recipientID){
          for(let key in item){
            editRecipient(key, item[key])
          }
        }
      })
    } catch (error) {
      setLoading('')
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Could not update card')
    }
  }

  const createRecipient = async (type) => {
    setLoading(type)
    try {
      const recipientResponse = await axios.post(`${API}/recipient/create-recipient`, {recipient: recipient, user: newUser, credits: credits})
      setMessage('')
      setLoading('')
      setAddNew(false)
      setCredits(credits - 1)
      setAllRecipients(recipientResponse.data)
    } catch (error) {
      console.log(error)
      setLoading('')
      if(error) error.response ? setMessage(error.response.data) : setMessage('Error occurred creating recipient')
    }
  }

  const deleteRecipient = async (type) => {
    setLoading(type)
    try {
      const responseDelete = await axios.post(`${API}/recipient/delete`, {recipient: recipient, user: newUser})
      setLoading('')
      setMessage('')
      setCardMenu('empty')
      setAllRecipients(responseDelete.data)
    } catch (error) {
      console.log(error)
      setLoading('')
      if(error) error.response ? setMessage(error.response.data) : setMessage('Error occurred creating recipient')
    }
  }

  const uncheckOther = () => {
    let el = document.getElementById('other')
    if(el) el.checked = false
  }
  
  return (
    <>
      <NavMobile loggedIn={newUser} dashboard={dashboard} setDashboard={setDashboard} setRecipient={setRecipient} setAddNew={setAddNew}></NavMobile>
      <NavDesktop loggedIn={newUser} color={'#003E5F'}></NavDesktop>
      <div className="profile-dashboard">
        <div className={`profile-dashboard-sidenav-container ` + (dashboard !== '' ? 'hide-on-mobile' : '')}>
          <div className="profile-dashboard-sidenav-item-container">
            <div className="profile-dashboard-sidenav-item" onClick={() => (setDashboard('orders'), setAddNew(false))}>
              <div className="profile-dashboard-sidenav-item-icon-container">
                <SVG svg={'envelope'} classprop={'profile-dashboard-sidenav-item-icon'}></SVG>
              </div>
              <span>Orders</span>
              <div className="profile-dashboard-sidenav-item-arrow-container"><SVG svg={'arrow-right'} classprop={'profile-dashboard-sidenav-item-arrow'}></SVG></div>
            </div>
          </div>
          <div className="profile-dashboard-sidenav-item-container" onClick={() => (setAddNew(false), setDashboard('info'))}>
            <div className="profile-dashboard-sidenav-item">
              <div className="profile-dashboard-sidenav-item-icon-container">
                <SVG svg={'user'} classprop={'profile-dashboard-sidenav-item-icon'}></SVG>
              </div>
              <span>My Info</span>
              <div className="profile-dashboard-sidenav-item-arrow-container"><SVG svg={'arrow-right'} classprop={'profile-dashboard-sidenav-item-arrow'}></SVG></div>
            </div>
          </div>
          <div className="profile-dashboard-sidenav-item-container">
            <div className="profile-dashboard-sidenav-item" onClick={() => (setAddNew(false), setDashboard('profile'))}>
              <div className="profile-dashboard-sidenav-item-icon-container">
                <SVG svg={'users'} classprop={'profile-dashboard-sidenav-item-icon'}></SVG>
              </div>
              <span>Recipients</span>
              <div className="profile-dashboard-sidenav-item-arrow-container"><SVG svg={'arrow-right'} classprop={'profile-dashboard-sidenav-item-arrow'}></SVG></div>
            </div>
          </div>
          <div className="profile-dashboard-sidenav-item-container">
            <div className="profile-dashboard-sidenav-item" onClick={() => (setAddNew(false), setDashboard('calendar'))}>
              <div className="profile-dashboard-sidenav-item-icon-container">
                <SVG svg={'calendar'} classprop={'profile-dashboard-sidenav-item-icon'}></SVG>
              </div>
              <span>Calendar</span>
              <div className="profile-dashboard-sidenav-item-arrow-container"><SVG svg={'arrow-right'} classprop={'profile-dashboard-sidenav-item-arrow'}></SVG></div>
            </div>
          </div>
        </div>
        { dashboard == 'orders' &&
          <Orders user={newUser} credits={credits} recipients={allRecipients}></Orders>
        }
        {dashboard == 'info' && 
          <Info user={newUser} dashboard={dashboard} credits={credits}></Info>
        }
        { dashboard == 'profile' && sideNav == 'recipients' &&
        <div className="profile-dashboard-recipients">
          <div className="profile-dashboard-recipients-item-add" onClick={() => (resetRecipient(), setRecipient(''), setAddNew(true), document.querySelector('.profile-dashboard-recipients').classList.add('hide-on-mobile'))}><SVG svg={'plus'}></SVG><span>Add Recipient</span></div>
          {allRecipients.map((item, idx) => 
            <div 
            key={idx} 
            className="profile-dashboard-recipients-item" 
            onClick={() => (setEdit(''), setRecipient(item._id), setCardMenu('empty'), setAddNew(false), document.querySelector('.profile-dashboard-recipients').classList.add('hide-on-mobile'))}>{item.recipient_name}
            </div>
          )}
        </div>
        }
        {
          dashboard == 'profile' && !addNew && recipientID && allRecipients.filter((item) => item._id == recipientID).map((item, idx) =>
            <div key={idx} className="profile-dashboard-recipients-edit">
              <div className="profile-dashboard-recipients-edit-title">
                <div className="profile-dashboard-recipients-edit-title-credits"><span>&nbsp;</span> You have {credits ? credits : '0'} cards</div>
                <div className="profile-dashboard-recipients-edit-title-recipient">{item.recipient ? item.recipient : item.recipient_other}</div>
                <div className="profile-dashboard-recipients-edit-title-name">{item.recipient_name}</div>
                <div className="profile-dashboard-recipients-edit-title-edit">
                  <span onClick={() => cardMenu === 'recipient' ? setCardMenu('empty'): setCardMenu('recipient')}><SVG svg={'arrow-down'}></SVG></span>
                  {cardMenu == 'recipient' && 
                  <div className="profile-dashboard-recipients-edit-title-edit-menu" ref={myRefs}>
                    <div className="profile-dashboard-recipients-edit-title-edit-menu-item" onClick={() => setModal('title')}>Edit Recipient</div>
                    {/* <div className="profile-dashboard-recipients-edit-title-edit-menu-item" onClick={() => deleteRecipient('delete')}>
                      {loading == 'delete' ? <div className="loading loading-primary loading-small"><span></span><span></span><span></span></div> : <span>Delete</span>}
                    </div> */}
                  </div>
                  }
                </div>
              </div>
              {edit == 'profile' ?
                <div className="profile-dashboard-recipients-edit-profile">
                  <div className="profile-dashboard-recipients-edit-profile-container">
                    <div className="profile-dashboard-recipients-edit-profile-personality-edit">
                      <div className="profile-dashboard-recipients-edit-profile-personality-title">Personality:</div>
                      <div className="form-group-single-dropdown-menu profile-dashboard-recipients-edit-profile-personality-input">
                        <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="description" placeholder="(Other)" onClick={() => (setInputDropdown('recipient_description'))} value={recipient.description.charAt(0).toUpperCase() + recipient.description.slice(1)} onChange={(e) => editRecipient('description', e.target.value)}></textarea>
                        { input_dropdown == 'recipient_description' &&
                          <div className="form-group-single-dropdown-menu-list z1000" ref={myRefs}>
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
                          <div className="form-group-single-dropdown-menu-list" ref={myRefs}>
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
                  {edit == 'style'

                    ?
                    (<>
                      <div className={`profile-dashboard-recipients-edit-style-selection-item-${1} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 1) ? null : ' disable')} onDrop={(e) => onDropNew(e, 1)} onDragOver={(e) => onDragOver(e)}>
                      <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${1}`}
                      draggable onDragStart={(e) => {onDragStart(e, 1, 'humorous')}}
                      >
                        Humorous
                      </div>
                      </div>
                      <div className={`profile-dashboard-recipients-edit-style-selection-item-${2} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 2) ? null : ' disable')} onDrop={(e) => onDropNew(e, 2)} onDragOver={(e) => onDragOver(e)}>
                      <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${2}`}
                      draggable onDragStart={(e) => {onDragStart(e, 2, 'simple')}}
                      >
                        Simple
                      </div>
                      </div>
                      <div className={`profile-dashboard-recipients-edit-style-selection-item-${3} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 3) ? null : ' disable')} onDrop={(e) => onDropNew(e, 3)} onDragOver={(e) => onDragOver(e)}>
                      <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${3}`}
                      draggable onDragStart={(e) => {onDragStart(e, 3, 'cute')}}
                      >
                        Cute
                      </div>
                      </div>
                      <div className={`profile-dashboard-recipients-edit-style-selection-item-${4} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 4) ? null : ' disable')} onDrop={(e) => onDropNew(e, 4)} onDragOver={(e) => onDragOver(e)}>
                      <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${4}`}
                      draggable onDragStart={(e) => {onDragStart(e, 4, 'modern')}}
                      >
                        Modern
                      </div>
                      </div>
                      <div className={`profile-dashboard-recipients-edit-style-selection-item-${5} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 5) ? null : ' disable')} onDrop={(e) => onDropNew(e, 5)} onDragOver={(e) => onDragOver(e)}>
                      <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${5}`}
                      draggable onDragStart={(e) => {onDragStart(e, 5, 'colorful')}}
                      >
                        Colorful
                      </div>
                      </div>
                      <div className={`profile-dashboard-recipients-edit-style-selection-item-${6} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 6) ? null : ' disable')} onDrop={(e) => onDropNew(e, 6)} onDragOver={(e) => onDragOver(e)}>
                      <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${6}`}
                      draggable onDragStart={(e) => {onDragStart(e, 6, 'traditional')}}
                      >
                        Traditional
                      </div>
                      </div>
                    </>)
                    :
                    (item.rank.length > 0 && item.rank.map((item, idx) =>
                      <div className={`profile-dashboard-recipients-edit-style-selection-item-${item.rank} profile-dashboard-recipients-edit-style-selection-item-box`} key={idx} onDrop={(e) => onDropNew(e, item.rank)} onDragOver={(e) => onDragOver(e)}>
                      <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${item.rank}`}
                       onDragStart={(e) => {onDragStart(e, item.rank,item.style)}}
                      >
                        {item.style}
                      </div>
                      </div>
                    ))
                  }
                </div>
                {edit == 'style' ? 
                   <div className="profile-dashboard-recipients-edit-profile-edit">{loading == 'style' ? <div className="loading loading-primary loading-small"><span></span><span></span><span></span></div> : <>
                   <span onClick={() => (setRecipient(recipientID), setEdit(''))}>Cancel</span>
                   {recipient.rank.length == 6 ? <span onClick={() => updateRecipient('style') }>Save</span> : null}
                   </>}
                   </div>
                  :
                  <div className="profile-dashboard-recipients-edit-profile-edit" onClick={() => (setEdit('style'), resetRank())}>Edit</div>
                }
              </div>
              <div className="profile-dashboard-recipients-edit-event">
                <div className="profile-dashboard-recipients-edit-event-title">Your cards:</div>
                <div className="profile-dashboard-recipients-edit-event-container">
                    {item.event && 
                      eventsList.map((e, idx) => 
                        e.subtitle.toLowerCase() == item.event ?
                          <div key={idx} className="profile-dashboard-recipients-edit-event-container-card">
                            {cardMenu == 'recipient_card' && <div className="profile-dashboard-recipients-edit-event-container-card-menu">
                              <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setModal('event')}>Edit Event</div>
                              <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setModal('message')}>Edit Message</div>
                              <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => (setModal('tags'))}>Edit Card Themes</div>
                              <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => (setModal('comments'))}>Edit Comments</div>
                            </div>
                            }
                            <div className="profile-dashboard-recipients-edit-event-container-card-dots" onClick={() => cardMenu !== 'empty' ? setCardMenu('empty') :  setCardMenu('recipient_card')}><span></span><span></span><span></span></div>
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
                              <div onClick={() => (setModal('tags'))}className="profile-dashboard-recipients-edit-event-container-card-tags-dots">
                                <SVG svg={'plus'}></SVG>
                                {/* <span></span><span></span><span></span> */}
                              </div>
                            </div>
                          </div>
                        :
                        null
                      )
                    }
                    {recipient.cards && recipient.cards.map((cardItem) => 
                    (
                    eventsList.map((e, idx) => 
                      e.subtitle.toLowerCase() == cardItem.event ?
                        <div key={idx + 1} className="profile-dashboard-recipients-edit-event-container-card">
                          {cardMenu == idx && <div className="profile-dashboard-recipients-edit-event-container-card-menu">
                            <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setCardForUpdate(cardItem._id, 'edit_card_event')}>Edit Event</div>
                            <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setCardForUpdate(cardItem._id, 'edit_card_message')}>Edit Message</div>
                            <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setCardForUpdate(cardItem._id, 'edit_card_tags', setCardTagsItem(cardItem))}>Edit Card Themes</div>
                            <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setCardForUpdate(cardItem._id, 'edit_comments')}>Edit Comments</div>
                          </div>
                          }
                          <div className="profile-dashboard-recipients-edit-event-container-card-dots" onClick={() => cardMenu !== 'empty' ? setCardMenu('empty') :  setCardMenu(idx)}><span></span><span></span><span></span></div>
                          <img className="profile-dashboard-recipients-edit-event-container-card-image" src={`/media/emojis/` + (e.imageName ? e.imageName : 'other.png')} alt="" />
                          <div className="profile-dashboard-recipients-edit-event-container-card-title">{cardItem.event.toLowerCase() == 'other' ? cardItem.event_other : e.subtitle}</div>
                          <div className="profile-dashboard-recipients-edit-event-container-card-subtitle-date">Est. Arrival Date: </div>
                          <div className="profile-dashboard-recipients-edit-event-container-card-date">{cardItem.card_arrival}</div> 
                          <div className="profile-dashboard-recipients-edit-event-container-card-subtitle-date">Card themes: </div> 
                          <div className="profile-dashboard-recipients-edit-event-container-card-tags">
                            {
                              cardItem.tags.length > 0 && cardItem.tags.slice(0, 3).map((tag, idx) => 
                                <div key={idx} className="profile-dashboard-recipients-edit-event-container-card-tags-tag">{ cardItem.tags.length > 1 ? idx == 2 ? `${tag.substring(0, 10)} ` : cardItem.tags.length - 1 == idx ? `${tag.substring(0, 10)} ` : `${tag.substring(0, 10)}, ` : `${tag.substring(0, 10)} `}</div>
                              )
                            }
                            <div onClick={() => (setCardForUpdate(cardItem._id, 'edit_card_tags', setCardTagsItem(cardItem)))}className="profile-dashboard-recipients-edit-event-container-card-tags-dots">
                              <SVG svg={'plus'}></SVG>
                              {/* <span></span><span></span><span></span> */}
                            </div>
                          </div>
                        </div>
                      
                      :
                      null
                    )
                    )
                    )
                    }
                    <div className="profile-dashboard-recipients-edit-event-container-card-add" style={{cursor: credits == 0 ? 'not-allowed' : 'pointer'}} onClick={() => credits == 0 ? null : (setModal('edit_card_event'), resetState())}>
                      <SVG svg={'plus'}></SVG>
                      <span>{credits == 0 ? 'You do not have enough credits' : 'Add your next card here'}</span>
                    </div>
                    {/* <div className="profile-dashboard-recipients-edit-event-container-card-plus_button" style={{cursor: credits == 0 ? 'not-allowed' : 'pointer'}} onClick={() => credits == 0 ? null : (setModal('edit_card_event'), resetState())}>
                      <span><SVG svg={'plus'}></SVG></span>
                    </div> */}
                </div>
              </div>
            </div>
          )
        }
        {
          addNew && <div className="profile-dashboard-recipients-edit">
            <div className="profile-dashboard-recipients-edit-title">
              <div className="profile-dashboard-recipients-edit-title-credits"><span>&nbsp;</span> You have {credits ? credits : '0'} cards</div>
              <div className="profile-dashboard-recipients-edit-title-recipient">{recipient.recipient ? recipient.recipient : recipient.recipient_other ? item.recipient_other : 'Recipient'}</div>
              <div className="profile-dashboard-recipients-edit-title-name">{recipient.recipient_name ? recipient.recipient_name : 'Name'}</div>
              <div className="profile-dashboard-recipients-edit-title-edit">
                <span onClick={() => cardMenu === 'recipient' ? setCardMenu(''): setCardMenu('recipient')}><SVG svg={'arrow-down'}></SVG></span>
                {cardMenu == 'recipient' && 
                <div className="profile-dashboard-recipients-edit-title-edit-menu" ref={myRefs}>
                  <div className="profile-dashboard-recipients-edit-title-edit-menu-item" onClick={() => setModal('title')}>Edit Recipient</div>
                </div>
                }
              </div>
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
                      <textarea rows="3" wrap="on" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="description" placeholder="(Edit Address)" value={recipient.address_one ? `${recipient.address_one} ${recipient.city}, ${recipient.state} ${recipient.zip_code}`: recipient.address_two} onClick={() => setModal('address')} readOnly></textarea>
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
                <div className="profile-dashboard-recipients-edit-profile-edit" onClick={() => setEdit('')}>{loading == 'profile' ? <div className="loading loading-primary loading-small"><span></span><span></span><span></span></div> : <span>Save</span>}</div>
              </div>

              :

              <div className="profile-dashboard-recipients-edit-profile">
              <div className="profile-dashboard-recipients-edit-profile-container">
                <div className="profile-dashboard-recipients-edit-profile-personality">
                  <div className="profile-dashboard-recipients-edit-profile-personality-title">Personality:</div>
                  <span>{recipient.description.charAt(0).toUpperCase() + recipient.description.slice(1)}</span>
                </div>
                <div className="profile-dashboard-recipients-edit-profile-address">
                  <div className="profile-dashboard-recipients-edit-profile-address-title">Address</div>
                  <span>{recipient.address_one ? recipient.address_one : recipient.address_two}</span>
                  <span>{recipient.city} {recipient.state} {recipient.zip_code}</span>
                </div>
                <div className="profile-dashboard-recipients-edit-profile-age">
                  <div className="profile-dashboard-recipients-edit-profile-age-title">Age</div>
                  <span>{recipient.age}</span>
                </div>
              </div>
              <div className="profile-dashboard-recipients-edit-profile-edit" onClick={() => setEdit('profile')}>Edit</div>
              </div>
            }
            <div className="profile-dashboard-recipients-edit-style">
              <div className="profile-dashboard-recipients-edit-style-title"><span>Card style</span> (rate it from more important to least important, must have 6.):</div>
              <div className="profile-dashboard-recipients-edit-style-selection">
                {edit == 'style'

                  ?
                  (<>
                    <div className={`profile-dashboard-recipients-edit-style-selection-item-${1} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 1) ? null : ' disable')} onDrop={(e) => onDropNew(e, 1)} onDragOver={(e) => onDragOver(e)}>
                    <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${1}`}
                    draggable onDragStart={(e) => {onDragStart(e, 1, 'humorous')}}
                    >
                      Humorous
                    </div>
                    </div>
                    <div className={`profile-dashboard-recipients-edit-style-selection-item-${2} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 2) ? null : ' disable')} onDrop={(e) => onDropNew(e, 2)} onDragOver={(e) => onDragOver(e)}>
                    <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${2}`}
                    draggable onDragStart={(e) => {onDragStart(e, 2, 'simple')}}
                    >
                      Simple
                    </div>
                    </div>
                    <div className={`profile-dashboard-recipients-edit-style-selection-item-${3} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 3) ? null : ' disable')} onDrop={(e) => onDropNew(e, 3)} onDragOver={(e) => onDragOver(e)}>
                    <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${3}`}
                    draggable onDragStart={(e) => (onDragStart(e, 3, 'cute'))}>
                      Cute
                    </div>
                    </div>
                    <div className={`profile-dashboard-recipients-edit-style-selection-item-${4} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 4) ? null : ' disable')} onDrop={(e) => onDropNew(e, 4)} onDragOver={(e) => onDragOver(e)}>
                    <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${4}`}
                    draggable onDragStart={(e) => {onDragStart(e, 4, 'modern')}}
                    >
                      Modern
                    </div>
                    </div>
                    <div className={`profile-dashboard-recipients-edit-style-selection-item-${5} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 5) ? null : ' disable')} onDrop={(e) => onDropNew(e, 5)} onDragOver={(e) => onDragOver(e)}>
                    <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${5}`}
                    draggable onDragStart={(e) => {onDragStart(e, 5, 'colorful')}}
                    >
                      Colorful
                    </div>
                    </div>
                    <div className={`profile-dashboard-recipients-edit-style-selection-item-${6} profile-dashboard-recipients-edit-style-selection-item-box slideFromRight ` + (recipient.rank.some(e => e.rank == 6) ? null : ' disable')} onDrop={(e) => onDropNew(e, 6)} onDragOver={(e) => onDragOver(e)}>
                    <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${6}`}
                    draggable onDragStart={(e) => {onDragStart(e, 6, 'traditional')}}
                    >
                      Traditional
                    </div>
                    </div>
                  </>)
                  :
                  (recipient.rank.length > 0 && recipient.rank.sort((a, b) => a['rank'] > b['rank'] ? 1 : -1).map((item, idx) =>
                    <div className={`profile-dashboard-recipients-edit-style-selection-item-${item.rank} profile-dashboard-recipients-edit-style-selection-item-box`} key={idx} onDrop={(e) => onDropNew(e, item.rank)} onDragOver={(e) => onDragOver(e)}>
                    <div className={` profile-dashboard-recipients-edit-style-selection-item rank-content-${item.rank}`}
                    draggable onDragStart={(e) => {onDragStart(e, item.rank,item.style)}}
                    >
                      {item.style}
                    </div>
                    </div>
                  ))
                }
              </div>
              {edit == 'style' ? 
                  <div className="profile-dashboard-recipients-edit-profile-edit">{loading == 'style' 
                  ? 
                  <div className="loading loading-primary loading-small"><span></span><span></span><span></span></div> 
                  : 
                  <>
                  <span onClick={() => (setRecipient(recipientID), setEdit(''), editRecipient('rank', []))}>Cancel</span>
                  {recipient.rank && recipient.rank.length > 5 && <span onClick={() => setEdit('')}>Save</span>}</>}
                  </div>
                :
                <div className="profile-dashboard-recipients-edit-profile-edit" onClick={() => (setEdit('style'), resetRank())}>Edit</div>
              }
              
            </div>
            <div className="profile-dashboard-recipients-edit-event">
                <div className="profile-dashboard-recipients-edit-event-title">Your card:</div>
                <div className="profile-dashboard-recipients-edit-event-container">
                  {recipient.event && 
                    eventsList.map((e, idx) => 
                      e.subtitle.toLowerCase() == recipient.event ?
                        <div key={idx} className="profile-dashboard-recipients-edit-event-container-card">
                          {cardMenu == idx && <div className="profile-dashboard-recipients-edit-event-container-card-menu">
                            <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setModal('event')}>Edit Event</div>
                            <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => setModal('message')}>Edit Message</div>
                            <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => (setModal('tags'))}>Edit Card Themes</div>
                            <div className="profile-dashboard-recipients-edit-event-container-card-menu-item" onClick={() => (setModal('comments'))}>Edit Comments</div>
                          </div>
                          }
                          <div className="profile-dashboard-recipients-edit-event-container-card-dots" onClick={() => cardMenu !== 'empty' ? setCardMenu('empty') :  setCardMenu(idx)}><span></span><span></span><span></span></div>
                          <img className="profile-dashboard-recipients-edit-event-container-card-image" src={`/media/emojis/` + (e.imageName ? e.imageName : 'other.png')} alt="" />
                          <div className="profile-dashboard-recipients-edit-event-container-card-title">{recipient.event.toLowerCase() == 'other' ? recipient.event_other : e.subtitle}</div>
                          <div className="profile-dashboard-recipients-edit-event-container-card-subtitle-date">Est. Arrival Date: </div>
                          <div className="profile-dashboard-recipients-edit-event-container-card-date">{recipient.card_arrival}</div> 
                          <div className="profile-dashboard-recipients-edit-event-container-card-subtitle-date">Card themes: </div> 
                          <div className="profile-dashboard-recipients-edit-event-container-card-tags">
                            {
                              recipient.tags.length > 0 && recipient.tags.slice(0, 3).map((tag, idx) => 
                                <div key={idx} className="profile-dashboard-recipients-edit-event-container-card-tags-tag">{ recipient.tags.length > 1 ? idx == 2 ? `${tag.substring(0, 10)} ` : recipient.tags.length - 1 == idx ? `${tag.substring(0, 10)} ` : `${tag.substring(0, 10)}, ` : `${tag.substring(0, 10)} `}</div>
                              )
                            }
                            <div onClick={() => (setModal('tags'))}className="profile-dashboard-recipients-edit-event-container-card-tags-dots">
                              <SVG svg={'plus'}></SVG>
                              {/* <span></span><span></span><span></span> */}
                            </div>
                          </div>
                        </div>
                      :
                      null
                    )
                  }
                  {!recipient.card_arrival && <>
                    <div className="profile-dashboard-recipients-edit-event-container-card-add" onClick={() => setModal('event')}>
                      <SVG svg={'plus'}></SVG>
                      <span>Add your next card here</span>
                    </div>
                    {/* <div className="profile-dashboard-recipients-edit-event-container-card-plus_button" onClick={() => setModal('event')}>
                      <span><SVG svg={'plus'}></SVG></span>
                    </div> */}
                  </>
                  }
              </div>
            </div>
            <button className="form-button mail-button center-button" style={{cursor: credits == 0 ? 'not-allowed' : 'pointer'}} onClick={() => credits == 0 ? null : createRecipient('recipient')}>{loading == 'recipient' ? <div className="loading"><span></span><span></span><span></span></div> : <span>{credits == 0 ? 'Not enough credits' : 'Save Recipient'}</span>}</button>
            {message && <div className="form-message-error left">{message}</div>}
          </div>
        }
        { dashboard == 'calendar' &&
          <CalendarUI recipients={allRecipients}></CalendarUI>
        }

        {/* //////////////////// MODALS ////////////////////////////// */}
        {modal == 'title' && 
        <div className="recipient-modal-small">
          <div className="recipient-modal-box-small">
            <div className="recipient-modal-box-close-small" onClick={() => setModal('')}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
            <div className="quiz-recipient-title">
              <form>
                <div className="form-group-single mail">
                  <input id='recipient' type="text" placeholder="Recipient (ex. Mom)" value={recipient.recipient} onChange={ (e) => (editRecipient('recipient', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Recipient (ex. Mom)'} style={{textTransform: 'capitalize'}} required/>
                </div>
                <div className="form-group-single mail">
                  <input id='name' type="text" placeholder="Name" value={recipient.recipient_name} onChange={ (e) => (editRecipient('recipient_name', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Name'} required/>
                </div>
                <button onClick={(e) => (!addNew ? updateRecipient('title', e) : setModal(''))}className="form-button mail-button">{loading == 'title' ? <div className="loading"><span></span><span></span><span></span></div> : <span>Save</span>}</button>
                {message && <div className="form-message-error">{message}</div>}
              </form>
            </div>
          </div>
        </div>
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
            <div className="recipient-modal-box-event">
            <div className="quiz-title recipient-modal-box-event-title">Pick one event for {recipient.recipient ? recipient.recipient : recipient.recipient_other ? recipient.recipient_other : 'recipient'}?</div>
            <div className="quiz-title-mobile">Pick one event for{recipient.firstName ? recipient.firstName : 'recipient'}?</div>
            <div className="quiz-subtitle">Select arrival date.</div>
            <div className="quiz-subtitle-mobile">Select arrival date.</div>
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
            {/* <div className="quiz-subtitle">Fill in the blank!</div>
            <div className="quiz-subtitle-mobile">Fill in the blank!</div> */}
            <div className="quiz-recipient-message">
              <div className="quiz-recipient-message-heading">Card: {recipient.event}</div>
              <div className="quiz-recipient-message-container">
                <form>
                  {/* <div className="form-group-single message">
                    <label htmlFor="name">Name/Nickname in front of the card:</label>
                    <input type="text" name="name" required value={recipient.nickname} onChange={(e) => (editRecipient('nickname', e.target.value), document.getElementsByName('nickname_blank')[0].checked = false)}/>
                    <div className="checkbox_2"><input id="nickname" type="checkbox" name="nickname_blank" onClick={(e) => editRecipient('nickname', '')}/><span>Leave it blank</span></div>
                  </div> */}
                  <div className="form-group-single message p-0">
                    <label htmlFor="message">Message inside:</label>
                    <textarea className="w-4" rows="5" value={recipient.message == 'blank' || recipient.message == 'message_options' ? '' : recipient.message} onChange={(e) => (editRecipient('message', e.target.value), document.getElementsByName('message_blank')[0].checked = false)}></textarea>
                    {/* , document.getElementsByName('message_textarea_blank')[0].checked = false */}
                    <div className="checkbox_2"><input type="checkbox" name="message_blank" onChange={(e) => (editRecipient('message', 'blank'))}/><span>Leave it blank</span></div>
                    {/* , document.getElementsByName('message_textarea_blank')[0].checked = false */}
                    {/* <div className="checkbox_2 w-4 info-popup"><input type="checkbox" name="message_textarea_blank" onClick={(e) => (editRecipient('message', 'message_options'), document.getElementsByName('message_blank')[0].checked = false)}/>
                      <span>Give me message options for $2.00</span>
                      <div className="quiz-recipient-package-description-text-bubble" onMouseOver={(e) => showTooltip(e, 0)} onMouseLeave={(e) => hideTooltip(e, 0)}>
                        <SVG svg={'information'}></SVG>
                        <div className="quiz-recipient-package-description-text-bubble-tooltip">
                        We got you! We’ll send you different message options for just $2.00 per card once you sign up.
                        </div>
                      </div>
                    </div> */}
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
              <div className="quiz-title">Anything specific theme your {recipient.recipient ? recipient.recipient : 'recipient'} might like?</div>
              <div className="quiz-title-mobile">Anything specific them your {recipient.recipient ? recipient.recipient : 'recipient'} might like?</div>
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
        {modal == 'comments' &&
          <div className="recipient-modal">
          <div className="recipient-modal-box">
            <div className="recipient-modal-box-close" onClick={() => (setModal(''), setCardMenu('empty'))}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
            <div className="recipient-modal-box-comment">
              <div className="quiz-title">Is there anything else you want us to know or any designs we should avoid?</div>
              <div className="quiz-title-mobile">Is there anything else you want us to know or any designs we should avoid?</div>
              <div className="quiz-subtitle">Color, theme, animals, etc.</div>
              <div className="quiz-subtitle-mobile">Color, theme, animals, etc.</div>
              <div className="quiz-recipient-other">
                <textarea type="text" name="other" cols="100" value={recipient.other === 'blank' ? '' : recipient.other} onChange={ (e) => (uncheckOther(), editRecipient('other', e.target.value))}/>
                <div className="quiz-recipient-other-checkbox"><input id="other" type="checkbox" name="other" value="blank" onClick={(e) =>  editRecipient('other', '')}/><span>Nope</span></div>
              </div>
              <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => updateRecipient('comment', e)}>{loading == 'comment' ? <div className="loading loading-event"><span></span><span></span><span></span></div> : <span>Save</span>}</button><div className="quiz-button-container"></div></div>
              {/* {quizState.other && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'mail')}>
                <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
              </div>}     */}
              </div>
          </div>
          </div>
        }
        {modal == 'edit_card_event' &&
          <div className="recipient-modal">
          <div className="recipient-modal-box">
            <div className="recipient-modal-box-close" onClick={() => (setModal(''), setCardMenu('empty'))}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
            <div className="recipient-modal-box-event">
            <div className="quiz-title recipient-modal-box-event-title">Pick one event for {recipient.recipient ? recipient.recipient : recipient.recipient_other ? recipient.recipient_other : 'recipient'}?</div>
            <div className="quiz-title-mobile">Pick one event for {recipient.recipient ? recipient.recipient : recipient.recipient_other ? recipient.recipient_other : 'recipient'}?</div>
            <div className="quiz-subtitle">Select arrival date.</div>
            <div className="quiz-subtitle-mobile">Select arrival date</div>
            <div className="quiz-recipient-event">
              {eventsList.slice(0, toggleEvents ? 20 : 8).map( (item, idx) => 
              <div key={idx} className={`quiz-recipient-event-item`} onClick={(e) => 
              (item.subtitle == 'more' 
              ? (setToggleEvents(!toggleEvents)) 
              : 
              (item.subtitle.toLowerCase() == 'other' ? (editCard('event', 'other'), setOtherEvent(true)) : (editCard('event', item.subtitle.toLowerCase()), setEnableCalendar(`event-${item.subtitle.toLowerCase()}`)))
              )}>
                {item.imageName ? <img src={`/media/emojis/${item.imageName}`}></img> : null}
                <span className={`quiz-recipient-event-item-text ` + (item.subtitle.toLowerCase() == card.event ? ' mb-4 ' : item.subtitle.toLowerCase() == 'other' && other ? ' mb-4 ' : '') + (item.subtitle == 'more' ? 'expand' : null) + (card.card_arrival ? card.card_arrival && item.subtitle.toLowerCase().trim() == recipient ? ' mb-4' : null : null)}>{item.subtitle == 'more' ? toggleEvents ? 'less' : 'more' : item.subtitle == 'Other' ? card.event_other ? card.event_other : 'Other' : item.subtitle}

                {card.card_arrival ? card.card_arrival && item.subtitle.toLowerCase().trim() == card.event
                ?
                <div className="quiz-recipient-event-item-arrival">
                  <span className="quiz-recipient-event-item-arrival-title">Arrival Date</span>
                  <span className="quiz-recipient-event-item-arrival-date">{card.card_arrival}</span>
                </div>
                : 
                null
                :
                null
                } 

                {other && item.subtitle.toLowerCase() == 'other' ? 
                <span className="quiz-recipient-event-item-other">
                  <div className="quiz-recipient-event-item-other-input-container">

                    <input className="quiz-recipient-event-item-other-input" type="text" placeholder="Please specify" autoFocus value={card.event_other} onClick={() => setEnableCalendar('')} onChange={(e) => (editCard('event_other', e.target.value), delayCheckOther())}/>

                    <div className="quiz-recipient-event-item-other-input-svg" onClick={(e) => (e.stopPropagation(), setOtherEvent(false), setEnableCalendar('event-other'))}>
                      {checkmarkOther && <SVG svg={'checkmark'}></SVG>}
                    </div>
                  </div>
                </span> 
                : null
                }
                
                {card.event ? enableCalendar == `event-${card.event}` && item.subtitle.toLowerCase().trim() == card.event ?
                  <span className="quiz-recipient-event-item-calendar">
                      <Calendar
                        onClickDay={(date) => handleDateCard(date, card.event.trim())}
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
            <div className="quiz-button-container recipient-modal-box-event-button"><button className="quiz-button" onClick={(e) => (cardUpdate ? submitCardUpdate('event') : createCard('event'))} disabled={card.card_arrival ? false : true}>{loading == 'event' ? <div className="loading loading-event-2"><span></span><span></span><span></span></div> : <span>Done</span>}</button><div className="quiz-button-container"></div></div>
            </div>
          </div>
          </div>
        }
        {modal == 'edit_card_message' &&
          <div className="recipient-modal">
          <div className="recipient-modal-box">
            <div className="recipient-modal-box-close" onClick={() => (setModal(''), setCardMenu('empty'))}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
            <div className="recipient-modal-box-message">
            <div className="quiz-title">What would you like the card to say?</div>
            <div className="quiz-title-mobile">What would you like the card to say?</div>
            <div className="quiz-subtitle">Fill in the blank!</div>
            <div className="quiz-subtitle-mobile">Fill in the blank!</div>
            <div className="quiz-recipient-message">
              <div className="quiz-recipient-message-heading">Card: {card.event}</div>
              <div className="quiz-recipient-message-container">
                <form>
                  <div className="form-group-single message">
                    <label htmlFor="name">Name/Nickname in front of the card:</label>
                    <input type="text" name="name" required value={card.nickname} onChange={(e) => (editCard('nickname', e.target.value), document.getElementsByName('nickname_blank')[0].checked = false)}/>
                    <div className="checkbox_2"><input id="nickname" type="checkbox" name="nickname_blank" onClick={(e) => editCard('nickname', '')}/><span>Leave it blank</span></div>
                  </div>
                  <div className="form-group-single message p-0">
                    <label htmlFor="message">Handwritten message inside:</label>
                    <textarea className="w-4" rows="5" value={card.message == 'blank' || card.message == 'message_options' ? '' : card.message} onChange={(e) => (editCard('message', e.target.value), document.getElementsByName('message_blank')[0].checked = false, document.getElementsByName('message_textarea_blank')[0].checked = false)}></textarea>
                    <div className="checkbox_2"><input type="checkbox" name="message_blank" onChange={(e) => (editCard('message', 'blank'), document.getElementsByName('message_textarea_blank')[0].checked = false)}/><span>Leave it blank</span></div>
                    <div className="checkbox_2 w-4 info-popup"><input type="checkbox" name="message_textarea_blank" onClick={(e) => (editCard('message', 'message_options'), document.getElementsByName('message_blank')[0].checked = false)}/>
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
                    <input type="text" name="signature" required value={card.signature == 'blank' ? '' : card.signature} onChange={(e) => editCard('signature', e.target.value)}/>
                  </div>
                </form>
                {/* <div className="checkbox_2 center show-on-mobile"><input type="checkbox"/><span>Not sure yet, ask me later</span></div> */}
              </div>
            </div>
            {/* <div className="checkbox_2 center hide-on-mobile"><input id="message_unsure" type="checkbox" onClick={() => resetMessage()}/><span>Not sure yet, ask me later</span></div> */}
            <div className="quiz-button-container recipient-modal-box-event-button"><button className="quiz-button" onClick={(e) => (submitCardUpdate('message'))}>{loading == 'message' ? <div className="loading loading-event"><span></span><span></span><span></span></div> : <span>Done</span>}</button><div className="quiz-button-container"></div></div>
          </div>
          </div>
          </div>
        }
        {modal == 'edit_card_tags' &&
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
                  <input type="text" id="researchInterests-card" name="tags" value={tags} onChange={ (e) => (setTags(e.target.value), setMessage(''))} onKeyPress={(e) => handleKeyPressCards(e)}/>
                  <button onClick={(e) => handleKeyPressCards(e, 'true')}>Add</button>
                </div>
                {message ? <div className="form-message-error">{message}</div> : <div className="form-message-error">&nbsp;</div>}
                <div className="form-tag-container-card"></div>
                {/* <div className="quiz-recipient-tags-checkbox"><input type="checkbox" name="unsure" onClick={(e) => (setTimeout(() => {
                  quizProgressNav(e,'other')
                }, 500), dispatch({type: 'UPDATE_TAGS', payload: []})
                )}/><span>I'm not sure</span></div> */}
              </div>
              <div className="quiz-button-container recipient-modal-box-event-button"><button className="quiz-button" onClick={() => (submitCardUpdate('tags'))}>{loading == 'tags' ? <div className="loading loading-event"><span></span><span></span><span></span></div> : <span>Done</span>}</button><div className="quiz-button-container"></div></div>
          </div>
          </div>
          </div>
        }
        {modal == 'edit_comments' &&
          <div className="recipient-modal">
          <div className="recipient-modal-box">
            <div className="recipient-modal-box-close" onClick={() => (setModal(''), setCardMenu('empty'))}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
            <div className="recipient-modal-box-comment">
              <div className="quiz-title">Is there anything else you want us to know or any designs we should avoid?</div>
              <div className="quiz-title-mobile">Is there anything else you want us to know or any designs we should avoid?</div>
              <div className="quiz-subtitle">Color, theme, animals, etc.</div>
              <div className="quiz-subtitle-mobile">Color, theme, animals, etc.</div>
              <div className="quiz-recipient-other">
                <textarea type="text" name="other" cols="100" value={card.comment === 'blank' ? '' : card.comment ? card.comment : ''} onChange={ (e) => (uncheckOther(), editCard('comment', e.target.value))}/>
                <div className="quiz-recipient-other-checkbox"><input id="other" type="checkbox" name="other" value="blank" onClick={(e) =>  editCard('comment', '')}/><span>Nope</span></div>
              </div>
              <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => submitCardUpdate('comment')}>{loading == 'comment' ? <div className="loading loading-event"><span></span><span></span><span></span></div> : <span>Save</span>}</button><div className="quiz-button-container"></div></div>
              {/* {quizState.other && <div className="quiz-next" onClick={(e) => quizProgressNav(e,'mail')}>
                <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
              </div>}     */}
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
    recipient: state.recipient,
    card: state.card
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editRecipient: (name, data) => dispatch({type: 'EDIT_RECIPIENT', name: name, value: data}),
    updateTags: (data) => dispatch({type: 'UPDATE_TAGS', value: data}),
    updateRank: (data) => dispatch({type: 'UPDATE_RANK', payload: data}),
    removeRank: (data) => dispatch({type: 'REMOVE_RANK', payload: data}),
    resetState: () => dispatch({type: 'INITIAL_STATE'}),
    resetRank: () => dispatch({type: 'RESET_RANK'}),
    resetRecipient: () => dispatch({type: 'INITIAL_STATE_RECIPIENT'}),
    sortRank: () => dispatch({type: 'SORT_RANK'}),
    editCard: (name, data) => dispatch({type: 'EDIT_CARD', name: name, value: data}),
    updateCardTags: (data) => dispatch({type: 'UPDATE_CARD_TAGS', value: data})
  }
}

User.getInitialProps = ({query}) => {
  return {
    params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(User))
