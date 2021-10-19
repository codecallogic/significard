import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import { useDispatch } from 'react-redux';
import { useSwipeable } from 'react-swipeable';

const Slider = ({slider}) => {
  // console.log(slider.translate)
  const dispatch = useDispatch()
  const [currentImage, setCurrentImage] = useState('carousel_1.jpeg')

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      let el = document.querySelector('.homepage_slider-slides-item')
      dispatch({type: "NEXT_HOMEPAGE_SLIDER", width: slider.translate - 120})
    },
    onSwipedRight: () => {
      let el = document.querySelector('.homepage_slider-slides-item')
      dispatch({type: "NEXT_HOMEPAGE_SLIDER", width: slider.translate + 120})
    }
  });
  
  return (
    <div className="homepage_slider">
      <div className="homepage_slider-slides-main">
        <img src={`/media/homepage/${currentImage}`} alt="" className="homepage_slider-slides-main-image" />
      </div>
      <div className="homepage_slider-slides">
        <div className="homepage_slider-slides-container"
         style={{
          transform: `translateX(${slider.translate}px)`
          }}
         {...handlers}
        >
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_1.jpeg')}>
            <img className="homepage_slider-slides-item-image" src={`/media/homepage/carousel_1.jpeg`} alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_2.jpeg')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_2.jpeg" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_3.jpeg')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_3.jpeg" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_4.jpeg')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_4.jpeg" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_5.png')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_5.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_6.png')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_6.png" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_7.jpeg')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_7.jpeg" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_8.jpeg')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_8.jpeg" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_9.jpeg')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_9.jpeg" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_10.jpeg')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_10.jpeg" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_11.jpeg')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_11.jpeg" alt="" />
          </div>
          <div className="homepage_slider-slides-item" onClick={() => setCurrentImage('carousel_12.png')}>
            <img className="homepage_slider-slides-item-image" src="/media/homepage/carousel_12.png" alt="" />
          </div>
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
