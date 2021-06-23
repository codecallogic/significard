const initialState = {
  recipient: '',
  tags: []
}

export const recipientReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TAGS':
      return {
        ...state,
        tags: action.payload
      }
      break;
  
    default:
      return state
  }
}