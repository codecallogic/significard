import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';
import { useSwipeable } from 'react-swipeable';

const Slider = ({slider, quizProgressNav, handleChange, result, setresult, calculate, validateisnumber, quizstate, moveSlide}) => {
  const dispatch = useDispatch()

  const goToSlide = (e, i) => {
    let el = document.querySelectorAll('.slider-slides-item')
    if(i == 0) moveSlide(el[i].offsetWidth - 60, i)
    if(i == 1) moveSlide(-el[i].offsetWidth, i)
    if(i == 2) moveSlide(-el[i].offsetWidth*i, i)
    if(i == 3) moveSlide(-el[i].offsetWidth*i, i)
    // i == 2 ? dispatch({type: "NEXT", width: (-el.offsetWidth + (el.offsetWidth/1)), active: i}) : null
    // i == 1 ? dispatch({type: "NEXT", width: (-el.offsetWidth + (el.offsetWidth/8)), active: i}) : null
    // i == 0 ? dispatch({type: "NEXT", width: (el.offsetWidth - (el.offsetWidth/1.5)), active: i}) : null
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      let el = document.querySelector('.slider-slides-item')
      dispatch({type: "NEXT", width: (-el.offsetWidth + (el.offsetWidth/8)), active: 1})
    },
    onSwipedRight: () => {
      let el = document.querySelector('.slider-slides-item')
      dispatch({type: "NEXT", width: (el.offsetWidth - (el.offsetWidth/1.5)), active: 0})
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
            <div className="slider-slides-item-title">Best Deal</div>
            <div className="slider-slides-item-subtitle">You get 20 cards</div>
            <img src={`/media/package/standard.png`} alt="" className="slider-slides-item-image" />
            <div className="slider-slides-item-price">$6.99 per card</div>
            {/* <div className="slider-slides-item-discount">15% discount for 10+ cards</div> */}
            <button className="slider-slides-item-button" onClick={ (e) => (quizProgressNav(e,'mail'), handleChange('package_plan', e, null, 'best_deal', 20))}>Select</button>
            <div className="slider-slides-item-shipping">Free shipping</div>
          </div>
          <div className="slider-slides-item">
            <div className="slider-slides-item-title">Better Deal</div>
            <div className="slider-slides-item-subtitle">You get 10 cards</div>
            <img src={`/media/package/standard.png`} alt="" className="slider-slides-item-image" />
            <div className="slider-slides-item-price">$9.99 per card</div>
            {/* <div className="slider-slides-item-discount">15% discount for 10+ cards</div> */}
            <button className="slider-slides-item-button" onClick={ (e) => (quizProgressNav(e,'mail'), handleChange('package_plan', e, null, 'better_deal', 10))}>Select</button>
            <div className="slider-slides-item-shipping">Free shipping</div>
          </div>
          <div className="slider-slides-item">
            <div className="slider-slides-item-title">Good Deal</div>
            <div className="slider-slides-item-subtitle">You get 5 cards</div>
            <img src={`/media/package/standard.png`} alt="" className="slider-slides-item-image" />
            <div className="slider-slides-item-price">$11.99 per card</div>
            {/* <div className="slider-slides-item-discount">15% discount for 10+ cards</div> */}
            <button className="slider-slides-item-button" onClick={ (e) => (quizProgressNav(e,'mail'), handleChange('package_plan', e, null, 'good_deal', 5))}>Select</button>
            <div className="slider-slides-item-shipping">Free shipping</div>
          </div>
          <div className="slider-slides-item">
            <div className="slider-slides-item-title">Customize It</div>
            <div className="slider-slides-item-subtitle">Enter the number of cards you want</div>
            <div className="slider-slides-item-input">
              <input id="custom_quantity" type="text" value={quizstate.package_quantity} placeholder="Number of Cards" onChange={(e) => (setresult(''), validateisnumber('custom_quantity'), handleChange('package_plan', e, null, 'custom', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Number of Cards'} onKeyDown={(e) => {
              if (e.code === "Enter") {
                calculate()
              }
            }}/>
            </div>
            {!result && <button className="slider-slides-item-button mb-1" onClick={ () => (calculate())}>Calculate</button>
            }
            {result && <button className="slider-slides-item-button mb-1" onClick={ (e) => (quizProgressNav(e,'mail'))}>Select</button>
            }
            {result && <>
            <div className="slider-slides-item-price">${result} per card</div>
            <div>Free Shipping</div>
            </>}
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
