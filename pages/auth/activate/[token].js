import Nav from '../../../components/nav'
import axios from 'axios'
import {API} from '../../../config'
import { useRouter } from 'next/router'
import {useState} from 'react'
import {connect} from 'react-redux'
axios.defaults.withCredentials = true

const ActivateAccount = ({user, userUpdate, userMessage, userEmail}) => {
  const router = useRouter()

  const [error, setError] = useState('')

  const activateUser = async (e) => {
    e.preventDefault()
    
    let query = router.query
    try {
      const responseActivate = await axios.post(`${API}/auth/activate-account`, {query})
      console.log(responseActivate)
      setError('')
      window.location.href = '/quiz'
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error ocurred activating account, please try again later or contact support')
    }
  }
  
  return (
    <>
      <div className="activate">
        <div>Hello, click on the button below to activate!</div>
        <a className="activate-login" onClick={activateUser}>Activate Account!</a>
        {error && 
          <div className="activate-error">{error}</div>
        }
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
      userMessage: (message) => dispatch({type: 'MESSAGE', payload: message}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivateAccount)
