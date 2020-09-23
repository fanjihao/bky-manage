import { loginType, logoutType } from './userActionsType'

export const loginAction = (user) => {
	return (
		{
			type: loginType,
			user: user.user,
			token: user.token
		}
	)

}
export const logoutAction = () => (
	function () {
		localStorage.removeItem("token")
		this.props.history.push({
			pathname: "/login",
		})
	}
)
