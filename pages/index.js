import {useEffect} from 'react'
import {connect} from 'react-redux'
import firebase from 'firebase'
import {initializeFirebase} from '../helpers/firebase'

initializeFirebase()

const Home = ({user, userUpdate}) => {

  useEffect( () => {
    firebase.auth().onAuthStateChanged( user => {
      userUpdate(user)
    })
  }, [])
  
  return (
    <div className="home">
      <div>Hi, {user.userName}</div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
      user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
      userUpdate: (user) => dispatch({type: 'USER', payload: user})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
