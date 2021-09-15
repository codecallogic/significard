import withUser from '../withUser'
import Nav from '../../components/nav'
import Footer from '../../components/footer'
import SVG from '../../files/svgs'
import { useState, useEffect, useRef } from 'react'
import {eventsList} from '../../utils/quiz'
import {connect} from 'react-redux'
import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByPlaceId } from 'react-places-autocomplete'
import {usStates} from '../../utils/quiz'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const User = ({recipients, recipient, editRecipient}) => {
  const myRefs = useRef(null)
  const node = useRef();
  // console.log(recipients)
  // console.log(recipient)
  const [sideNav, setSideNav] = useState('recipients')
  const [recipientID, setRecipient] = useState('')
  const [edit, setEdit] = useState('')
  const [input_dropdown, setInputDropdown] = useState('')
  const [modal, setModal] = useState('')
  const [state_list, setStateList] = useState(false)
  const [message, setMessage] = useState('')

  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
      }
    }
  }

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
            <div key={idx} className="profile-dashboard-recipients-item" onClick={() => setRecipient(item._id)}>{item.name}</div>
          )}
        </div>
        }
        {
          recipientID && recipients.filter((item) => item._id == recipientID).map((item, idx) =>
            <div key={idx} className="profile-dashboard-recipients-edit">
              <div className="profile-dashboard-recipients-edit-title">
                <div className="profile-dashboard-recipients-edit-title-recipient">{item.recipient ? item.recipient : item.recipient_other}</div>
                <div className="profile-dashboard-recipients-edit-title-name">{item.name}</div>
              </div>
              {!edit && <div className="profile-dashboard-recipients-edit-profile">
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
              {edit == 'profile' && 
                <div className="profile-dashboard-recipients-edit-profile">
                  <div className="profile-dashboard-recipients-edit-profile-container">
                    <div className="profile-dashboard-recipients-edit-profile-personality-edit">
                      <div className="profile-dashboard-recipients-edit-profile-personality-title">Personality:</div>
                      <div className="form-group-single-dropdown-menu" ref={myRefs}>
                        <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="description" placeholder="(Other)" onClick={() => setInputDropdown('recipient_description')} value={recipient.description.charAt(0).toUpperCase() + recipient.description.slice(1)} onChange={(e) => editRecipient('description', e.target.value)}></textarea>
                        { input_dropdown == 'recipient_description' &&
                          <div className="form-group-single-dropdown-menu-list">
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('description', e.target.innerText), setInputDropdown(''))}>Life of the party</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('description', e.target.innerText), setInputDropdown(''))}>Soft spoken</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('description', e.target.innerText), setInputDropdown(''))}>Thoughtful</div>
                            <div className="form-group-single-dropdown-menu-list-item" onClick={(e) => (editRecipient('description', e.target.innerText), setInputDropdown(''))}>Strong minded</div>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="profile-dashboard-recipients-edit-profile-address">
                      <div className="profile-dashboard-recipients-edit-profile-address-title">Address</div>
                      <div className="form-group-single-dropdown-menu">
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
                  <div className="profile-dashboard-recipients-edit-profile-edit" onClick={() => setEdit('profile')}>Edit</div>
                </div>
              }
              <div className="profile-dashboard-recipients-edit-style">
                <div className="profile-dashboard-recipients-edit-style-title"><span>Card style</span> (rate it from more important to least important):</div>
                <div className="profile-dashboard-recipients-edit-style-selection">
                  {item.rank.length > 0 && item.rank.map((item, idx) =>
                    <div key={idx} className={`profile-dashboard-recipients-edit-style-selection-item-${item.rank}`}>{item.style}</div>
                  )}
                </div>
                <div className="profile-dashboard-recipients-edit-profile-edit">Edit</div>
              </div>
              <div className="profile-dashboard-recipients-edit-event">
                <div className="profile-dashboard-recipients-edit-event-title">Events:</div>
                <div className="profile-dashboard-recipients-edit-event-container">
                    {item.event && 
                      eventsList.map((e, idx) => 
                        e.subtitle.toLowerCase() == item.event ?
                          <div key={idx} className="profile-dashboard-recipients-edit-event-container-card">
                            <img className="profile-dashboard-recipients-edit-event-container-card-image" src={`/media/emojis/${e.imageName}`} alt="" />
                            <div className="profile-dashboard-recipients-edit-event-container-card-title">{item.event.toLowerCase() == 'other' ? item.event_other : e.subtitle}</div>
                            <div className="profile-dashboard-recipients-edit-event-container-card-subtitle">Themes</div> 
                            <div className="profile-dashboard-recipients-edit-event-container-card-tags">
                              {
                                item.tags.length > 0 && item.tags.slice(0, 2).map((tag, idx) => 
                                  <div key={idx} className="profile-dashboard-recipients-edit-event-container-card-tags-tag">{ idx !== 1 ? `${tag.substring(0, 10)}, ` : `${tag.substring(0, 10)} `}</div>
                                )
                              }
                            </div>
                            <SVG svg={'plus'} classprop={'profile-dashboard-recipients-edit-event-container-card-button'}></SVG>
                          </div>
                        :
                        null
                      )
                    }
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
              <div className="form-group-single checkbox">
                <input type="checkbox"/>
                <span>I don’t know their address, email them for me to ask for their address</span>
              </div>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(User))
