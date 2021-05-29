import {combineReducers} from 'redux'
import {userReducer} from './userReducer'
import {recipientReducer} from './recipientReducer'

const rootReducer = combineReducers({
  user: userReducer,
  recipient: recipientReducer
})

export default rootReducer