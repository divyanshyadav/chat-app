import React from "react";
import { GoogleLogout } from "react-google-login";

export default function Header({ user, onClickLogout }) {
	return (
		<div
			style={{
				height: "50px",
				display: "flex",
				alignItems: "center",
				background: "darkmagenta",
				justifyContent: "space-between",
				color: "white",
				padding: "0 10px",
			}}
		>
			<div>Welcome, {user.username}</div>
			<div>
				<GoogleLogout
					clientId="585465649224-854158sjuc6d3ujpaei0c5vdb51odpbr.apps.googleusercontent.com"
					buttonText="Logout"
					onLogoutSuccess={(res) => {
						console.log(res);
						onClickLogout();
					}}
				></GoogleLogout>
				{/* <button onClick={onClickLogout}>Logout</button> */}
			</div>
		</div>
	);
}
