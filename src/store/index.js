import { createStore, combineReducers, applyMiddleware } from 'redux'
import userReducer from './user/userReducer'
import thunk from 'redux-thunk'

const mainReducer = combineReducers({
    userReducer,
})

const store = createStore(
    mainReducer,
    applyMiddleware(thunk),
)

export default store