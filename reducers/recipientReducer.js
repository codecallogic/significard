const initialState = {
  recipient: '',
  age: '',
  event: '',
  rank: [],
  tags: [],
  avoid: '',
  other: '',
  involvement: '',
  package: '',
  name: '',
  address_one: '',
  address_two: '',
  city: '',
  state: '',
  zip_code: '',
  nickname: '',
  message: '',
  signature: '',
  description: '',
  description_other: ''
}

export const recipientReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TAGS':
      return {
        ...state,
        tags: action.payload
      }
      break;
    case 'UPDATE_CHANGE':
      return {
        ...state,
        [action.name]: action.payload
      }
      break;
    
    case 'UPDATE_RANK':
      return {
        ...state,
        rank: [...state.rank, action.payload]
      }
      break;

    case 'REMOVE_RANK':
      let ranking = [...state.rank]

      let newRanking = ranking.filter( (item) => {
        if(item.style !== action.payload) return item
      })
      
      return {
        ...state,
        rank: [...newRanking]
      }
      break;
    
    case 'UPDATE_TEXTAREA':
      return {
        ...state,
        [action.name]: action.payload
      }
      break;
  
    default:
      return state
  }
}