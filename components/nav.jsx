import SVG from '../files/svgs'
import axios from 'axios'
import {API} from '../config'
import firebase from 'firebase'
import {initializeFirebase} from '../helpers/firebase'

initializeFirebase()

const Nav = ({loggedIn, color}) => {
  const signOut = async () => {
    try {
      const responseSignOut = await axios.post(`${API}/auth/logout`)
      window.location.href = '/signup'
      firebase.auth().signOut()
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <>
    <div className="nav" style={{backgroundColor: color}}>
      <div className="nav-logo" onClick={() => window.location.href = '/'}><SVG svg={'icon-logo'}></SVG><span>Significard</span></div>
      <div className="nav-menu">
        <a className="nav-menu-item" onClick={() => window.location.href = '/'}>Pricing</a>
        <a className="nav-menu-item" onClick={() => window.location.href = '/about-us'}>About</a>
        <a className="nav-menu-item" onClick={() => window.location.href = '/faq'}><SVG svg={'question'}></SVG></a>
        <a className="nav-menu-item" onClick={() => loggedIn ? window.location.href = `/account/${loggedIn.id}` : window.location.href = '/login'}><SVG svg={'person-user'}></SVG></a>
        {!loggedIn && <a className="nav-menu-item" onClick={() => window.location.href = '/login'}>Sign In</a>}
        {loggedIn.username && <a className="nav-menu-item" onClick={() => signOut()}>Logout</a>}
      </div>
    </div>
    </>
  )
}

export default Nav
