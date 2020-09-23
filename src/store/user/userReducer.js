import { loginType, logoutType } from './userActionsType'

const initState = {
	user: '',
	token: '',
}
function userReducer(state = initState, action) {
	switch (action.type) {
		case loginType:
			return {
				user: action.user,
				token: action.token,
			}
		case logoutType:
			return {
				user: '',
				token: ''
			}
		default:
			return state
	}
}

export default userReducer