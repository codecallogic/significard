import {useEffect} from 'react'
import {connect} from 'react-redux'
import firebase from 'firebase'
import {initializeFirebase} from '../helpers/firebase'
import axios from 'axios'
import {API} from '../config'
import Nav from '../components/nav'

initializeFirebase()

const Home = ({user, userUpdate}) => {
  console.log(user)
  const signOut = async () => {
    try {
      const responseSignOut = await axios.post(`${API}/auth/logout`)
      firebase.auth().signOut()
      window.location.href = '/signup'
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <>
    <Nav></Nav>
    <div className="home">
      <div>Welcome, {user.userName ? user.userName : user.userEmail}</div>
      {user.userName ? <a className="home-logout" onClick={signOut}>Logout</a> : <a href="/login"> Login</a>}
    </div>
    </>
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
