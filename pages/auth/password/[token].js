import withParams from '../../withParams'
import {useState} from 'react'
import axios from 'axios'
import {API} from '../../../config'

const ResetPassword = ({token}) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const submitPasswords = async () => {
    try {
      const responsePasswords = await axios.post(`${API}/auth/update-password`, {password, confirmPassword, token})
      setMessage(responsePasswords.data)
      setPassword('')
      setConfirmPassword('')
      console.log(responsePasswords)
    } catch (error) {
      console.log(error.response)
      if(error) error.response ? error.response.data ? error.response.data.error ? setMessage(error.response.data.error.msg) : null : null : null
      if(error) error.response ? error.response.data ?  error.response.data.error ? null : setMessage(error.response.data) : null : null
    }
  }
  
  return (
    <div className="resetPassword">
      <h1 className="resetPassword-title">Reset Password</h1>
      <input autoFocus={true} type="password" className="resetPassword-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" required/>
      <input autoFocus={true} type="password" className="resetPassword-password" name="confirmPassword" value={confirmPassword} onChange={(e) => (setConfirmPassword(e.target.value), setMessage(''))} placeholder="Confirm New Password" required/>
      <span className="resetPassword-message">{password !== confirmPassword ? `Passwords don't match` : null}{message ? message: null}</span>
      <button className="resetPassword-button" onClick={submitPasswords}>Reset Password</button>
      <a href="/login" className="resetPassword-login">Login</a>
    </div>
  )
}

export default withParams(ResetPassword)
