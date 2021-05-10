const initialState = {
  nav: 'logins',
  userName: 'dummyName',
  userEmail: 'dummyEmail'
}

export const userReducer = (state = initialState, action) => {
  switch(action.type){
    case "USER":
      return {
        ...state,
        userName: action.payload.displayName
      }
    
    default: 
      return state
  }
}