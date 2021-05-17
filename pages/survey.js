import Nav from '../components/nav'
import withUser from './withUser'

const Survey = ({newUser}) => {
  return (

    // TODO: Will users only go through the survey process after signup or can they go through the survey at a later point after signup and already a user?

    <>
      <Nav></Nav>
      Hello
    </>
  )
}

export default withUser(Survey)
