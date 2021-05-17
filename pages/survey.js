import Nav from '../components/nav'
import Footer from '../components/footer'
import withUser from './withUser'

const Survey = ({newUser}) => {
  return (

    // TODO: Will users only go through the survey process after signup or can they go through the survey at a later point after signup and already a user?

    <>
      <Nav></Nav>
      <div className="survey">
        <div className="survey-title">Who are we sending a card to?</div>
        <div className="survey-subtitle">For now just pick <span>one person</span>. Later, you can finish adding other loved ones in your profile.</div>
        <div className="survey-recipient">
          <div className="survey-recipient-item">Friend</div>
          <div className="survey-recipient-item">Partner</div>
          <div className="survey-recipient-item">Mom</div>
          <div className="survey-recipient-item">Dad</div>
          <div className="survey-recipient-item">Sister</div>
          <div className="survey-recipient-item">Brother</div>
          <div className="survey-recipient-item">Grandma</div>
          <div className="survey-recipient-item">Grandpa</div>
          <div className="survey-recipient-item">Daughter</div>
          <div className="survey-recipient-item">Other</div>
        </div>
        <button className="survey-button">Next</button>
        <div className="survey-next">
          <svg><use xlinkHref="sprite.svg#icon-chevron-thin-right"></use></svg>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}

export default withUser(Survey)
