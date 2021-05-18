const initialState = {
  nav: 'logins',
  userName: null,
  userEmail: null,
  message: null
}

export const userReducer = (state = initialState, action) => {
  switch(action.type){
    case "USER":
      return {
        ...state,
        userName: action.payload.username
      }
    
    case "EMAIL":
      return {
        ...state,
        userName: action.payload.email
      }

    case "MESSAGE":
      return {
        ...state,
        message: action.payload
      }
    
    default: 
      return state
  }
}