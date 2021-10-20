import SVG from '../../files/svgs'

const NavUser = ({}) => {
  
  return (
    <div className="nav-user-container">
      <nav className="nav-user">
        <div className="nav-user-arrow"><SVG svg={'arrow-left-thin'}></SVG></div>
        <div className="nav-user-current">Profile</div>
        <div className="nav-user-menu">
          <input type="checkbox" name="nav-toggle" id="nav-toggle" className="nav-user-menu-checkbox"/>
          <label htmlFor="nav-toggle" className="nav-user-menu-burger"><span className="nav-user-menu-icon"></span></label>
          <div className="nav-user-menu-background"></div>
          <div className="nav-user-list">
            <ul className="nav-user-list-items">
              <li className="nav-user-list-items-item"><a className="nav-user-list-items-link" href="/">Home</a></li>
              <li className="nav-user-list-items-item"><a className="nav-user-list-items-link" href="/">Pricing</a></li>
              <li className="nav-user-list-items-item"><a className="nav-user-list-items-link" href="/">About</a></li>
              <li className="nav-user-list-items-item"><a className="nav-user-list-items-link" href="/">FAQ</a></li>
              <li className="nav-user-list-items-item"><a  className="nav-user-list-items-link" href="/">Account</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavUser
