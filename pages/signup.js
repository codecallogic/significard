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

const SignUp = ({loggedIn, user, userUpdate, userMessage}) => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [placeholderName, setPlaceholderName] = useState(null)
  const [placeholderEmail, setPlaceholderEmail] = useState(null)
  const [placeholderPassword, setPlaceholderPassword] = useState(null)
  const [message, setMessage] = useState('')
  
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
        signUpFirebase(authResult.user)
        return false
      },
      signInFailure: (error) => console.log(error)
    }
  }

  const signUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    userMessage('')
    
    try {
      const responseSignUp = await axios.post(`${API}/auth/signup`, {name, email, password}, {withCredentials: true, credentials: 'include'})
      // console.log(responseSignUp.data)
      setMessage(responseSignUp.data)
      setLoading(false)
      setName('')
      setEmail('')
      setPassword('')
      // setTimeout(() => {
      //   window.location.href = '/login'
      // }, 1500);
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) return error.response.data ? error.response.data.error ? userMessage(error.response.data.error.msg) : error.response.data ? userMessage(error.response.data) : userMessage('Error submitting form') : userMessage('Error submitting form')
    }
  }

  const signUpFirebase = async (user) => {
    setLoading(true)
    setMessage('')
    userMessage('')
    
    try {
      const responseLogin = await axios.post(`${API}/auth/login`, {user}, {withCredentials: true, credentials: 'include'})
      setLoading(false)
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
    // setLoading(true)
    // try {
    //   const responseSignUp = await axios.post(`${API}/auth/signup-firebase`, {user})
    //   userMessage(responseSignUp.data)
    //   setLoading(false)
    //   setName('')
    //   setEmail('')
    //   setPassword('')
    //   setTimeout(() => {
    //   window.location.href = '/login'
    //   }, 1500);
    // } catch (error) {
    //   console.log(error)
    //   setLoading(false)
    // }
  }

  return (
    <>
    <Nav loggedIn={loggedIn} color={'#003E5F'}></Nav>
    <NavMobile loggedIn={loggedIn} color={'#003E5F'}></NavMobile>
    <div className="signup-container">
    <div className="signup">
      <h1 className="signup-heading">Let's set up your account</h1>
      {/* <h2 className="signup-subheading">Select one or more events.</h2> */}
      <form className="signup-form" onSubmit={signUp}>
        <div className="signup-form-group">
          <svg><use xlinkHref="sprite.svg#icon-user"></use></svg>
          <input type="text" name="name" placeholder="Name" placeholder={placeholderName ? placeholderName : 'Name'} onFocus={() => setPlaceholderName(' ')} onBlur={() => setPlaceholderName('Name')} value={name} onChange={ (e) => setName(e.target.value)}/>
        </div>
        <div className="signup-form-group">
          <svg><use xlinkHref="sprite.svg#icon-envelope"></use></svg>
          <input type="email" name="email" placeholder="E-mail" placeholder={placeholderEmail ? placeholderEmail : 'Email'} onFocus={() => setPlaceholderEmail(' ')} onBlur={() => setPlaceholderEmail('Email')} value={email} onChange={ (e) => setEmail(e.target.value)}/>
        </div>
        <div className="signup-form-group">
          <svg><use xlinkHref="sprite.svg#icon-lock"></use></svg>
          <input type="password" name="password" placeholder="Password" placeholder={placeholderPassword ? placeholderPassword : 'Password'} value={password} onFocus={() => setPlaceholderPassword(' ')} onBlur={() => setPlaceholderPassword('Password')} value={password} onChange={ (e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit">Continue with E-mail</button>
        <br/>
        {loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading" allowFullScreen></iframe> : null }
        {message && <div className="message-login">{message}</div>}
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
      <div className="signup-terms">By continuing you accept Significard's <a href="/terms">Terms & Conditions</a></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(checkUser(SignUp))
