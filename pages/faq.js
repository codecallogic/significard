import Nav from '../components/nav'
import NavMobile from '../components/navMobile'
import Footer from '../components/footer'
import checkUser from './checkUser'
import SVG from '../files/svgs'
import {useState} from 'react'

const FAQ = ({loggedIn}) => {

  const [item, setItem] = useState('')
  
  return (
    <>
      <Nav loggedIn={loggedIn} color={'#003E5F'}></Nav>
      <NavMobile loggedIn={loggedIn} color={'#003E5F'}></NavMobile>
      <div className="faq">
        <div className="faq-title">Frequently Asked Questions (FAQ)</div>
        <div className="faq-container">
          <div className="faq-questions">
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('one') : setItem('')}>
                <div>How much does Significard cost? </div>
                {item == 'one' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'one' &&<div className="faq-questions-item-description">
              Our packages go from $6.99 to $13.99 per card per year depending on how many cards per year you’d like to receive. The more you send, the less you spend! The price includes the card, a handwritten message, the stamp, the envelope, and delivery to the USPS. We also offer you additional help to write the most touchy message inside the card for an additional $2 per card.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('two') : setItem('')}>
                <div>Can I mail it to me and write the message myself? </div>
                {item == 'two' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'two' &&<div className="faq-questions-item-description">
              Yes, definitely! You can select that option in the quiz or in your profile.
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('three') : setItem('')}>
                <div>Do you offer volume discounts? </div>
                {item == 'three' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'three' &&<div className="faq-questions-item-description">
              Yes, we offer discounts on every order over 50 cards. Just contact us at hello@significard.com for a quote.   
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('four') : setItem('')}>
                <div>How long does the shipping take? </div>
                {item == 'four' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'four' &&<div className="faq-questions-item-description">
              We use the First Class USPS that takes 4-10 business days depending on your location and the location of the recipient. We apologize that we cannot promise a specific delivery date but we are working on solving that problem!  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('five') : setItem('')}>
                <div>Can I track, expedite my order? </div>
                {item == 'five' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'five' &&<div className="faq-questions-item-description">
              Our prices are inclusive of free shipping via USPS (first class mail). This means your order cannot be tracked (or have a delivery confirmation) or expedited. With that said, we find regular / first class post very reliable and orders arrive without issue provided that the mailing address is correct. The only way to check that a delivery has been made is to check with the actual recipient. We recommend that you only contact a recipient after the delivery window we have provided has passed - to avoid ruining the surprise.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('six') : setItem('')}>
                <div>Are Significard cards eco-friendly? </div>
                {item == 'six' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'six' &&<div className="faq-questions-item-description">
              Yes, our cards are made from 100% recycled paper. Sustainability is important to us, so we are working on being more environmentally friendly.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('seven') : setItem('')}>
                <div>Are Significard cards written by hand? </div>
                {item == 'seven' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'seven' &&<div className="faq-questions-item-description">
              Yes, our cards are handwritten by a real artist or one of our team members!   
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('eight') : setItem('')}>
                <div>Can I pick my font? </div>
                {item == 'eight' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'eight' &&<div className="faq-questions-item-description">
              We don’t do fonts because every card message is written by a real-life person, not computers or robots, but we’ll try our best to represent the message as you!  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('nine') : setItem('')}>
                <div>Where can I see cards I’ve ordered? </div>
                {item == 'nine' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'nine' &&<div className="faq-questions-item-description">
              Head to your profile, select the Orders section, where you’ll find your scheduled and sent cards. Once your card has been processed, you no longer can make changes/cancel it.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('ten') : setItem('')}>
                <div>Can I make a change after my order has been processed?  </div>
                {item == 'ten' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'ten' &&<div className="faq-questions-item-description">
              If it’s 2 weeks before the scheduled delivery date, you are able to make changes in your profile in the Recipients section. Once the message has been written inside the card, we’re no longer able to make changes to the cards
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('eleven') : setItem('')}>
                <div>Where do I add more cards?   </div>
                {item == 'eleven' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'eleven' &&<div className="faq-questions-item-description">
              If you want to order more cards for the created Recipient, click on the Recipient’s name, and click on “+ Add Your Cards Here” under Your Cards. If you want to order cards for a new Recipient, click on “Add Recipient” 
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('twelve') : setItem('')}>
                <div>I ran out of cards, how can I purchase more? </div>
                {item == 'twelve' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'twelve' &&<div className="faq-questions-item-description">
              Yes, you can go to “My Info” and click on “Add More Cards” under My Plans. 
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('thirteen') : setItem('')}>
                <div>Love your card? Let us know. </div>
                {item == 'thirteen' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'thirteen' &&<div className="faq-questions-item-description">
              You can leave us a Facebook Review here or just tag us on Facebook or Instagram post/story. You’ll receive a little surprise from us :) Your feedback (good or bad) is greatly appreciated.
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('fourteen') : setItem('')}>
                <div>I’m a business. Can I use your service? </div>
                {item == 'fourteen' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'fourteen' &&<div className="faq-questions-item-description">
              Yes! Please contact us at hello@significard.com 
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('fifteen') : setItem('')}>
                <div>How can I become a part of Significard? </div>
                {item == 'fifteen' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'fifteen' &&<div className="faq-questions-item-description">
              We are always looking for people to join our fam! Again, please contact us at hello@significard.com 
              </div>}
            </div>
          </div>
          <div className="faq-images">
            <img src="/media/faq/card.png" alt="" />
            <img src="/media/faq/card-2.png" alt="" />
            <img src="/media/faq/card-3.png" alt="" />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}

export default checkUser(FAQ)
