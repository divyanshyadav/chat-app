import React from "react";
import { GoogleLogout } from "react-google-login";
import styled from "styled-components";

const HeaderContainer = styled.div`
	height: 50px;
	display: flex;
	align-items: center;
	background: ${(props) => props.theme.primary};
	justify-content: space-between;
	color: white;
	padding: 0 10px;
`;

export default function Header({ user, onClickLogout }) {
	return (
		<HeaderContainer>
			<div>Welcome, {user.username}</div>
			<div>
				<GoogleLogout
					clientId={process.env.OAUTH_GOOGLE_CLIENT_ID}
					buttonText="Logout"
					onLogoutSuccess={(res) => {
						console.log(res);
						onClickLogout();
					}}
					theme="dark"
				></GoogleLogout>
			</div>
		</HeaderContainer>
	);
}
