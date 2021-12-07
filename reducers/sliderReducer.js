const initialState = {
  translate: 0,
  active: 0
}

export const sliderReducer = (state = initialState, action) => {
  switch(action.type){
    case 'INIT': 
      return {
        ...state,
        translate: action.width,
      }
      break;

    case "NEXT":

      return {
        ...state,
        translate: action.width,
        active: action.active
      }
      break;

    case "NEXT_HOMEPAGE_SLIDER":
      let translateX = action.width
      if(action.width < -700){
        translateX = -700
      }else if(action.width >= 480){
        translateX = 480
      }else{
        translateX = action.width
      }
     
      
      return {
        ...state,
        translate: translateX,
      }
      break;
  
    default:
      return state
  }
}