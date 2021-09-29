const initialState = {
  event: '',
  event_other: '',
  card_arrival: '',
  tags: [],
  nickname: '',
  message: '',
  message_later: '',
  signature: '',
}

export const cardReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CARD_TAGS':
      return {
        ...state,
        tags: action.value
      }
      break;

    case 'EDIT_CARD':
      return {
        ...state,
        [action.name]: action.value
      }
    
    case 'INITIAL_STATE':
      return initialState
  
    default:
      return state
  }
}