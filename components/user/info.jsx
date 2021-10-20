import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByPlaceId } from 'react-places-autocomplete'
import {usStates, eventsList} from '../../utils/quiz'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const Info = ({user, dashboard}) => {
  console.log(user)
  const node = useRef();
  const [edit, setEdit] = useState('')
  const [modal, setModal] = useState('')
  const [state_list, setStateList] = useState(false)
  const [message, setMessage] = useState('')
  const [address, setAddress] = useState('')
  const [address_two, setAddressTwo] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [phone, setPhone] = useState('')
  const [plan, setPlan] = useState('')
  const [history, setHistory] = useState(false)

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
  }

  const handleZipCode = (e) => {
    e.preventDefault()
    if(!/^\d{5}(-\d{4})?$/.test(zip)) return setMessage('Zip code is invalid');
  }

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
    user.transactions.map((item, i) => 
      user.transactions.length - 1 === i ? setPlan(item.package_plan) : setPlan('')
    )
  }, [user])

  const parseDateCreated = (data) => {
      let now = new Date(data)
      data = now.toISOString().slice(0,10)
      return data
  }
  
  return (
    <div className={`profile-dashboard-info ` + (dashboard == 'info' ? '' : 'hide-on-mobile')}>
      <div className="profile-dashboard-info-credits"><span>&nbsp;</span> You have {user.credits ? user.credits : 'no'} credits</div>
      <div className="profile-dashboard-info-title">My Info</div>
      {edit == 'info' ?
        <div className="profile-dashboard-info-box">
          <div className="profile-dashboard-info-box-edit" onClick={() => (setEdit(''), setModal(''))}>Save</div>
          <div className="profile-dashboard-info-box-container">
          <div className="profile-dashboard-info-box-address">
            <div className="profile-dashboard-info-box-address-title">Address</div>
            <textarea rows="3" wrap="on" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="address" placeholder="(Edit Address)" value={address ? `${address}, ${city}, ${state}, ${zip}`: address_two} onClick={() => setModal('address')} readOnly></textarea>
          </div>
          <div className="profile-dashboard-info-box-address">
            <div className="profile-dashboard-info-box-address-title">Payment Info</div>
            <div className="profile-dashboard-info-box-address-subtitle">Billing to: {
              user.transactions.map((item, i) => 
                user.transactions.length - 1 === i ? 
                  <span key={i}>VISA XXX-{user.last4 ? user.last4 : item.last4} </span>
                : 
                null
              )
            }</div>
          </div>
          <div className="profile-dashboard-info-box-address">
            <div className="profile-dashboard-info-box-address-title">Mobile Phone Number</div>
            <div className="form-group-single">
              <input id='phone' type="text" placeholder="Phone #" value={phone} onChange={ (e) => (validateIsNumber('phone'), setPhone(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Phone #'} required/>
            </div>
          </div>
          </div>
        </div>
        :

        <div className="profile-dashboard-info-box">
          <div className="profile-dashboard-info-box-edit" onClick={() => (setEdit('info'))}>Edit</div>
          <div className="profile-dashboard-info-box-container">
          <div className="profile-dashboard-info-box-address">
            <div className="profile-dashboard-info-box-address-title">Address</div>
            {
              user.transactions.map((item, i) => 
                user.transactions.length - 1 === i ? 
                  <div key={i} className="profile-dashboard-info-box-address-container">
                    <div>{user.billing_address ? user.billing_address : address ? address : item.billing_address}</div>
                    <span>{user.city ? user.city : city ? city : item.billing_city}, </span>
                    <span>{user.state ? user.state : state ? state : item.billing_state} </span>
                    <span>{user.zip_code ? user.zip_code : zip ? zip : item.billing_zip}</span>
                  </div>
                : 
                null
              )
            }
          </div>
          <div className="profile-dashboard-info-box-address">
            <div className="profile-dashboard-info-box-address-title">Payment Info</div>
            <div className="profile-dashboard-info-box-address-subtitle">Billing to: {
              user.transactions.map((item, i) => 
                user.transactions.length - 1 === i ? 
                  <span key={i}>VISA XXX-{user.last4 ? user.last4 : item.last4} </span>
                : 
                null
              )
            }</div>
          </div>
          <div className="profile-dashboard-info-box-address">
            <div className="profile-dashboard-info-box-address-title">Mobile Phone Number</div>
            {
              user.transactions.map((item, i) => 
                user.transactions.length - 1 === i ? 
                  <span key={i}>{user.phone ? user.phone : phone ? phone : item.phone} </span>
                : 
                null
              )
            }
          </div>
          </div>
        </div>
      }
      <div className="profile-dashboard-info-title">Plan</div>
      <div className="profile-dashboard-info-box">
        <div className="profile-dashboard-info-box-add">Add More Cards</div>
        <div className="profile-dashboard-info-box-plan">
          <div className="profile-dashboard-info-box-plan-title">
            {
              user.transactions.map((item, i) => 
                user.transactions.length - 1 === i ? 
                  <div key={i}>{item.package_plan ? item.package_plan !== 'custom' ? `Standard Annual - ${item.package_plan}` : `Custom`: null} </div>
                : 
                null
              )
            }
          </div>
          <div className="profile-dashboard-info-box-plan-credits">
            {plan == 'custom' ? `${user.credits} custom cards` : ''}
            {plan == 'best deal' ? `20 cards a year total` : ''}
            {plan == 'better deal' ? `10 cards a year total` : ''}
            {plan == 'good deal' ? `5 cards a year total` : ''}
          </div>
        </div>
        <div className="profile-dashboard-info-box-history">
          <span className="profile-dashboard-info-box-history-title" onClick={() => setHistory(!history)}>View Plan History</span>
          {history && 
          <div className="profile-dashboard-info-box-history-list">
            <div className="profile-dashboard-info-box-history-list-headers">
              <span>Date</span>
              <span>Order Number</span>
              <span>Plans</span>
              <span>Amount</span>
            </div>
            {
              user.transactions.map( (item, i) => 
                <div className="profile-dashboard-info-box-history-list-transactions">
                  <span>{parseDateCreated(item.createdAt)}</span>
                  <span>{item.order}</span>
                  <span>{item.package_plan}</span>
                  <span>${item.amount}</span>
                </div>
              )
            }
          </div>
          }
        </div>
      </div>

      
{/* ///////////////////////////// MODALS /////////////////////////////// */}
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
                    <PlacesAutocomplete value={address} onChange={(e) => setAddress(e)} onSelect={(e) => handleSelect(e, 'address_one', document.getElementById('address_place_id').value)} searchOptions={searchOptionsAddress}>
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
                    <PlacesAutocomplete value={address_two} onChange={(e) => setAddressTwo(e)} onSelect={(e) => handleSelect(e, 'address_two', document.getElementById('address_place_id').value)} searchOptions={searchOptionsAddress}>
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
                    <PlacesAutocomplete value={city} onChange={(e) => setCity(e)} onSelect={(e) => {handleSelect(e, 'city', null)}} searchOptions={searchOptionsCities}>
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div className="form-group-double mail form-autocomplete-container_3">
                        <input autoCorrect="off" spellCheck="false" autoComplete="off" {...getInputProps({placeholder: 'City'})} required/>
                        <div className="form-group-double-dropdown">
                          <input type="text" placeholder="State" value={state} onChange={ (e) => setState(e)} onFocus={(e) => (e.target.placeholder = '', setStateList(true))} readOnly required/>
                          {state_list && 
                          <div className="form-group-double-dropdown-list" ref={node}>
                              <div className="form-group-double-dropdown-list-container">
                                {usStates.map( (item, idx) => (
                                  <div className="form-group-double-dropdown-list-item" onClick={(e) => (setState(item.abbreviation), setStateList(false))} key={idx} >{item.name}</div>
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
                    <input id='zip_code' type="text" placeholder="Zip Code" value={zip} onChange={ (e) => (validateIsNumber('zip_code'), setZip(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Zip Code'} required/>
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
  )
}

export default Info
