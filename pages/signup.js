import {useState, useEffect} from 'react'
import Nav from '../components/nav'
import Footer from '../components/footer'
import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import 'firebaseui/dist/firebaseui.css'
import {initializeFirebase} from '../helpers/firebase'
import axios from 'axios'
import {API} from '../config'

initializeFirebase()

const SignUp = ({}) => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: `/`,
    signInOptions: [
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {return true},
      signInFailure: (error) => console.log(error)
    }
  }

  const signUp = () => {
    //
  }
  
  return (
    <>
    <Nav></Nav>
    <div className="signup-container">
    <div className="signup">
      <h1 className="signup-heading">Let's set up your account:</h1>
      <h2 className="signup-subheading">Select one or more events.</h2>
      <form className="signup-form">
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
        <p className="signup-form-signin">Already have an account? <a href="">Sign in</a></p>
      </form>
    </div>
    </div>
    <Footer></Footer>
    </>
  )
}

export default SignUp
