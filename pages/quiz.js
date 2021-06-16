import Nav from '../components/nav'
import Footer from '../components/footer'
import withUser from './withUser'
import {useState, useEffect} from 'react'
import {eventsList, stylesList, stylesListDrop, packageList} from '../utils/quiz'

const quiz = ({}) => {

  const [quiz, setquiz] = useState('recipient')
  const [recipient, setRecipient] = useState('')
  const [toggleEvents, setToggleEvents] = useState(false)
  const [events, setEvents] = useState(toggleEvents ? parseInt('8') : parseInt('20'))
  const [address, setAddress] = useState('')

  const quizProgress = (e, next) => {
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
      if(next) setquiz(next)
    }, 500);
  }

  const quizProgressNav = (e, next) => {
    setquiz(next)
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
    console.log(e)
    console.log('Hello')
    e.dataTransfer.setData("item", e.target.id);
  }

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const onDrop = (e) => {
    console.log(e)
    let id = e.dataTransfer.getData("item");
    let el = document.getElementById(id)
    
    e.target.appendChild(el)
  }

  const onDropBack = (e) => {
    console.log(e)
    let id = e.dataTransfer.getData("item");
    let el = document.getElementById(id)
    console.log(e.target.id)
    console.log(id)
    if(e.target.id !== id) e.target.appendChild(el)
  }
  
  return (

    // TODO: Will users only go through the quiz process after signup or can they go through the quiz at a later point after signup and already a user?
    
    <>
      <Nav></Nav>
      <div className="quiz">
        {quiz == 'recipient' && <>
          <div className="quiz-title">Who are we sending a card to?</div>
          <div className="quiz-title-mobile">Who are we sending a card to?</div>
          <div className="quiz-subtitle">For now just pick <span>one person</span>. Later, you can finish adding other loved ones in your profile.</div>
          <div className="quiz-subtitle-mobile">For now just pick <span>one person</span>. Later, you can finish adding other loved ones in your profile.</div>
          <div className="quiz-recipient">
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Friend</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Partner</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Mom</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Dad</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Sister</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Brother</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Grandma</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Grandpa</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Daughter</div>
            <div className="quiz-recipient-item" onClick={(e) => (quizProgress(e,'age'), setRecipient(e.target.textContent.toLowerCase()))}>Other</div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e, 'age')}>Next</button></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e, 'age')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
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
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'events')}>18-24</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'events')}>25-34</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'events')}>35-44</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e, 'events')}>45-54</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'events')}>55-64</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'events')}>65 or above</div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'events')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'events')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
        </>
        }
        {quiz == 'events' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'age')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">What are the events you'd like to send cards for your {recipient ? recipient : 'recipient'}?</div>
          <div className="quiz-title-mobile">Select an event for {recipient ? recipient : 'recipient'}.</div>
          <div className="quiz-subtitle">Pick one or more events. Select the estimated arrival date for each card. Make sure it's at least 3 weeks away!</div>
          <div className="quiz-subtitle-mobile">Select the estimated arrival date for the event.</div>
          <div className="quiz-recipient-event">
            {eventsList.slice(0, toggleEvents ? 20 : 8).map( (item, idx) => 
            <div key={idx} className={`quiz-recipient-event-item`} onClick={(e) => item.subtitle == 'more' ? setToggleEvents(!toggleEvents) : quizProgress(e,'ranking')}>
              {item.imageName ? <img src={`/media/emojis/${item.imageName}`}></img> : null}
              <span className={item.subtitle == 'more' ? 'expand' : null}>{item.subtitle == 'more' ? toggleEvents ? 'less' : 'more' : item.subtitle}</span>
            </div>
            )
            }
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'ranking')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'ranking')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
        </>
        }
        {quiz == 'ranking' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'events')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">How would you rank the styles that describe your {recipient ? recipient : 'recipient'}?</div>
          <div className="quiz-title-mobile">Rate the cards for {recipient ? recipient : 'recipient'}.</div>
          <div className="quiz-subtitle">How would you rank the styles that describe your {recipient ? recipient : 'recipient'}?</div>
          <div className="quiz-subtitle-mobile">What does {recipient ? recipient : 'recipient'} like? Drag and drog from 1 (most important) to 6 (least important).</div>
          <div className="quiz-recipient-style">
            {stylesList.map( (item, idx) => 
            <div key={idx} onDragOver={(e)=> onDragOver(e)} onDrop={(e) => onDropBack(e)} style={{transform: `rotate(${item.rotate}deg)`}} className="quiz-recipient-style-item">
              {item.imageName ? <img id={`event-${idx}`} draggable onDragStart={(e) => onDragStart(e)} src={`/media/styles/${item.imageName}`}></img> : null}
              <span >{item.subtitle}</span>
            </div>
            )
            }
          </div>
          <div className="quiz-recipient-style-drop">
            {stylesListDrop.map( (item, idx) => 
            <div onDrop={(e) => onDrop(e)} onDragOver={(e)=> onDragOver(e)} key={idx} className="quiz-recipient-style-drop-item" style={{border: `2px solid ${item.color}`}}><span style={{backgroundColor: `${item.color}`}}>{idx + 1}</span></div>
            )
            }
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'tags')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'tags')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
        </>
        }
        {quiz == 'tags' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'ranking')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Anything specific your {recipient ? recipient : 'recipient'} might like?</div>
          <div className="quiz-title-mobile">Anything specific your {recipient ? recipient : 'recipient'} might like?</div>
          <div className="quiz-subtitle">Animals, flowers, foods etc. Add as many words as you'd like!</div>
          <div className="quiz-subtitle-mobile">Animals, flowers, foods etc. Add as many words as you'd like!</div>
          <div className="quiz-recipient-tags">
            <div className="quiz-recipient-tags-box"><input type="text" name="tags"/><button>Add</button></div>
            <div className="quiz-recipient-tags-checkbox"><input type="checkbox" name="unsure"/><span>I'm not sure</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'avoid')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'avoid')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
        </>
        }
        {quiz == 'avoid' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'tags')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Anything you want us to avoid?</div>
          <div className="quiz-title-mobile">Anything you want us to avoid?</div>
          <div className="quiz-subtitle">Color, theme, animals etc.</div>
          <div className="quiz-subtitle-mobile">Color, theme, animals etc.</div>
          <div className="quiz-recipient-avoid">
            <textarea type="text" name="avoid" cols="100"/>
            <div className="quiz-recipient-avoid-checkbox"><input type="checkbox" name="avoid"/><span>Nope</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'other')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'other')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
        </>
        }
        {quiz == 'other' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'avoid')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Anything else you want us to know?</div>
          <div className="quiz-title-mobile">Anything else you want us to know?</div>
          <div className="quiz-subtitle">Add any other details here.</div>
          <div className="quiz-subtitle-mobile">Add any other details here.</div>
          <div className="quiz-recipient-other">
            <textarea type="text" name="other" cols="100"/>
            <div className="quiz-recipient-other-checkbox"><input type="checkbox" name="other"/><span>Nope</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'involvement')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'involvement')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
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
            <div className="quiz-recipient-involvement-item" onClick={(e) => quizProgress(e,'package')}>Not at all <span>I give full freedom to the artist to be adventurous with the design.</span></div>
            <div className="quiz-recipient-involvement-item" onClick={(e) => quizProgress(e,'package')}>Somewhat <span>I have some ideas, but not sure.</span></div>
            <div className="quiz-recipient-involvement-item" onClick={(e) => quizProgress(e,'package')}>Very <span>I have each detail of the design figured out.</span></div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'package')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'package')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
        </>
        }
        {quiz == 'package' && <>
          <div className="quiz-back" onClick={(e) => quizProgressNav(e, 'involvement')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="quiz-title">Choose a package</div>
          <div className="quiz-title-mobile">Choose a package</div>
          <div className="quiz-subtitle">Select one.</div>
          <div className="quiz-subtitle-mobile">Select one.</div>
          <div className="quiz-recipient-package">
            <div className="quiz-recipient-package-item">
              <div className="quiz-recipient-package-item-title">Standard</div>
              <div className="quiz-recipient-package-item-subtitle">Cards that you can recycle</div>
              <div className="quiz-recipient-package-item-image-container">
                {packageList.slice(0, 3).map((item, idx) =>
                  <img key={idx} style={{transform: `rotate(${item.rotate}deg)`}} src={`/media/package/${item.image}`} alt="" />
                )}
              </div>
              <div className="quiz-recipient-package-item-price">$8.99 /card</div>
              <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div>
              <button className="quiz-recipient-package-item-button">Select</button>
              <div>Free Shipping</div>
            </div>
            <div className="quiz-recipient-package-item">
              <div className="quiz-recipient-package-item-title">Plantable</div>
              <div className="quiz-recipient-package-item-subtitle">Cards that you can plant</div>
              <div className="quiz-recipient-package-item-image-container">
                {packageList.slice(3, 6).map((item, idx) =>
                  <img key={idx} style={{transform: `rotate(${item.rotate}deg)`}} src={`/media/package/${item.image}`} alt="" />
                )}
              </div>
              <div className="quiz-recipient-package-item-price">$10.99 /card</div>
              <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div>
              <button className="quiz-recipient-package-item-button">Select</button>
              <div>Free Shipping</div>
            </div>
          </div>
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
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'mail')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'mail')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
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
              To the recipient
            </div>
          </div>
          {address == 'me' &&
          <div className="quiz-recipient-mail-address">
            <div className="quiz-recipient-mail-address-container">
              <div className="quiz-recipient-mail-address-heading">Your address:</div>
              <form>
                <div className="form-group-single  mail">
                  <input type="text" placeholder="Full Name" required/>
                </div>
                <div className="form-group-single mail">
                  <input type="text" placeholder="Address Line 1" required/>
                </div>
                <div className="form-group-single mail">
                  <input type="text" placeholder="Address Line 2"/>
                </div>
                <div className="form-group-double mail">
                  <input type="text" placeholder="City" required/>
                  <input type="text" placeholder="State" required/>
                </div>
                <div className="form-group-single mail">
                  <input type="text" placeholder="Zip Code" required/>
                </div>
                <button className="form-button mail-button">Add Address</button>
              </form>
            </div>
          </div>
          }
          {address == 'recipient' &&
            <div className="quiz-recipient-mail-address">
              <div className="form-group-single checkbox">
                <input type="checkbox"/>
                <span>I don’t know their address, email them for me to ask their address</span>
              </div>
              <div className="quiz-recipient-mail-address-container">
                <form>
                  <div className="form-group-single  mail">
                    <input type="text" placeholder="Full Name" required/>
                  </div>
                  <div className="form-group-single mail">
                    <input type="text" placeholder="Address Line 1" required/>
                  </div>
                  <div className="form-group-single mail">
                    <input type="text" placeholder="Address Line 2"/>
                  </div>
                  <div className="form-group-double mail">
                    <input type="text" placeholder="City" required/>
                    <input type="text" placeholder="State" required/>
                  </div>
                  <div className="form-group-single mail">
                    <input type="text" placeholder="Zip Code" required/>
                  </div>
                  <button className="form-button mail-button">Add Address</button>
                </form>
              </div>
            </div>
          }
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'message')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'message')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
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
                  <input type="text" name="name" required/>
                  <div className="checkbox_2"><input type="checkbox" /><span>Leave it blank</span></div>
                </div>
                <div className="form-group-single message p-0">
                  <label htmlFor="message">Handwritten message inside:</label>
                  <textarea className="w-4" cols="100" rows="5"></textarea>
                  <div className="checkbox_2"><input type="checkbox" /><span>Leave it blank</span></div>
                  <div className="checkbox_2 w-4 info-popup"><input type="checkbox" />
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
                  <input type="text" name="name" required/>
                </div>
              </form>
              <div className="checkbox_2 center show-on-mobile"><input type="checkbox" /><span>Not sure yet, ask me later</span></div>
            </div>
          </div>
          <div className="checkbox_2 center hide-on-mobile"><input type="checkbox" /><span>Not sure yet, ask me later</span></div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'description')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'description')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
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
                  <input type="checkbox" name="wager"/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>The life of a party</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager"/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Soft spoken</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager"/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Thoughful</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager"/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Strong minded</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager"/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Super chill & down to earth</label>
              </div>
              <div className="form-group-list">
                <div className="form-group-list-container">
                  <input type="checkbox" name="wager"/>
                  <span></span>
                  <div className="form-group-list-fill"></div>
                </div>
                <label>Other (please specify)</label>
              </div>
              <input type="text" className="quiz-recipient-description-other"/>
            </div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'description')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'description')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
        </>
        }
      </div>
      <Footer></Footer>
    </>
  )
}

export default quiz
