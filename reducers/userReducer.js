const initialState = {
  nav: 'logins',
  userName: null,
  userEmail: null,
  message: null
}

export const userReducer = (state = initialState, action) => {
  console.log(action)
  switch(action.type){
    case "USER":
      return {
        ...state,
        userName: action.payload.userName
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