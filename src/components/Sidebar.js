import React from "react";
import UserImage from "./UserImage";
import styled from "styled-components";

const SideBarWrapper = styled.div`
	height: 100%;
	background: #400039;
	flex-grow: 3;
	max-width: 250px;
	overflow-y: auto;

	/* @media (max-width: 375px) {
		position: fixed;
		max-width: 10px;
	} */
`;

export default function SideBar({ users, onSelectUser, selectedUserId }) {
	function handleSelectUser(userId) {
		onSelectUser(userId);
	}

	return (
		<SideBarWrapper>
			{users.map((user) => (
				<SideBarItem
					key={user.id}
					user={user}
					onClick={handleSelectUser}
					selectedUserId={selectedUserId}
				/>
			))}
		</SideBarWrapper>
	);
}

function SideBarItem({ user, onClick, selectedUserId }) {
	return (
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
			onClick={() => onClick(user.id)}
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
	);
}
