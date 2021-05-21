import Nav from '../components/nav'
import Footer from '../components/footer'
import withUser from './withUser'
import {useState} from 'react'

const Survey = ({}) => {

  const [survey, setSurvey] = useState('recipient')

  const surveyProgress = (next) => {
      setSurvey(next)
  }
  
  return (

    // TODO: Will users only go through the survey process after signup or can they go through the survey at a later point after signup and already a user?
    
    <>
      <Nav></Nav>
      <div className="survey">
        {survey == 'recipient' && <>
          <div className="survey-title">Who are we sending a card to?</div>
          <div className="survey-subtitle">For now just pick <span>one person</span>. Later, you can finish adding other loved ones in your profile.</div>
          <div className="survey-recipient">
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Friend</div>
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Partner</div>
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Mom</div>
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Dad</div>
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Sister</div>
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Brother</div>
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Grandma</div>
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Grandpa</div>
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Daughter</div>
            <div className="survey-recipient-item" onClick={() => surveyProgress('age')}>Other</div>
          </div>
          <button className="survey-button" onClick={() => surveyProgress('age')}>Next</button>
          <div className="survey-next" onClick={() => surveyProgress('age')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
        </>
        }
        {survey == 'age' && <>
          <div className="survey-back" onClick={() => surveyProgress('recipient')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-left"></use></svg>
          </div>
          <div className="survey-title">What's their age group?</div>
          <div className="survey-subtitle">Select one.</div>
          <div className="survey-recipient-age">
            <div className="survey-recipient-age-item" onClick={() => surveyProgress('age')}>18-24</div>
            <div className="survey-recipient-age-item" onClick={() => surveyProgress('age')}>25-34</div>
            <div className="survey-recipient-age-item" onClick={() => surveyProgress('age')}>35-44</div>
            <div className="survey-recipient-age-item" onClick={() => surveyProgress('age')}>45-54</div>
            <div className="survey-recipient-age-item" onClick={() => surveyProgress('age')}>55-64</div>
            <div className="survey-recipient-age-item" onClick={() => surveyProgress('age')}>65 or above</div>
          </div>
          <button className="survey-button" onClick={() => surveyProgress('age')}>Next</button>
          <div className="survey-next" onClick={() => surveyProgress('age')}>
            <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
          </div>
        </>
        }
      </div>
      <Footer></Footer>
    </>
  )
}

export default Survey
