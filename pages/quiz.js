import Nav from '../components/nav'
import Footer from '../components/footer'
import withUser from './withUser'
import {useState} from 'react'

const quiz = ({}) => {

  const [quiz, setquiz] = useState('recipient')
  const [recipient, setRecipient] = useState('')

  const quizProgress = (e, next) => {
    let els = document.querySelectorAll('.quiz-recipient-item')
    let els2 = document.querySelectorAll('.quiz-recipient-age-item')

    els.forEach( (el) => {el.classList.remove("quiz-recipient-item-active")})
    els2.forEach( (el) => {el.classList.remove("quiz-recipient-age-item-active")})

    els.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-item-active") : null})
    els2.forEach( (el) => {el.textContent == e.target.textContent ? el.classList.add("quiz-recipient-age-item-active") : null})

    setTimeout(() => {
      setquiz(next)
    }, 700);
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
          <div className="quiz-subtitle">For now just pick <span>one person</span>. Later, you can finish adding other loved ones in your profile.</div>
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
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgress(e, 'age')}>Next</button></div>
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
          <div className="quiz-subtitle">Select one.</div>
          <div className="quiz-recipient-age">
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'age')}>18-24</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'age')}>25-34</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'age')}>35-44</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e, 'age')}>45-54</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'age')}>55-64</div>
            <div className="quiz-recipient-age-item" onClick={(e) => quizProgress(e,'age')}>65 or above</div>
          </div>
          <div className="quiz-button-container"><button className="quiz-button" onClick={(e) => quizProgressNav(e,'age')}>Next</button><div className="quiz-button-container"></div></div>
          <div className="quiz-next" onClick={(e) => quizProgressNav(e,'age')}>
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
