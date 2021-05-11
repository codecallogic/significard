const initialState = {
  nav: 'logins',
  userName: null,
  userEmail: null
}

export const userReducer = (state = initialState, action) => {
  switch(action.type){
    case "USER":
      return {
        ...state,
        userName: action.payload.userName
      }
    
    default: 
      return state
  }
}