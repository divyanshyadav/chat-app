import React, { useLayoutEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { useAuth } from "../utils/auth";
import { post } from "../utils/api-client";

const LoginPage = () => {
	const authUtils = useAuth();
	const history = useHistory();
	const location = useLocation();

	function redirect() {
		let { from } = location.state || { from: { pathname: "/" } };
		history.replace(from);
	}

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
				<GoogleLogin
					clientId={process.env.OAUTH_GOOGLE_CLIENT_ID}
					buttonText="Log in with Google"
					onSuccess={async (response) => {
						console.log(response);
						const user = await post(process.env.API_URL + "/users/login", {
							body: JSON.stringify(response),
						});

						authUtils.login(user);
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
