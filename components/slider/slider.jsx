import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';
import { useSwipeable } from 'react-swipeable';

const Slider = ({slider, quizProgressNav, handleChange, result, setresult, calculate, validateisnumber, quizstate, moveSlide, message, setMessage}) => {
  const dispatch = useDispatch()
  const [swipe, setSwipe] = useState(0)

  const goToSlide = (e, i) => {
    let el = document.querySelectorAll('.slider-slides-item')
    if(i == 0) moveSlide(el[i].offsetWidth - 140, i)
    if(i == 1) moveSlide(-el[i].offsetWidth, i)
    if(i == 2) moveSlide(-el[i].offsetWidth*i, i)
    if(i == 3) moveSlide(-el[i].offsetWidth*i, i)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipe(swipe == 3 ? swipe : swipe + 1)
      let el = document.querySelectorAll('.slider-slides-item')
      if(swipe + 1 == 1) moveSlide(-el[swipe + 1].offsetWidth, swipe + 1)
      if(swipe + 1 == 2) moveSlide(-el[swipe + 1].offsetWidth*2, swipe + 1)
      if(swipe + 1 == 3) moveSlide(-el[swipe + 1].offsetWidth*3, swipe + 1)
    },
    onSwipedRight: () => {
      setSwipe(swipe == 0 ? swipe : swipe - 1)
      let el = document.querySelectorAll('.slider-slides-item')
      if(swipe - 1 == 0) moveSlide(el[0].offsetWidth - 140, 0)
      if(swipe - 1 == 1) moveSlide(-el[swipe - 1].offsetWidth, swipe - 1)
      if(swipe - 1 == 2) moveSlide(-el[swipe - 1].offsetWidth*2, swipe -1)
    }
  });
  
  return (
    <div className="slider">
      <div className="slider-slides">
        <div className="slider-slides-container"
         style={{
          transform: `translateX(${slider.translate}px)`
          }}
         {...handlers}
        >
          <div className="slider-slides-item">
            <div className="slider-slides-item-title">Shy Sender</div>
            <div className="slider-slides-item-subtitle">You get 5 cards </div>
            <img src={`/media/package/standard.png`} alt="" className="slider-slides-item-image" />
            <div className="slider-slides-item-plan">$4.99/mo</div>
            <div className="slider-slides-item-price">$11.99 per card</div>
            {/* <div className="slider-slides-item-discount">15% discount for 10+ cards</div> */}
            <button className="slider-slides-item-button" onClick={ (e) => (handleChange('package_plan', e, null, 'shy_sender', 5), window.location.href = '/checkout')}>Select</button>
            <div className="slider-slides-item-features">
              <div>&#8226; Free Shipping</div>
              <div>&#8226; Envelope</div>
              <div>&#8226; Access to event calendar</div>
              <div>&#8226; Event reminders</div>
            </div>
          </div>
          <div className="slider-slides-item">
            <div className="slider-slides-item-title">Friends & Fam</div>
            <div className="slider-slides-item-subtitle">You get 10 cards </div>
            <img src={`/media/package/standard.png`} alt="" className="slider-slides-item-image" />
            <div className="slider-slides-item-plan">$7.49/mo</div>
            <div className="slider-slides-item-price">$8.99 per card</div>
            {/* <div className="slider-slides-item-discount">15% discount for 10+ cards</div> */}
            <button className="slider-slides-item-button" onClick={ (e) => (handleChange('package_plan', e, null, 'friends_and_fam', 10), window.location.href = '/checkout')}>Select</button>
            <div className="slider-slides-item-features">
              <div>&#8226; Free Shipping</div>
              <div>&#8226; Envelope</div>
              <div>&#8226; Access to event calendar</div>
              <div>&#8226; Event reminders</div>
              <div>&#8226; Handwritten message</div>
            </div>
          </div>
          <div className="slider-slides-item">
            <div className="slider-slides-item-title">Social Butterfly</div>
            <div className="slider-slides-item-subtitle">You get 20 cards </div>
            <img src={`/media/package/standard.png`} alt="" className="slider-slides-item-image" />
            <div className="slider-slides-item-plan">$11.65/mo</div>
            <div className="slider-slides-item-price">$6.99 per card</div>
            {/* <div className="slider-slides-item-discount">15% discount for 10+ cards</div> */}
            <button className="slider-slides-item-button" onClick={ (e) => (handleChange('package_plan', e, null, 'social_butterfly', 20), window.location.href = '/checkout')}>Select</button>
            <div className="slider-slides-item-features">
              <div>&#8226; Free Shipping</div>
              <div>&#8226; Envelope</div>
              <div>&#8226; Access to event calendar</div>
              <div>&#8226; Event reminders</div>
              <div>&#8226; Handwritten message</div>
              <div>&#8226; Rollover unsused cards</div>
            </div>
          </div>
          <div className="slider-slides-item">
            <div className="slider-slides-item-title">One Time Payment</div>
            <div className="slider-slides-item-subtitle">Choose Your Volume</div>
            <div className="slider-slides-item-input">
              <input id="custom_quantity" type="text" value={quizstate.package_quantity} placeholder="Number of Cards" onChange={(e) => (setresult(''), validateisnumber('custom_quantity'), handleChange('package_plan', e, null, 'custom', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Number of Cards'} onKeyDown={(e) => {
              if (e.code === "Enter") {
                calculate()
              }
            }}/>
            </div>
            {!result && <button className="slider-slides-item-button mb-1" onClick={ () => (calculate())}>Calculate</button>
            }
            {result && <button className="slider-slides-item-button mb-1" onClick={ (e) => (window.location.href = '/checkout')}>Select</button>
            }
            {result && <>
            <div className="slider-slides-item-price">${result} per card</div>
            <div>Free Shipping</div>
            </>}
            {message && <div className="form-message-error">{message}</div>}
          </div>
        </div>
        <div className="slider-slides-dots">
          <div
          onClick={ (e) => goToSlide(e, 0) }
          className="slider-slides-dots-dot" 
          style={{
            background: slider.active == 0 ? '#003e5f' : '#E5E5E5',
          }}
          />
          <div
          onClick={ (e) => goToSlide(e, 1) }
          className="slider-slides-dots-dot" 
          style={{
            background: slider.active == 1 ? '#003e5f' : '#E5E5E5',
          }}
          />
          <div
          onClick={ (e) => goToSlide(e, 2) }
          className="slider-slides-dots-dot" 
          style={{
            background: slider.active == 2 ? '#003e5f' : '#E5E5E5',
          }}
          />
          <div
          onClick={ (e) => goToSlide(e, 3) }
          className="slider-slides-dots-dot" 
          style={{
            background: slider.active == 3 ? '#003e5f' : '#E5E5E5',
          }}
          />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    slider: state.slider
  }
}

const mapDispatchToProps = dispatch => {
  return {
    moveSlide: (width, iteration) => dispatch({type: "NEXT", width: width, active: iteration}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slider)
