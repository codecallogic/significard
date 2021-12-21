import SVG from '../files/svgs'

const Footer = ({}) => {
  
  return (
    <>
    <div className="footer">
      <div className="footer-left-container">
        <div className="footer-left-logo">Significard</div>
        <ul className="footer-left-list">
          <li className="footer-left-list-link" onClick={() => window.location.href = '/about-us'}>About Us</li>
          <li className="footer-left-list-link" onClick={() => window.location.href = '/pricing'}>Pricing</li>
          <li className="footer-left-list-link" onClick={() => window.location.href = '/faq'}>FAQ</li>
        </ul>
        <ul className="footer-left-list">
          {/* <h1 className="footer-left-list-heading">Questions?</h1>
          <li className="footer-left-list-link">FAQ</li>
          <li className="footer-left-list-link">Pricing</li> */}
        </ul>
      </div>
      <div className="footer-right-container">
        <h1 className="footer-right-heading">Join the Fam!</h1>
        <div className="footer-right-icons">
          <span onClick={ () => window.location.href = `https://www.facebook.com/significard`}><SVG svg={'facebook'}></SVG></span>
          <span onClick={ () => window.location.href = `https://www.instagram.com`}><SVG svg={'instagram'}></SVG></span>
          <span onClick={ () => window.location.href = `https://www.linkedin.com/company/significard`}><SVG svg={'linkedin'}></SVG></span>
        </div>
      </div>
    </div>
    <div className="footer-links">
      <ul className="footer-links-list">
        <li className="footer-links-list-link" onClick={() => window.location.href = '/'}>Terms of Use</li>
        <li className="footer-links-list-link" onClick={() => window.location.href = '/'}>Privacy Policy</li>
      </ul>
    </div>
    </>
  )
}

export default Footer
