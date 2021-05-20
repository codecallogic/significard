import Nav from '../../../components/nav'
import axios from 'axios'
import {API} from '../../../config'
import { useRouter } from 'next/router'
import {useState} from 'react'
import {connect} from 'react-redux'
axios.defaults.withCredentials = true

const ActivateAccount = ({user, userUpdate, userMessage}) => {
  const router = useRouter()

  const activateUser = async (e) => {
    e.preventDefault()
    
    let query = router.query
    try {
      const responseActivate = await axios.post(`${API}/auth/activate-account`, {query})
      userUpdate(responseActivate.data)
      userMessage(null)
      window.location.href = '/survey'
    } catch (error) {
      console.log(error)
      if(error) error.response ? userMessage(error.response.data) : userMessage(null)
    }
  }
  
  return (
    <>
      {user.message == null && <div className="activate">
        <div>Hello, click on the button below to activate!</div>
        <a href="/survey" className="activate-login" onClick={activateUser}>Activate Account!</a>
      </div>
      }

      {user.message !== null && <div className="activate">
        <div>{user.message}</div>
        <a href="/signup" className="activate-login">Signup to Start</a>
      </div>
      }
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

export default connect(mapStateToProps, mapDispatchToProps)(ActivateAccount)
