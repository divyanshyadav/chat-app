import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { useAuth } from "../utils/auth";
import { post } from "../utils/api-client";
import styled from "styled-components";
import Loader from "../components/Loader";

const LoginPageContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-color: ${(props) => props.theme.dark};
	color: white;
`;

const LoginPage = () => {
	const authUtils = useAuth();
	const history = useHistory();
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);

	function redirect() {
		let { from } = location.state || { from: { pathname: "/" } };
		history.replace(from);
	}

	function onLoading() {
		setIsLoading(true);
	}

	if (isLoading) {
		return (
			<LoginPageContainer>
				<Loader />
			</LoginPageContainer>
		);
	}

	return (
		<LoginPageContainer>
			<div>
				<h1>Chat App...</h1>
				<GoogleLogin
					clientId={process.env.OAUTH_GOOGLE_CLIENT_ID}
					buttonText="Log in with Google"
					theme="dark"
					onRequest={onLoading}
					onSuccess={async (response) => {
						console.log(response);
						const user = await post(process.env.API_URL + "/users/login", {
							body: JSON.stringify(response),
						});

						console.log(user);
						authUtils.login(user);
						redirect();
					}}
					onFailure={(response) => {
						setItLoading(false);
						console.log("google login failed", response);
					}}
					cookiePolicy={"single_host_origin"}
				/>
			</div>
		</LoginPageContainer>
	);
};

export default LoginPage;
