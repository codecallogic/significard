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
      <Nav loggedIn={loggedIn}></Nav>
      <NavMobile loggedIn={loggedIn}></NavMobile>
      <div className="faq">
        <div className="faq-title">Frequently Asked Questions (FAQ)</div>
        <div className="faq-container">
          <div className="faq-questions">
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('one') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'one' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'one' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('two') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'two' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'two' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('three') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'three' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'three' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('four') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'four' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'four' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('five') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'five' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'five' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('six') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'six' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'six' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('seven') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'seven' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'seven' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('eight') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'eight' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'eight' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('nine') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'nine' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'nine' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
              </div>}
            </div>
            <div className="faq-questions-item">
              <div className="faq-questions-item-title" onClick={() => item == '' ? setItem('ten') : setItem('')}>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
                {item == 'ten' ? <SVG svg={'minus'}></SVG> : <SVG svg={'add'}></SVG>}
              </div>
              {item == 'ten' &&<div className="faq-questions-item-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, tellus non hendrerit, ligula diam tempor diam, sed pretium orci ex vel orci. Quisque laoreet dapibus diam sed malesuada. Nullam rhoncus a mi id bibendum. Donec ac ipsum fermentum tellus maximus consequat. Phasellus lorem felis, maximus eu consectetur at, viverra et turpis. Etiam cursus est nibh, in viverra sapien ullamcorper a. Fusce a auctor tellus. Vivamus in molestie tellus.  
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
