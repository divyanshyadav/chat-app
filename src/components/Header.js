import React from "react";

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
				<button onClick={onClickLogout}>Logout</button>
			</div>
		</div>
	);
}
