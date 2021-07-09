import withParams from '../../withParams'
import {useState} from 'react'
import axios from 'axios'
import {API} from '../../../config'

const ResetPassword = ({token}) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submitPasswords = async () => {
    try {
      const responsePasswords = await axios.post(`${API}/auth/update-password`, {password, confirmPassword, token})
      setMessage(responsePasswords.data)
      setPassword('')
      setConfirmPassword('')
      console.log(responsePasswords)
    } catch (error) {
      console.log(error.response)
      if(error) error.response ? error.response.data ? error.response.data.error ? setError(error.response.data.error.msg) : null : null : null
      if(error) error.response ? error.response.data ?  error.response.data.error ? null : setError(error.response.data) : null : null
    }
  }
  
  return (
    <>
    {!message ? <div className="resetPassword">
      <h1 className="resetPassword-title">Reset Password</h1>
      <input autoFocus={true} type="password" className="resetPassword-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onFocus={(e) => e.target.placeholder=''} onBlur={(e) => e.target.placeholder='Password'} required/>
      <input autoFocus={true} type="password" className="resetPassword-password" name="confirmPassword" value={confirmPassword} onChange={(e) => (setConfirmPassword(e.target.value), setMessage(''))} placeholder="Confirm password" onFocus={(e) => e.target.placeholder=''} onBlur={(e) => e.target.placeholder='Confirm password'}  required/>
      <span className="resetPassword-message">{password !== confirmPassword ? `Passwords don't match` : null}{error ? error: null}</span>
      <button className="resetPassword-button" onClick={submitPasswords}>Reset Password</button>
      <a href="/login" className="resetPassword-login">Login</a>
    </div>
    :
    null
    }
    {message ?
    <div className="resetPassword-message-container">
      <div className="resetPassword-message">{message ? message: null}</div>
      <a href="/login" className="resetPassword-login">Login</a>
    </div>
    : null
    }
    </>
  )
}

export default withParams(ResetPassword)
