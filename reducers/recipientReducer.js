const initialState = {
  recipient: '',
  recipient_other: '',
  recipient_name: '',
  age: '',
  event: '',
  event_other: '',
  card_arrival: '',
  rank: [],
  tags: [],
  avoid: '',
  other: '',
  involvement: '',
  package_plan: '',
  package_quantity: '',
  name: '',
  mail_to: '',
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
        tags: action.value
      }
      break;

    case 'UPDATE_TAGS_QUIZ':
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

    case 'RESET_MAIL':
      return {
        ...state,
        name: '',
        address_one: '',
        address_two: '',
        city: '',
        state: '',
        zip_code: '',
      }
      break;
    
    case 'UPDATE_RANK':
      return {
        ...state,
        rank: [...state.rank, action.payload]
      }
      break;

    case 'RESET_RANK':
      return {
        ...state,
        rank: []
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
    
    case 'SORT_RANK':
      let sortRank = [...state.rank]

      let newSortedRanking = sortRank.sort((a, b) => a.rank > b.rank)
      
      return {
        ...state,
        rank: [...newSortedRanking]
      }
        break;
    
    case 'UPDATE_TEXTAREA':
      return {
        ...state,
        [action.name]: action.payload
      }
      break;

    case 'EDIT_RECIPIENT':
      return {
        ...state,
        [action.name]: action.value
      }
    
    case 'INITIAL_STATE_RECIPIENT':
      return initialState
  
    default:
      return state
  }
}