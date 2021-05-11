import {useEffect} from 'react'
import {connect} from 'react-redux'
import firebase from 'firebase'
import {initializeFirebase} from '../helpers/firebase'
import axios from 'axios'
import {API} from '../config'

initializeFirebase()

const Home = ({user, userUpdate}) => {

  const signOut = async () => {
    try {
      const responseSignOut = await axios.post(`${API}/auth/logout`)
      firebase.auth().signOut()
      userUpdate(user)
      window.location.href = '/signup'
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="home">
      <div>Hi, {user.userName}</div>
      {user.userName ? <p className="home-logout" onClick={signOut}>Logout</p> : null }
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
