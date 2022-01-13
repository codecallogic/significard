import Nav from '../components/nav'
import NavMobile from '../components/navMobile'
import Footer from '../components/footer'
import checkUser from './checkUser'
import {useEffect, useState} from 'react'
import Slider from '../components/slider/sliderPricing'

const Pricing = ({loggedIn}) => {
  const [result, setResult] = useState('')
  const [message, setMessage] = useState('')
  const [custom, setCustom] = useState('')

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
  }
  
  const calculate = () => {
    setMessage('')
    if(+custom == 0) return setMessage('Must be greater than 0')
    if(+custom <= 4) setResult(13.99)
    if(+custom > 4 ) setResult(11.99)
    if(+custom > 9) setResult(8.99)
    if(+custom > 19) setResult(6.99)
    if(+custom > 50){setMessage('For 50+ cards, please contact us.'), setResult('')}
  }
  
  return (
    <>
    <Nav loggedIn={loggedIn} color={'#003E5F'}></Nav>
    <NavMobile loggedIn={loggedIn} color={'#003E5F'}></NavMobile>
    <div className="pricing-packages">
      <div className="quiz-title">Choose the number of cards you'd like to receive for ANY recipients</div>
      <div className="quiz-title-mobile">Choose the number of cards you'd like to receive for ANY recipients</div>
      <div className="quiz-recipient-package">
        <div className="quiz-recipient-package-item">
          <div className="quiz-recipient-package-item-title">Shy Sender</div>
          <div className="quiz-recipient-package-item-subtitle">You get 5 cards </div>
          <div className="quiz-recipient-package-item-image-container">
            {/* {packageList.slice(3, 6).map((item, idx) =>
              <img key={idx} style={{transform: `rotate(${item.rotate}deg)`}} src={`/media/package/${item.image}`} alt="" />
            )} */}
            <img src={`/media/package/standard.png`} alt="" />
          </div>
          <div className="quiz-recipient-package-item-plan">$4.99/mo</div>
          <div className="quiz-recipient-package-item-price">$11.99 per card</div>
          {/* <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div> */}
          <button className="quiz-recipient-package-item-button" onClick={() => window.location.href = '/quiz'}>Get Started</button>
          <div className="quiz-recipient-package-item-features">
            <div>&#8226; Free Shipping</div>
            <div>&#8226; Envelope</div>
            <div>&#8226; Access to event calendar</div>
            <div>&#8226; Event reminders</div>
          </div>
        </div>
        <div className="quiz-recipient-package-item">
          <div className="quiz-recipient-package-item-title">Friends & Fam</div>
          <div className="quiz-recipient-package-item-subtitle">You get 10 cards </div>
          <div className="quiz-recipient-package-item-image-container">
            <img src={`/media/package/standard.png`} alt="" />
          </div>
          <div className="quiz-recipient-package-item-plan">$7.49/mo</div>
          <div className="quiz-recipient-package-item-price">$8.99 per card</div>
          {/* <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div> */}
          <button className="quiz-recipient-package-item-button" onClick={() => window.location.href = '/quiz'}>Get Started</button>
          <div className="quiz-recipient-package-item-features">
            <div>&#8226; Free Shipping</div>
            <div>&#8226; Envelope</div>
            <div>&#8226; Access to event calendar</div>
            <div>&#8226; Event reminders</div>
            <div>&#8226; Handwritten message</div>
          </div>
        </div>
        <div className="quiz-recipient-package-item">
          <div className="quiz-recipient-package-item-title">Social Butterfly</div>
          <div className="quiz-recipient-package-item-subtitle">You get 20 cards </div>
          <div className="quiz-recipient-package-item-image-container">
            <img src={`/media/package/standard.png`} alt="" />
          </div>
          <div className="quiz-recipient-package-item-plan">$11.65/mo</div>
          <div className="quiz-recipient-package-item-price">$6.99 per card</div>
          {/* <div className="quiz-recipient-package-item-discount">%15 discount for 10+ cards</div> */}
          <button className="quiz-recipient-package-item-button" onClick={() => window.location.href = '/quiz'}>Get Started</button>
          <div className="quiz-recipient-package-item-features">
            <div>&#8226; Free Shipping</div>
            <div>&#8226; Envelope</div>
            <div>&#8226; Access to event calendar</div>
            <div>&#8226; Event reminders</div>
            <div>&#8226; Handwritten message</div>
            <div>&#8226; Rollover unsused cards</div>
          </div>
        </div>
        <div className="quiz-recipient-package-item">
          <div className="quiz-recipient-package-item-title">One Time Payment</div>
          <div className="quiz-recipient-package-item-subtitle">Choose Your Volume</div>
          <div className="quiz-recipient-package-item-input">
            <input id="custom_quantity" type="text" value={custom} onChange={(e) => (setResult(''), validateIsNumber('custom_quantity'), setCustom(e.target.value))} placeholder="Number of Cards" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Number of Cards'} onKeyDown={(e) => {
              if (e.code === "Enter") {
                calculate()
              }
            }}/>
          </div>
          {!result && <button className="quiz-recipient-package-item-button mb-2" onClick={ () => (calculate())}>Calculate</button>
          }
          {result && <button className="quiz-recipient-package-item-button mb-2" onClick={ (e) => window.location.href = '/quiz'}>Get Started</button>
          }
          {result && <>
          <div className="quiz-recipient-package-item-price">${result} per card</div>
          <div>Free Shipping</div>
          </>}
          {message && <div className="form-message-error">{message}</div>}
        </div>
      </div>
      <Slider result={result} setResult={setResult} calculate={calculate} validateisnumber={validateIsNumber} message={message} setMessage={setMessage} calculate={calculate} validateIsNumber={validateIsNumber} custom={custom} setCustom={setCustom}></Slider>
      <div className="quiz-recipient-package-bulk">For more than 50 cards, please <a href="mailto: hello@significard.com">contact us</a></div>
      {/* <div className="quiz-recipient-package-footer">All packages come with the following items <span>at no extra cost</span></div>
      <div className="quiz-recipient-package-footer-2">
        <div className="quiz-recipient-package-footer-2-item">
          Blank or preselected <strong>handwritten</strong> message inside the card
        </div>
        <div className="quiz-recipient-package-footer-2-item">
          Envelope
        </div>
        <div className="quiz-recipient-package-footer-2-item">
          USPS Forever First Class Stamps
        </div>
      </div> */}
    </div>
    <Footer></Footer>
    </>
  )
}

export default checkUser(Pricing)
