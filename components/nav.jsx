import SVG from '../files/svgs'

const Nav = ({}) => {
  
  return (
    <div className="nav">
      <div className="nav-logo" onClick={() => window.location.href = '/'}><svg><use xlinkHref="sprite.svg#icon-logo"></use></svg><span>Significard</span></div>
      <div className="nav-menu">
        <a className="nav-menu-item">Pricing</a>
        <a className="nav-menu-item">About</a>
        <a className="nav-menu-item"><SVG svg={'question'}></SVG></a>
        <a className="nav-menu-item"><SVG svg={'person-user'}></SVG></a>
      </div>
    </div>
  )
}

export default Nav
