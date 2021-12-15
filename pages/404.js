import Nav from '../components/nav'
import NavMobile from '../components/navMobile'
import Footer from '../components/footer'
import checkUser from './checkUser'

const Custom404 = ({loggedIn}) => {
  
  return (
    <>
    <Nav></Nav>
    <NavMobile></NavMobile>
    <div className="not-found">
      <img src="/media/404.png" alt="" className="not-found-image" />
      <div className="not-found-message">Ooops. It looks like we forgot to fill out this card.</div>
      <div className="not-found-buttons">
        <a href="mailto: hello@significard.com" className="not-found-buttons-contact">Contact Us</a>
        <a href="/" className="not-found-buttons-homepage">Go to Homepage</a>
      </div>
    </div>
    <Footer></Footer>
    </>
  )
}

export default Custom404
