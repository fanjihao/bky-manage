import { loginType, logoutType } from './userActionsType'

export const loginAction = (user, checkedList) => {
	sessionStorage.setItem('checkedList', JSON.stringify(checkedList))

	return (
		{
			type: loginType,
			username: user.username,
			token: user.token,
			checkedList
		}
	)

}

export const loginActionSync = function (user, history, checkedList) {
	return function (dispatch) {
		setTimeout(() => {
			console.log(history, 'actionHistory')
			dispatch(loginAction(user, checkedList))
			history.push('/home')
		}, 200)
	}
}

export const logoutAction = () => (
	function () {
		localStorage.removeItem("token")
		this.props.history.push({
			pathname: "/login",
		})
	}
)
