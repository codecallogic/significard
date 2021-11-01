import Nav from '../components/nav'
import NavMobile from '../components/navMobile'
import Footer from '../components/footer'
import checkUser from './checkUser'

const AboutUs = ({loggedIn}) => {
  
  return (
    <>
    <Nav loggedIn={loggedIn}></Nav>
    <NavMobile loggedIn={loggedIn}></NavMobile>
    <div className="aboutus">
      <div className="aboutus-title">Our Story</div>
      <div className="aboutus-description">
        <p>Significard is a <span>female-run startup</span> founded by Ekaterina Taunova, who was always passionate about art, gifts, and technology. Her dream was to find a solution to help people stay connected on a deeper level, especially since COVID started.</p>
        <br />
        <p>The website you’re seeing now is temporary (MVP). We are in the process of developing an automated platform which will help your entire process much faster and smoother :)</p>
        <br />
        <p>This year we joined the top pre-seed startup accelerator program, the Founder Institute, that helps us grow and evolve so we could provide you the best services.</p>
      </div>
      <div className="aboutus-title">Meet the Team</div>
      <div className="aboutus-team">
        <div className="aboutus-team-item">
          <img src="https://via.placeholder.com/150" alt="" />
          <div className="aboutus-team-item-name">Ekaterina Taunova</div>
          <div className="aboutus-team-item-title">CEO & Founder</div>
          <div className="aboutus-team-item-button">Read more</div>
        </div>
        <div className="aboutus-team-item">
          <img src="https://via.placeholder.com/150" alt="" />
          <div className="aboutus-team-item-name">Ekaterina Taunova</div>
          <div className="aboutus-team-item-title">CEO & Founder</div>
          <div className="aboutus-team-item-button">Read more</div>
        </div>
        <div className="aboutus-team-item">
          <img src="https://via.placeholder.com/150" alt="" />
          <div className="aboutus-team-item-name">Ekaterina Taunova</div>
          <div className="aboutus-team-item-title">CEO & Founder</div>
          <div className="aboutus-team-item-button">Read more</div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  )
}

export default checkUser(AboutUs)
