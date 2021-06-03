import Nav from '../components/nav'
import Footer from '../components/footer'
import withUser from './withUser'
import {useState, useEffect} from 'react'
import {eventsList} from '../utils/quiz'

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
            <div key={idx} className={`quiz-recipient-event-item`} onClick={(e) => item.subtitle == 'more' ? setToggleEvents(!toggleEvents) : quizProgress(e,'styles')}>
              {item.imageName ? <img src={`/media/emojis/${item.imageName}`}></img> : null}
              <span className={item.subtitle == 'more' ? 'expand' : null}>{item.subtitle == 'more' ? toggleEvents ? 'less' : 'more' : item.subtitle}</span>
            </div>
            )
            }
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'age')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'styles')}>
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
