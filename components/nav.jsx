
const Nav = ({}) => {
  
  return (
    <div className="nav">
      <div className="nav-logo"><svg><use xlinkHref="sprite.svg#icon-logo"></use></svg><span>Significard</span></div>
      <div className="nav-menu">
        <a className="nav-menu-item">Pricing</a>
        <a className="nav-menu-item">About</a>
        <a className="nav-menu-item"><svg><use xlinkHref="sprite.svg#icon-question"></use></svg></a>
        <a className="nav-menu-item"><svg><use xlinkHref="sprite.svg#icon-person_outline"></use></svg></a>
      </div>
    </div>
  )
}

export default Nav
