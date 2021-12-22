import React from "react";

export default function SideBar({ users, onSelectUser, selectedUserId }) {
	function handleSelectUser(userId) {
		onSelectUser(userId);
	}

	return (
		<div
			style={{
				height: "100%",
				background: "lightblue",
				flexGrow: "2",
				maxWidth: "250px",
			}}
		>
			<strong>Online Users</strong>
			{users.map((user) => (
				<div
					style={{
						background: selectedUserId === user.id ? "lightgreen" : "",
					}}
					key={user.id}
					onClick={() => handleSelectUser(user.id)}
				>
					{user.username}
				</div>
			))}
		</div>
	);
}
