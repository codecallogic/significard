import Nav from '../../../components/nav'
import axios from 'axios'
import {API} from '../../../config'
import {useState, useEffect} from 'react'

const ActivateAccount = ({data, message}) => {
  
  return (
    <>
      {data && <div className="activate">
        <div>Hi {data.username}, your account is now activated!</div>
        <a href="/survey" className="activate-login">Click here to continue!</a>
      </div>
      }
      {message && <div className="activate">
        <div>{message}</div>
        <a href="/signup" className="activate-login">Signup</a>
      </div>
      }
    </>
  )
}

ActivateAccount.getInitialProps = async ({query, ctx}) => {  
  
  try {
    const responseActivate = await axios.post(`${API}/auth/activate-account`, {query})
    return {
      data: responseActivate.data ? responseActivate.data : null,
    }
    
  } catch (error) {
    return {
      message: error.response.data ? error.response.data : null,
    }
  }
}

export default ActivateAccount
