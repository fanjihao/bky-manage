import { loginType } from './userActionsType'

export const loginAction = (user) => {
	return (
		{
			type: loginType,
			user: user.user,
			token: user.token
		}
	)

}
