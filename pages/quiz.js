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

  const quizProgress = (e, next) => {
    let els = document.querySelectorAll('.quiz-recipient-item')
    let els2 = document.querySelectorAll('.quiz-recipient-age-item')
    let els3 = document.querySelectorAll('.quiz-recipient-event-item')

    els.forEach( (el) => {el.classList.remove("quiz-recipient-item-active")})
    els2.forEach( (el) => {el.classList.remove("quiz-recipient-age-item-active")})
    els3.forEach( (el) => {el.classList.remove("quiz-recipient-age-event-active")})

    els.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-item-active") : null})
    els2.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-age-item-active") : null})
    els3.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-event-item-active") : null})

    setTimeout(() => {
      setquiz(next)
    }, 500);
  }

  const quizProgressNav = (e, next) => {
    setquiz(next)
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
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Friend</div>
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Partner</div>
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Mom</div>
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Dad</div>
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Sister</div>
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Brother</div>
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Grandma</div>
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Grandpa</div>
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Daughter</div>
            <div className="quiz-recipient-item" onClick={(e) => quizProgress(e,'age')}>Other</div>
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
          <div className="quiz-title">What are the events you'd like to send cards for your mom?</div>
          <div className="quiz-title-mobile">Select an event for mom.</div>
          <div className="quiz-subtitle">Pick one or more events. Select teh estimated arrival date for each card. Make sure it's at least 3 weeks away!</div>
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
          <div className="quiz-title">How would you rank the styles that describe your mom?</div>
          <div className="quiz-title-mobile">Rate the cards for mom.</div>
          <div className="quiz-subtitle">How would you rank the styles that describe your mom?</div>
          <div className="quiz-subtitle-mobile">What does mom like? Drag and drog from 1 (most important) to 6 (least important).</div>
          <div className="quiz-recipient-style">
            {stylesList.map( (item, idx) => 
            <div key={idx} style={{transform: `rotate(${item.rotate}deg)`}} className="quiz-recipient-style-item">
              {item.imageName ? <img src={`/media/styles/${item.imageName}`}></img> : null}
              <span >{item.subtitle}</span>
            </div>
            )
            }
          </div>
          <div className="quiz-recipient-style-drop">
            {stylesListDrop.map( (item, idx) => 
            <div key={idx} className="quiz-recipient-style-drop-item" style={{border: `2px solid ${item.color}`}}><span style={{backgroundColor: `${item.color}`}}>{idx + 1}</span></div>
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
          <div className="quiz-title">Anything specific your mom might like?</div>
          <div className="quiz-title-mobile">Anything specific your mom might like?</div>
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
                  <img style={{transform: `rotate(${item.rotate}deg)`}} src={`/media/package/${item.image}`} alt="" />
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
                  <img style={{transform: `rotate(${item.rotate}deg)`}} src={`/media/package/${item.image}`} alt="" />
                )}
              </div>
              <div className="quiz-recipient-package-item-price">$10.99 /card</div>
              <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div>
              <button className="quiz-recipient-package-item-button">Select</button>
              <div>Free Shipping</div>
            </div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'recipient')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'recipient')}>
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
