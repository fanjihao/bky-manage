import React from 'react';
import './App.css';
import { Route, Redirect } from 'react-router-dom'
import PrivateRoute from '../component/PrivateRoute'
import { connect } from 'react-redux'
import Home from '../views/home/Home'
import Login from '../views/login/Login'

function App(props) {
	// const token=localStorage.getItem('token')
	const token = 'dasdasda'
	return (
		<div className="App">
			<Redirect from="/" exact to="/home" />
			<PrivateRoute path="/home" Component={Home} auth={token} />
			<Route path="/login" component={Login} />
		</div>
	);
}

function mapStateToProps(state) {
	const userReducer = state.userReducer
	return {
		token: userReducer.token
	}
}

export default connect(mapStateToProps)(App)
