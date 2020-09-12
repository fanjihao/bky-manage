import { loginType, logoutType } from './userActionsType'

const initState = {
	username: '',
	token: '',
	checkedList: JSON.parse(sessionStorage.getItem('checkedList')) || [],
}
function userReducer(state = initState, action) {
	switch (action.type) {
		case loginType:
			console.log(action.checkedList, 'checkedList')
			return {
				username: action.username,
				token: action.token,
				checkedList: action.checkedList
			}
		case logoutType:
			return {
				username: '',
				token: ''
			}
		default:
			return state
	}
}

export default userReducer