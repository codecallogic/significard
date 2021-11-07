import SVG from '../../files/svgs'
import {initializeFirebase} from '../../helpers/firebase'
import axios from 'axios'
import {API} from '../../config'
import firebase from 'firebase'

initializeFirebase()

const NavUser = ({loggedIn, dashboard, setDashboard, setRecipient, setAddNew}) => {

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
    <div className="nav-user-container">
      <nav className="nav-user">
        {dashboard !== '' && <div className="nav-user-arrow" onClick={() => (setDashboard(''), document.querySelector('.profile-dashboard-recipients') ? document.querySelector('.profile-dashboard-recipients').classList.remove('hide-on-mobile') : null, setRecipient(''), setAddNew(false))}><SVG svg={'arrow-left-thin'}></SVG></div>}
        <div className="nav-user-current">
          {dashboard == '' ? 'Profile' : ''}
          {dashboard == 'profile' ? 'Contacts' : ''}
          {dashboard == 'info' ? 'My Info' : ''}
          {dashboard == 'orders' ? 'Orders' : ''}
        </div>
        <div className="nav-user-menu">
          <input type="checkbox" name="nav-toggle" id="nav-toggle" className="nav-user-menu-checkbox"/>
          <label htmlFor="nav-toggle" className="nav-user-menu-burger"><span className="nav-user-menu-icon"></span></label>
          <div className="nav-user-menu-background"></div>
          <div className="nav-user-list">
            <ul className="nav-user-list-items">
              <li className="nav-user-list-items-item"><a className="nav-user-list-items-link" href="/">Home</a></li>
              <li className="nav-user-list-items-item"><a className="nav-user-list-items-link" href="/">Pricing</a></li>
              <li className="nav-user-list-items-item"><a className="nav-user-list-items-link" href="/about-us">About</a></li>
              <li className="nav-user-list-items-item"><a className="nav-user-list-items-link" href="/faq">FAQ</a></li>
              <li className="nav-user-list-items-item"><a  className="nav-user-list-items-link" href="#" onClick={() => loggedIn ? window.location.href = `/account/${loggedIn.id}` : window.location.href = '/login'}>Account</a></li>
              {loggedIn && loggedIn.username && <li className="nav-mobile-list-items-item"><a  className="nav-mobile-list-items-link" href="#" onClick={() => signOut()}>Logout</a></li>}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavUser
