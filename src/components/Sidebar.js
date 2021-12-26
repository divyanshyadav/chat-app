import React from "react";
import UserImage from "./UserImage";

export default function SideBar({ users, onSelectUser, selectedUserId }) {
	function handleSelectUser(userId) {
		onSelectUser(userId);
	}

	return (
		<div
			style={{
				height: "100%",
				background: "#400039",
				flexGrow: "3",
				maxWidth: "250px",
			}}
		>
			{users.map((user) => (
				<div
					style={{
						background: selectedUserId === user.id ? "darkmagenta" : "",
						padding: "10px",
						color: "white",
						cursor: "pointer",
						fontSize: "18px",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
					key={user.id}
					onClick={() => handleSelectUser(user.id)}
				>
					<UserImage url={user.imageUrl} />
					<div>
						<div>
							{user.username}{" "}
							{user.newMessages ? (
								<span
									style={{
										display: "inline-block",
										background: "red",
										color: "white",
										borderRadius: "50%",
										height: "20px",
										width: "20px",
										textAlign: "center",
									}}
								>
									{user.newMessages}
								</span>
							) : null}
						</div>
						<div
							style={{
								fontSize: "12px",
							}}
						>
							{user.status === "online" ? "🟢" : "🟠"} {user.status}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
