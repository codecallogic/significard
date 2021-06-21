import {combineReducers} from 'redux'
import {userReducer} from './userReducer'
import {recipientReducer} from './recipientReducer'
import {sliderReducer} from './sliderReducer'

const rootReducer = combineReducers({
  user: userReducer,
  recipient: recipientReducer,
  slider: sliderReducer
})

export default rootReducer