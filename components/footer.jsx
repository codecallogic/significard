
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
          <svg><use xlinkHref="sprite.svg#icon-facebook-square"></use></svg>
          <svg><use xlinkHref="sprite.svg#icon-instagram"></use></svg>
          <svg><use xlinkHref="sprite.svg#icon-twitter"></use></svg>
          <svg><use xlinkHref="sprite.svg#icon-linkedin-square"></use></svg>
          <svg><use xlinkHref="sprite.svg#icon-pinterest-p"></use></svg>
        </div>
      </div>
    </div>
  )
}

export default Footer
