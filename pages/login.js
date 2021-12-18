import {useState, useEffect} from 'react'
import Nav from '../components/nav'
import NavMobile from '../components/navMobile'
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
import checkUser from './checkUser'
axios.defaults.withCredentials = true

initializeFirebase()

const Login = ({loggedIn, user, userUpdate, userMessage, userEmail}) => {
  
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [placeholderEmail, setPlaceholderEmail] = useState(null)
  const [placeholderPassword, setPlaceholderPassword] = useState(null)
  
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
        fullLabel: 'Google',
        customParameters: {
          prompt: 'select_account'
        }
      }
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        loginFirebase(authResult.user)
        return false
      },
      signInFailure: (error) => console.log('GOOGLE ERROR', error)
    }
  }

  const login = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const responseLogin = await axios.post(`${API}/auth/login`, {email, password})
      setLoading(false)
      userUpdate(responseLogin.data)
      userEmail(responseLogin.data)
      if(responseLogin.data.recipients){
        if(responseLogin.data.recipients[0]){
        responseLogin.data.recipients.length > 0 ? window.location.href = `account/${responseLogin.data._id}` : null
        }else{
          window.location.href = '/quiz'
        }
      }else{
        window.location.href = '/quiz'
      }
    } catch (error) {
      console.log(error.response)
      if(error) error.response ? userMessage(error.response.data) : userMessage(null)
      setLoading(false)
    }
  }

  const loginFirebase = async (user) => {
    setLoading(true)
    try {
      const responseLogin = await axios.post(`${API}/auth/login`, {user})
      // console.log(responseLogin.data)
      userEmail(responseLogin.data)
      setLoading(false)
      if(responseLogin.data.recipients){
        if(responseLogin.data.recipients[0]){
        responseLogin.data.recipients.length > 0 ? window.location.href = `account/${responseLogin.data._id}` : null
        }else{
          window.location.href = '/quiz'
        }
      }else{
        // console.log('2')
        window.location.href = '/quiz'
      }
    } catch (error) {
      // console.log('3')
      console.log(error)
      console.log(error.response)
      if(error) error.response ? userMessage(error.response.data) : userMessage(null)
      setLoading(false)
    }
  }
  
  return (
    <>
    <Nav loggedIn={loggedIn}></Nav>
    <NavMobile loggedIn={loggedIn}></NavMobile>
    <div className="signup-container">
      <div className="signup">
        <h1 className="signup-heading">Login to access your account</h1>
        <form className="signup-form" onSubmit={login}>
          <div className="signup-form-group">
            <svg><use xlinkHref="sprite.svg#icon-envelope"></use></svg>
            <input type="email" name="email" placeholder={placeholderEmail ? placeholderEmail : 'Email'} onFocus={() => setPlaceholderEmail(' ')} onBlur={() => setPlaceholderEmail('Email')} value={email} onChange={ (e) => setEmail(e.target.value)}/>
          </div>
          <div className="signup-form-group">
            <svg><use xlinkHref="sprite.svg#icon-lock"></use></svg>
            <input type="password" name="password" placeholder={placeholderPassword ? placeholderPassword : 'Password'} value={password} onFocus={() => setPlaceholderPassword(' ')} onBlur={() => setPlaceholderPassword('Password')} onChange={ (e) => setPassword(e.target.value)}/>
          </div>
          <button type="submit">Continue with E-mail</button>
          {loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading" allowFullScreen></iframe> : null }
          <br />
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
          <p className="signup-form-signin">Don't have an account? <a href="/signup">Sign Up</a></p>
          <a className="signup-form-forgotPassword" onClick={() => router.push('/forgot-password')}>Forgot password?</a>
        </form>
      </div>
      <span className="signup-terms">By continuing, you accept Significard's <a href="">Terms & Conditions</a></span>
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
      userMessage: (message) => dispatch({type: 'MESSAGE', payload: message}),
      userEmail: (email) => dispatch({type: 'EMAIL', payload: email}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(checkUser(Login))
