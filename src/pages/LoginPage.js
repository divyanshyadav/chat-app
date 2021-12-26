import React, { useLayoutEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { useAuth } from "../utils/auth";

const LoginPage = () => {
	const authUtils = useAuth();
	const history = useHistory();
	const location = useLocation();
	// const usernameInput = React.useRef(null);

	// function handleSubmit(event) {
	// 	event.preventDefault();
	// 	const username = event.target.username.value;
	// 	authUtils.login(username);

	// 	redirect();
	// }

	function redirect() {
		let { from } = location.state || { from: { pathname: "/" } };
		history.replace(from);
	}

	// useLayoutEffect(() => {
	// 	usernameInput.current.focus();
	// });

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
			}}
		>
			<div>
				<h1>Chat App...</h1>
				{/* <form onSubmit={handleSubmit}>
					<label htmlFor="username">
						<input
							ref={usernameInput}
							type="text"
							name="username"
							placeholder="Username"
						/>
					</label>
					<input type="submit" value="Join" />
				</form> */}
				<GoogleLogin
					clientId={process.env.OAUTH_GOOGLE_CLIENT_ID}
					buttonText="Log in with Google"
					onSuccess={(response) => {
						console.log("google login succeed", response);
						authUtils.login(response.profileObj);

						redirect();
					}}
					onFailure={(response) => {
						console.log("google login failed", response);
					}}
					cookiePolicy={"single_host_origin"}
				/>
			</div>
		</div>
	);
};

export default LoginPage;
