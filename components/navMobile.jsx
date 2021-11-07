import SVG from '../files/svgs'
import axios from 'axios'
import {API} from '../config'
import firebase from 'firebase'
import {initializeFirebase} from '../helpers/firebase'

initializeFirebase()

const NavUser = ({loggedIn, color}) => {

  const signOut = async () => {
    try {
      const responseSignOut = await axios.post(`${API}/auth/logout`)
      firebase.auth().signOut()
      window.location.href = '/signup'
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="nav-mobile-container" style={{backgroundColor: color}}>
      <div className="nav-mobile-logo" onClick={() => window.location.href = '/'}><SVG svg={'icon-logo'}></SVG><span>Significard</span></div>
      <nav className="nav-mobile">
        <div className="nav-mobile-menu">
          <input type="checkbox" name="nav-toggle" id="nav-toggle" className="nav-mobile-menu-checkbox"/>
          <label htmlFor="nav-toggle" className="nav-mobile-menu-burger"><span className="nav-mobile-menu-icon"></span></label>
          <div className="nav-mobile-menu-background"></div>
          <div className="nav-mobile-list">
            <ul className="nav-mobile-list-items">
              <li className="nav-mobile-list-items-item"><a className="nav-mobile-list-items-link" href="/">Home</a></li>
              <li className="nav-mobile-list-items-item"><a className="nav-mobile-list-items-link" href="/">Pricing</a></li>
              <li className="nav-mobile-list-items-item"><a className="nav-mobile-list-items-link" href="/about-us">About</a></li>
              <li className="nav-mobile-list-items-item"><a className="nav-mobile-list-items-link" href="/faq">FAQ</a></li>
              <li className="nav-mobile-list-items-item"><a  className="nav-mobile-list-items-link" href="#" onClick={() => loggedIn ? window.location.href = `/account/${loggedIn.id}` : window.location.href = '/login'}>Account</a></li>
              {loggedIn.username && <li className="nav-mobile-list-items-item"><a  className="nav-mobile-list-items-link" href="#" onClick={() => signOut()}>Logout</a></li>}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavUser
