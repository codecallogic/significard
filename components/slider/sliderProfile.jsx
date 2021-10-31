import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';
import { useSwipeable } from 'react-swipeable';

const Slider = ({slider, result, setresult, calculate, validateisnumber, quantity, setQuantity, moveSlide, message, setMessage, setPlanQuantity, setUpdatePlan, setPlanPrice, setSubscription, setModal}) => {
  const dispatch = useDispatch()
  const [swipe, setSwipe] = useState(0)

  const goToSlide = (e, i) => {
    let el = document.querySelectorAll('.slider-profile-slides-item')
    if(i == 0) moveSlide(300 + el[i].offsetWidth - 140, i)
    if(i == 1) moveSlide(300 + -el[i].offsetWidth, i)
    if(i == 2) moveSlide(300 + -el[i].offsetWidth*i, i)
    if(i == 3) moveSlide(300 + -el[i].offsetWidth*i, i)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipe(swipe == 3 ? swipe : swipe + 1)
      let el = document.querySelectorAll('.slider-profile-slides-item')
      if(swipe + 1 == 1) moveSlide(300 + -el[swipe + 1].offsetWidth, swipe + 1)
      if(swipe + 1 == 2) moveSlide(300 + -el[swipe + 1].offsetWidth*2, swipe + 1)
      if(swipe + 1 == 3) moveSlide(300 + -el[swipe + 1].offsetWidth*3, swipe + 1)
    },
    onSwipedRight: () => {
      setSwipe(swipe == 0 ? swipe : swipe - 1)
      let el = document.querySelectorAll('.slider-profile-slides-item')
      if(swipe - 1 == 0) moveSlide(300 + el[0].offsetWidth - 140, 0)
      if(swipe - 1 == 1) moveSlide(300 + -el[swipe - 1].offsetWidth, swipe - 1)
      if(swipe - 1 == 2) moveSlide(300 + -el[swipe - 1].offsetWidth*2, swipe -1)
    }
  });

  useEffect(() => {
    moveSlide(400, 0)
  }, [])
  
  return (
    <div className="slider-profile">
      <div className="slider-profile-slides">
        <div className="slider-profile-slides-container"
         style={{
          transform: `translateX(${slider.translate}px)`
          }}
         {...handlers}
        >
          <div className="slider-profile-slides-item">
            <div className="slider-profile-slides-item-title">Best Deal</div>
            <div className="slider-profile-slides-item-subtitle">You get 20 cards</div>
            <img src={`/media/package/standard.png`} alt="" className="slider-profile-slides-item-image" />
            <div className="slider-profile-slides-item-price">$6.99 per card</div>
            {/* <div className="slider-profile-slides-item-discount">15% discount for 10+ cards</div> */}
            <button className="slider-profile-slides-item-button" onClick={ (e) => (setPlanQuantity(20), setUpdatePlan('best deal'), setPlanPrice(6.99), setSubscription('price_1Jq0qpAFcPAVZmVLF41sZGrG'), setModal('checkout'))}>Select</button>
            <div className="slider-profile-slides-item-shipping">Free shipping</div>
          </div>
          <div className="slider-profile-slides-item">
            <div className="slider-profile-slides-item-title">Better Deal</div>
            <div className="slider-profile-slides-item-subtitle">You get 10 cards</div>
            <img src={`/media/package/standard.png`} alt="" className="slider-profile-slides-item-image" />
            <div className="slider-profile-slides-item-price">$9.99 per card</div>
            {/* <div className="slider-profile-slides-item-discount">15% discount for 10+ cards</div> */}
            <button className="slider-profile-slides-item-button" onClick={ (e) => (setPlanQuantity(10), setUpdatePlan('better deal'), setPlanPrice(9.99), setSubscription('price_1Jq0orAFcPAVZmVLvZNwmwWP'), setModal('checkout'))}>Select</button>
            <div className="slider-profile-slides-item-shipping">Free shipping</div>
          </div>
          <div className="slider-profile-slides-item">
            <div className="slider-profile-slides-item-title">Good Deal</div>
            <div className="slider-profile-slides-item-subtitle">You get 5 cards</div>
            <img src={`/media/package/standard.png`} alt="" className="slider-profile-slides-item-image" />
            <div className="slider-profile-slides-item-price">$11.99 per card</div>
            {/* <div className="slider-profile-slides-item-discount">15% discount for 10+ cards</div> */}
            <button className="slider-profile-slides-item-button" onClick={ (e) => (setPlanQuantity(5), setUpdatePlan('good deal'), setPlanPrice(11.99), setSubscription('price_1Jq0oBAFcPAVZmVLtLUI1icZ'), setModal('checkout'))}>Select</button>
            <div className="slider-profile-slides-item-shipping">Free shipping</div>
          </div>
          <div className="slider-profile-slides-item">
            <div className="slider-profile-slides-item-title">Customize It</div>
            <div className="slider-profile-slides-item-subtitle">Enter the number of cards you want</div>
            <div className="slider-profile-slides-item-input">
              <input id="custom_quantity" type="text" value={quantity} placeholder="Number of Cards" onChange={(e) => (setresult(''), validateisnumber('custom_quantity'), setQuantity(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Number of Cards'} onKeyDown={(e) => {
              if (e.code === "Enter") {
                calculate()
              }
            }}/>
            </div>
            {!result && <button className="slider-profile-slides-item-button mb-1" onClick={ () => (calculate())}>Calculate</button>
            }
            {result && <button className="slider-profile-slides-item-button mb-1" onClick={ (e) =>  setModal('checkout')}>Select</button>
            }
            {result && <>
            <div className="slider-profile-slides-item-price">${result} per card</div>
            <div>Free Shipping</div>
            </>}
            {message && <div className="form-message-error">{message}</div>}
          </div>
        </div>
        <div className="slider-profile-slides-dots">
          <div
          onClick={ (e) => goToSlide(e, 0) }
          className="slider-profile-slides-dots-dot" 
          style={{
            background: slider.active == 0 ? '#003e5f' : '#E5E5E5',
          }}
          />
          <div
          onClick={ (e) => goToSlide(e, 1) }
          className="slider-profile-slides-dots-dot" 
          style={{
            background: slider.active == 1 ? '#003e5f' : '#E5E5E5',
          }}
          />
          <div
          onClick={ (e) => goToSlide(e, 2) }
          className="slider-profile-slides-dots-dot" 
          style={{
            background: slider.active == 2 ? '#003e5f' : '#E5E5E5',
          }}
          />
          <div
          onClick={ (e) => goToSlide(e, 3) }
          className="slider-profile-slides-dots-dot" 
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
