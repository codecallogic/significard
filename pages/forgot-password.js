import Nav from '../components/nav'
import Footer from '../components/footer'
import {useState} from 'react'
import axios from 'axios'
import {API} from '../config'

const ForgotPassword = ({}) => {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  
  const submitRequest = async () => {
    try {
      const responseForgotPassword = await axios.post(`${API}/auth/forgot-password`, {email})
      setMessage(responseForgotPassword.data)
    } catch (error) {
      if(error) error.response ? setMessage(error.response.data) : null
    }
  }

  return (
    <>
      <Nav></Nav>
      {!message ? <div className="forgotPassword">
        <h1 className="forgotPassword-title">Forgot Password?</h1>
        <div className="forgotPassword-subtitle">Enter the email address associated with your account.</div>
        <input autoFocus={true} type="text" className="forgotPassword-email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <button className="forgotPassword-button" onClick={submitRequest}>Submit</button>
        <a href="/login" className="forgotPassword-signup">Sign up</a>
      </div>
      : 
      null
      }
      {message ? <div className="forgotPassword"><span className="forgotPassword-message">{message}</span></div> : null}
      {/* <Footer></Footer> */}
    </>
  )
}

export default ForgotPassword
