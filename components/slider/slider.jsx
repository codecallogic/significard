import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';

const Slider = ({slider}) => {
  const dispatch = useDispatch()

  const goToSlide = (e, i) => {
    let el = document.querySelector('.slider-slides-item')
    i == 1 ? dispatch({type: "NEXT", width: (-el.offsetWidth + (el.offsetWidth/8)), active: i}) : null
    i == 0 ? dispatch({type: "NEXT", width: (el.offsetWidth - (el.offsetWidth/1.5)), active: i}) : null
  }
  
  return (
    <div className="slider">
      <div className="slider-slides">
        <div className="slider-slides-container"
         style={{
          transform: `translateX(${slider.translate}px)`
          }}
        >
          <div className="slider-slides-item">
            <div className="slider-slides-item-title">Standard</div>
            <div className="slider-slides-item-subtitle">Cards that you can recycle</div>
            <img src={`/media/package/standard.png`} alt="" className="slider-slides-item-image" />
            <div className="slider-slides-item-price">$8.99 /card</div>
            <div className="slider-slides-item-discount">15% discount for 10+ cards</div>
            <button className="slider-slides-item-button">Select</button>
            <div className="slider-slides-item-shipping">Free shipping</div>
          </div>
          <div className="slider-slides-item">
            <div className="slider-slides-item-title">Plantable</div>
            <div className="slider-slides-item-subtitle">Cards that you can plant</div>
            <img src={`/media/package/standard.png`} alt="" className="slider-slides-item-image" />
            <div className="slider-slides-item-price">$10.99 /card</div>
            <div className="slider-slides-item-discount">15% discount for 10+ cards</div>
            <button className="slider-slides-item-button">Select</button>
            <div className="slider-slides-item-shipping">Free shipping</div>
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

export default connect(mapStateToProps)(Slider)
