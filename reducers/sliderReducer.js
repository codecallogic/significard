const initialState = {
  translate: 50,
  active: 0
}

export const sliderReducer = (state = initialState, action) => {
  switch(action.type){
    case "NEXT":
      return {
        ...state,
        translate: action.width,
        active: action.active
      }
      break;
  
    default:
      return state
  }
}