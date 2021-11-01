import SVG from '../files/svgs'

const Nav = ({loggedIn, color}) => {
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
      </div>
    </div>
    </>
  )
}

export default Nav
