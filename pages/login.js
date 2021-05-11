import {useState, useEffect} from 'react'
import Nav from '../components/nav'
import Footer from '../components/footer'
import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import 'firebaseui/dist/firebaseui.css'
import {initializeFirebase} from '../helpers/firebase'
import axios from 'axios'
import {API} from '../config'
import withUser from './withUser'
import {useRouter} from 'next/router'
import {connect} from 'react-redux'
axios.defaults.withCredentials = true

initializeFirebase()

const SignUp = ({newUser, userUpdate}) => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const uiConfig = {
    signInFlow: 'popup',
    // signInSuccessUrl: `/signup`,
    signInOptions: [
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        loginFirebase(authResult.user)
        return false
      },
      signInFailure: (error) => console.log(error)
    }
  }

  const login = async (e) => {
    e.preventDefault()
    try {
      const responseLogin = await axios.post(`${API}/auth/login`, {email, password})
      userUpdate(responseLogin.data)
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  const loginFirebase = async (user) => {
    try {
      const responseLogin = await axios.post(`${API}/auth/login`, {user})
      userUpdate(responseLogin.data)
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <>
    <Nav></Nav>
    <div className="signup-container">
    <div className="signup">
      <h1 className="signup-heading">Login to access your account</h1>
      <form className="signup-form" onSubmit={login}>
        <div className="signup-form-group">
          <svg><use xlinkHref="sprite.svg#icon-user"></use></svg>
          <input type="text" name="name" placeholder="Name" value={name} onChange={ (e) => setName(e.target.value)}/>
        </div>
        <div className="signup-form-group">
          <svg><use xlinkHref="sprite.svg#icon-envelope"></use></svg>
          <input type="email" name="email" placeholder="E-mail" value={email} onChange={ (e) => setEmail(e.target.value)}/>
        </div>
        <div className="signup-form-group">
          <svg><use xlinkHref="sprite.svg#icon-lock"></use></svg>
          <input type="password" name="password" placeholder="Password" value={password} onChange={ (e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit">Continue with e-mail</button>
        <div className="signup-form-break">
          <span></span>
          <p>OR continue with</p>
          <span></span>
        </div>
        <StyledFirebaseAuth 
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
        <p className="signup-form-signin">Don't have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </div>
    </div>
    <Footer></Footer>
    </>
  )
}

const mapDispatchToProps = dispatch => {
  return {
      userUpdate: (user) => dispatch({type: 'USER', payload: user})
  }
}

export default connect(null, mapDispatchToProps)(withUser(SignUp))
