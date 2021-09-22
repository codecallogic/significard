import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';
import { useSwipeable } from 'react-swipeable';

const Slider = ({slider}) => {
  const dispatch = useDispatch()

  const goToSlide = (e, i) => {
    let el = document.querySelector('.homepage_slider-slides-item')
    i == 1 ? dispatch({type: "NEXT", width: (-el.offsetWidth + (el.offsetWidth/8)), active: i}) : null
    i == 0 ? dispatch({type: "NEXT", width: (el.offsetWidth - (el.offsetWidth/1.5)), active: i}) : null
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      let el = document.querySelector('.homepage_slider-slides-item')
      dispatch({type: "NEXT", width: (-el.offsetWidth + (el.offsetWidth/8)), active: 1})
    },
    onSwipedRight: () => {
      let el = document.querySelector('.homepage_slider-slides-item')
      console.log(el.offsetWidth)
      console.log(el.offsetWidth/1.5)
      dispatch({type: "NEXT", width: slider.translate + 50, active: 0})
    }
  });
  
  return (
    <div className="homepage_slider">
      <div className="homepage_slider-slides-main">
        <img src="/media/homepage/slider_main_1.png" alt="" className="homepage_slider-slides-main-image" />
      </div>
      <div className="homepage_slider-slides">
        <div className="homepage_slider-slides-container"
         style={{
          transform: `translateX(${slider.translate}px)`
          }}
         {...handlers}
        >
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_1.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_2.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_3.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_4.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_5.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_6.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_7.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_8.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_9.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_10.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_11.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item">
            <img className="homepage_slider-slides-item-image" src="/media/homepage/slider_12.png" alt="" />
          </div>
        </div>
        {/* <div className="homepage_slider-slides-dots">
          <div
          onClick={ (e) => goToSlide(e, 0) }
          className="homepage_slider-slides-dots-dot" 
          style={{
            background: slider.active == 0 ? '#003e5f' : '#E5E5E5',
          }}
          />
          <div
          onClick={ (e) => goToSlide(e, 1) }
          className="homepage_slider-slides-dots-dot" 
          style={{
            background: slider.active == 1 ? '#003e5f' : '#E5E5E5',
          }}
          />
        </div> */}
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
