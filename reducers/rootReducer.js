import {combineReducers} from 'redux'
import {userReducer} from './userReducer'
import {recipientReducer} from './recipientReducer'
import {sliderReducer} from './sliderReducer'
import {cardReducer} from './cardReducer'

const rootReducer = combineReducers({
  user: userReducer,
  recipient: recipientReducer,
  slider: sliderReducer,
  card: cardReducer
})

export default rootReducer