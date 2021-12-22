import React from "react";

export default function Header({ user, onClickLogout }) {
	return (
		<div
			style={{
				height: "50px",
				display: "flex",
				alignItems: "center",
				background: "lightgray",
				justifyContent: "space-between",
			}}
		>
			<div>Welcome, {user.username}</div>
			<div>
				<button onClick={onClickLogout}>Logout</button>
			</div>
		</div>
	);
}
