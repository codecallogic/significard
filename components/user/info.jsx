import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByPlaceId } from 'react-places-autocomplete'
import {usStates, eventsList} from '../../utils/quiz'
import SliderProfile from '../../components/slider/sliderProfile'
import axios from 'axios'
import {API} from '../../config'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const Info = ({user, dashboard, credits}) => {
  // console.log(user)
  const node = useRef();
  const [edit, setEdit] = useState('')
  const [modal, setModal] = useState('')
  const [loading, setLoading] = useState(false)
  const [state_list, setStateList] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [address, setAddress] = useState('')
  const [address_two, setAddressTwo] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [phone, setPhone] = useState('')
  const [plan, setPlan] = useState('')
  const [history, setHistory] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [result, setResult] = useState('')
  const [planQuantity, setPlanQuantity] = useState('')
  const [updatePlan, setUpdatePlan] = useState('')
  const [planPrice, setPlanPrice] = useState('')
  const [subscription, setSubscription] = useState('')
  const [total, setTotal] = useState('')

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
    setAddress(user.transactions[user.transactions.length - 1].billing_address)
    setCity(user.transactions[user.transactions.length - 1].billing_city)
    setState(user.transactions[user.transactions.length - 1].billing_state)
    setZip(user.transactions[user.transactions.length - 1].billing_zip)
    setPhone(user.transactions[user.transactions.length - 1].phone)
    
    user.transactions.map((item, i) => 
      user.transactions.length - 1 === i ? setPlan(item.package_plan) : setPlan('')
    )
  }, [user])

  const parseDateCreated = (data) => {
      let now = new Date(data)
      data = now.toISOString().slice(0,10)
      return data
  }

  const calculate = () => {
    setMessage('')
    setPlanQuantity(quantity)
    setUpdatePlan('custom')
    if(+quantity <= 4) setResult(13.99)
    if(+quantity > 4 ) setResult(11.99)
    if(+quantity > 9) setResult(9.99)
    if(+quantity > 19) setResult(6.99)
    if(+quantity > 50){setMessage('For 50+ cards, please contact us.'), setResult('')}
  }

  const updateInfo = async () => {
    let billing_info = user.transactions[user.transactions.length - 1]
    try {
      const transactionResponse = await axios.post(`${API}/payment/update-transaction`, {address: address, address_two: address_two, city: city, state: state, zip: zip, phone: phone, billing_info: billing_info, user: user})
      window.location.href = `/account/${user.id}?view=info`
    } catch (error) {
      console.log(error)
      if(error) error.response ? setMessage(error.response.date) : setMessage('Error occurred updating info')
    }
  }

  const submitAddCredits = async () => {
    setLoading(true)
    try {
      const responseCredits = await axios.post(`${API}/payment/add-credits`, {payment: user.transactions[user.transactions.length - 1], order: {package_plan: updatePlan, subscription: subscription, quantity: planQuantity, price: planPrice}, user: user})
      window.location.href = `/account/${user.id}?view=info`
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error ocurred with purchase, please try again later')
    }
  }
  
  return (
    <div className={`profile-dashboard-info ` + (dashboard == 'info' ? '' : 'hide-on-mobile')}>
      <div className="profile-dashboard-info-title">My Info</div>
      <div className="profile-dashboard-info-credits"><span>&nbsp;</span> You have {credits ? credits : '0'} credits</div>
      {edit == 'info' ?
        <div className="profile-dashboard-info-box">
          <div className="profile-dashboard-info-box-edit" onClick={() => (updateInfo(), setEdit(''), setModal(''))}>Save</div>
          <div className="profile-dashboard-info-box-container">
          <div className="profile-dashboard-info-box-address-container">
            <div className="profile-dashboard-info-box-address">
              <div className="profile-dashboard-info-box-address-title">Address</div>
              <textarea rows="3" wrap="on" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="address" placeholder="(Edit Address)" value={address ? `${address}, ${city}, ${state}, ${zip}`: address_two} onClick={() => setModal('address')} readOnly></textarea>
            </div>
          </div>
          <div className="profile-dashboard-info-box-address-container">
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
          </div>
          <div className="profile-dashboard-info-box-address-container">
            <div className="profile-dashboard-info-box-address">
              <div className="profile-dashboard-info-box-address-title">Mobile Phone Number</div>
              <div className="form-group-single">
                <input id='phone' type="text" placeholder="Phone #" value={phone} onChange={ (e) => (validateIsNumber('phone'), setPhone(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Phone #'} required/>
              </div>
            </div>
          </div>
          </div>
        </div>
        :
        <div className="profile-dashboard-info-box">
          <div className="profile-dashboard-info-box-edit" onClick={() => (setEdit('info'))}>Edit</div>
          <div className="profile-dashboard-info-box-container">
          <div className="profile-dashboard-info-box-address-container">
            <div className="profile-dashboard-info-box-address">
              <div className="profile-dashboard-info-box-address-title">Address</div>
              {
                user.transactions.map((item, i) => 
                  user.transactions.length - 1 === i ? 
                    <div key={i} className="profile-dashboard-info-box-address-box">
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
          </div>
          <div className="profile-dashboard-info-box-address-container">
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
          </div>
          <div className="profile-dashboard-info-box-address-container">
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
        </div>
      }
      <div className="profile-dashboard-info-title profile-dashboard-info-mobile">Plan</div>
      <div className="profile-dashboard-info-box profile-dashboard-info-mobile-box">
        <div className="profile-dashboard-info-box-add profile-dashboard-info-mobile-cards" onClick={() => setModal('package_plan')}>Add More Cards</div>
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
        { modal == 'package_plan' &&
          <div className="recipient-modal-plan">
            <div className="recipient-modal-plan-box">
              <div className="recipient-modal-plan-box-close" onClick={() => setModal('')}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
              <div className="quiz-title">Choose a plan</div>
              <div className="recipient-modal-plan-box-mobile">
                <div className="recipient-modal-plan-box-mobile-title">
                  Change Plan
                </div>
                <div className="recipient-modal-plan-box-mobile-subtitle">
                  <span>{user.username},</span> find a plan that's right for you
                </div>
                <SliderProfile result={result} setresult={setResult} calculate={calculate} quantity={quantity} setQuantity={setQuantity}validateisnumber={validateIsNumber} message={message} setMessage={setMessage} setPlanQuantity={setPlanQuantity} setUpdatePlan={setUpdatePlan}></SliderProfile>
                <div className="recipient-modal-plan-box-mobile-bulk">
                  For bulk orders <a href="#">Click here</a>
                </div>
              </div>
              <div className="quiz-recipient-package">
                <div className="quiz-recipient-package-item">
                  <div className="quiz-recipient-package-item-title">Best Deal</div>
                  <div className="quiz-recipient-package-item-subtitle">You get 20 cards</div>
                  <div className="quiz-recipient-package-item-image-container">
                    <img src={`/media/package/standard.png`} alt="" />
                  </div>
                  <div className="quiz-recipient-package-item-price">$6.99 per card</div>
                  {/* <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div> */}
                  <button className="quiz-recipient-package-item-button" onClick={ (e) => (setPlanQuantity(20), setUpdatePlan('best deal'), setPlanPrice(6.99), setSubscription('price_1Jq0qpAFcPAVZmVLF41sZGrG'), setModal('checkout'))}>Select</button>
                  <div>Free Shipping</div>
                </div>
                <div className="quiz-recipient-package-item">
                  <div className="quiz-recipient-package-item-title">Better Deal</div>
                  <div className="quiz-recipient-package-item-subtitle">You get 10 cards</div>
                  <div className="quiz-recipient-package-item-image-container">
                    <img src={`/media/package/standard.png`} alt="" />
                  </div>
                  <div className="quiz-recipient-package-item-price">$9.99 per card</div>
                  {/* <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div> */}
                  <button className="quiz-recipient-package-item-button" onClick={ (e) => (setPlanQuantity(10), setUpdatePlan('better deal'), setPlanPrice(9.99), setSubscription('price_1Jq0orAFcPAVZmVLvZNwmwWP'), setModal('checkout'))}>Select</button>
                  <div>Free Shipping</div>
                </div>
                <div className="quiz-recipient-package-item">
                  <div className="quiz-recipient-package-item-title">Good Deal</div>
                  <div className="quiz-recipient-package-item-subtitle">You get 5 cards</div>
                  <div className="quiz-recipient-package-item-image-container">
                    {/* {packageList.slice(3, 6).map((item, idx) =>
                      <img key={idx} style={{transform: `rotate(${item.rotate}deg)`}} src={`/media/package/${item.image}`} alt="" />
                    )} */}
                    <img src={`/media/package/standard.png`} alt="" />
                  </div>
                  <div className="quiz-recipient-package-item-price">$11.99 per card</div>
                  {/* <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div> */}
                  <button className="quiz-recipient-package-item-button" onClick={ (e) => (setPlanQuantity(5), setUpdatePlan('good deal'), setPlanPrice(11.99), setSubscription('price_1Jq0oBAFcPAVZmVLtLUI1icZ'), setModal('checkout'))}>Select</button>
                  <div>Free Shipping</div>
                </div>
                <div className="quiz-recipient-package-item">
                  <div className="quiz-recipient-package-item-title">Customize It</div>
                  <div className="quiz-recipient-package-item-subtitle">Enter the number of cards you want</div>
                  <div className="quiz-recipient-package-item-input">
                    <input id="custom_quantity" type="text" value={quantity} placeholder="Number of Cards" onChange={(e) => (setResult(''), validateIsNumber('custom_quantity'), setQuantity(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Number of Cards'} onKeyDown={(e) => {
                      if (e.code === "Enter") {
                        calculate()
                      }
                    }}/>
                  </div>
                  {!result && <button className="quiz-recipient-package-item-button mb-2" onClick={ () => (calculate())}>Calculate</button>
                  }
                  {result && <button className="quiz-recipient-package-item-button mb-2" onClick={ (e) => (setPlanQuantity(quantity), setPlanPrice(result), setUpdatePlan('custom'), setModal('checkout'))}>Select & Continue</button>
                  }
                  {result && <>
                  <div className="quiz-recipient-package-item-price">${result} per card</div>
                  <div>Free Shipping</div>
                  </>}
                  {message && <div className="form-message-error">{message}</div>}
                </div>
              </div>             
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
            </div>
          </div>
        }
        { modal == 'checkout' &&
          <div className="recipient-modal-plan">
            <div className="recipient-modal-plan-box">
              <div className="recipient-modal-plan-box-close" onClick={() => setModal('')}><SVG svg={'close'} classprop={'recipient-modal-box-close-svg'}></SVG></div>
              <div className="quiz-title">Payment Method</div>
              <div className="recipient-modal-plan-box-mobile">
                <div className="recipient-modal-plan-box-mobile-title">
                  Payment Method
                </div>
              </div>
              <div className="recipient-modal-plan-box-checkout">
                <div className="recipient-modal-plan-box-checkout-title">{updatePlan ? updatePlan : 'none'}
                </div>
                <div className="recipient-modal-plan-box-checkout-payment">Payment Info Billing to: <span>VISA XXX-{user.transactions[user.transactions.length - 1] ? `${user.transactions[user.transactions.length - 1].last4}` : '0000'}</span>
                </div>
                <div className="recipient-modal-plan-box-checkout-credits">Credits {planQuantity ? planQuantity : '0'}
                </div>
                <div className="recipient-modal-plan-box-checkout-cards">
                  <span>
                    Cards ({planQuantity}x)
                  </span>
                  <span>
                    ${planPrice ? planPrice : '0'}
                  </span>
                </div>
                <div className="recipient-modal-plan-box-checkout-tax">
                  <span>Sales Tax</span>
                  <span>{(((+user.transactions[user.transactions.length - 1].tax).toFixed(4) * 100)).toFixed(2)} %</span>
                </div>
                <div className="recipient-modal-plan-box-checkout-total">
                  <span>Total</span>
                  <span>{`$ ` + ((+planQuantity * +planPrice) + ((+planQuantity * +planPrice) * +user.transactions[user.transactions.length - 1].tax)).toFixed(2)}</span>
                </div>
                <div className="recipient-modal-plan-box-checkout-button">
                  <button onClick={() => !loading ? submitAddCredits() : null}>{loading ? <div className="loading loading-primary loading-small"><span></span><span></span><span></span></div> : <span>Confirm</span>}</button>
                </div>
              </div>
              {error && <span className="form-message-error">{error}</span>}
            </div>
          </div>
        }
    </div>
  )
}

export default Info
