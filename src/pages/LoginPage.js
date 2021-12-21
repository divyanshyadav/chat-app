import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../utils/auth";

const LoginPage = () => {
	const authUtils = useAuth();
	const history = useHistory();

	function handleSubmit(event) {
		event.preventDefault();
		const username = event.target.username.value;
		authUtils.login(username);

		redirect();
	}

	function redirect() {
		let { from } = location.state || { from: { pathname: "/" } };
		history.replace(from);
	}

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<label>
					<input type="text" name="username" placeholder="Username" />
				</label>
				<br />
				<input type="submit" value="Login" />
			</form>
		</div>
	);
};

export default LoginPage;
