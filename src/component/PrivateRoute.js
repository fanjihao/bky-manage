// PrivateRoute.js
import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ Component, auth, path, ...otherProps }) => (
	<Route path={path} render={(props) => {
		return auth ? <Component {...props} {...otherProps} /> : <Redirect to={
			{
				pathname: '/login',
				state: { from: props.match.url }
			}
		} />
	}

	} />
)

export default PrivateRoute