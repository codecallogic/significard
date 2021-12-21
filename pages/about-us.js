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
        <p>Significard is a subscription startup that recommends and schedules relatable eco-friendly greeting cards combining technology with real independent artists. For us, a greeting card is a small piece of art with an appreciation letter that makes a person feel significant (hence the name Significard). We wanted to find a solution to not go through 100s of card choices that don’t even relate or miss another birthday and other events ever again!</p>
        <br />
        <p>The idea of Significard came to our CEO, Ekaterina Taunova, who has been working in IT, but always had a passion for art and card giving. She started testing the idea in early 2020, and with the help from her friends and family Signficard started to get some traction. After finding a technical Co-Founder, Nick Kridler, in 2021 Significard’s technology magic has finally started to evolve to provide better card recommendations for you and your recipients.</p>
        <br />
        <p>This year we joined the top pre-seed startup accelerator program, the Founder Institute, that helps us grow and evolve so we could provide you the best services.</p>
        <br />
        <p>With the help from our Marketing Manager, Geisha Naut Diaz, we have been learning more about branding and spreading awareness (btw we are small, so sharing our link with your friend would mean the world to us!)</p>
        <br />
        <p>This platform is new and evolving and any feedback is welcomed :) We will continue to improve our business and help you create beautiful connections.</p>
        <br />
        <p>Our mission: Simplify the way you choose and send greeting cards, and help you express your caring to people significant to you, while empowering small independent artists to grow. </p>
      </div>
      <div className="aboutus-title">Meet the Team</div>
      <div className="aboutus-team">
        <div className="aboutus-team-item">
          <img src="/media/about/about-us-katia.jpeg" alt="" />
          <div className="aboutus-team-item-name">Ekaterina Taunova</div>
          <div className="aboutus-team-item-title">CEO & Founder</div>
          {/* <div className="aboutus-team-item-button">Read more</div> */}
        </div>
        <div className="aboutus-team-item">
          <img src="/media/about/about-us-nick.jpeg" alt="" />
          <div className="aboutus-team-item-name">Nick Kridler</div>
          <div className="aboutus-team-item-title">Co-Founder</div>
          {/* <div className="aboutus-team-item-button">Read more</div> */}
        </div>
        <div className="aboutus-team-item">
          <img src="/media/about/about-us-geisha.jpeg" alt="" />
          <div className="aboutus-team-item-name">Geisha Diaz</div>
          <div className="aboutus-team-item-title">Marketing Manager</div>
          {/* <div className="aboutus-team-item-button">Read more</div> */}
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  )
}

export default checkUser(AboutUs)
