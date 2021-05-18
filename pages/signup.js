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

const SignUp = ({newUser, user, userUpdate, userMessage}) => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const uiConfig = {
    signInFlow: 'popup',
    // signInSuccessUrl: `/signup`,
    signInOptions: [
      {
        provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        fullLabel: 'Facebook'
      },
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        fullLabel: 'Google'
      }
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        signUpFirebase(authResult.user)
        return false
      },
      signInFailure: (error) => console.log(error)
    }
  }

  const signUp = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const responseSignUp = await axios.post(`${API}/auth/signup`, {name, email, password})
      console.log(responseSignUp)
      userMessage(responseSignUp.data)
      setLoading(false)
      setName('')
      setEmail('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const signUpFirebase = async (user) => {
    setLoading(true)
    try {
      const responseSignUp = await axios.post(`${API}/auth/signup`, {user})
      userMessage(responseSignUp.data)
      setLoading(false)
      setName('')
      setEmail('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <>
    <Nav></Nav>
    <div className="signup-container">
    <div className="signup">
      <h1 className="signup-heading">Let's set up your account:</h1>
      <h2 className="signup-subheading">Select one or more events.</h2>
      <form className="signup-form" onSubmit={signUp}>
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
        <br/>
        {loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading" allowFullScreen></iframe> : null }
        {user.message !== null ? <div className="signup-form-message">{user.message !== null ? user.message : ''} </div> : loading ? null : <div className="giphy-loading-space">Loading...</div>}
        <div className="signup-form-break">
          <span></span>
          <p>OR continue with</p>
          <span></span>
        </div>
        <StyledFirebaseAuth 
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
        <p className="signup-form-signin">Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
    </div>
    <Footer></Footer>
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
      userUpdate: (user) => dispatch({type: 'USER', payload: user}),
      userMessage: (message) => dispatch({type: 'MESSAGE', payload: message})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
