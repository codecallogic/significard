import SVG from '../files/svgs'

const Footer = ({}) => {
  
  return (
    <div className="footer">
      <div className="footer-left-container">
        <div className="footer-left-logo">Significard</div>
        <ul className="footer-left-list">
          <h1 className="footer-left-list-heading">The Company</h1>
          <li className="footer-left-list-link">About Us</li>
          <li className="footer-left-list-link">Pricing</li>
          <li className="footer-left-list-link">Take the Quiz</li>
        </ul>
        <ul className="footer-left-list">
          <h1 className="footer-left-list-heading">Questions?</h1>
          <li className="footer-left-list-link">FAQ</li>
          <li className="footer-left-list-link">Pricing</li>
        </ul>
      </div>
      <div className="footer-right-container">
        <h1 className="footer-right-heading">Join the Fam!</h1>
        <div className="footer-right-icons">
          <SVG svg={'facebook'}></SVG>
          <SVG svg={'instagram'}></SVG>
          <SVG svg={'twitter'}></SVG>
          <SVG svg={'linkedin'}></SVG>
          <SVG svg={'pinterest'}></SVG>
        </div>
      </div>
    </div>
  )
}

export default Footer
