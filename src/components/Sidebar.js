import React from "react";
import UserImage from "./UserImage";
import styled from "styled-components";
import Loader from "./Loader";

const SideBarWrapper = styled.div`
	height: 100%;
	background: ${(props) => props.theme.secondary};
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

const SideBarItemContainer = styled.div`
	background: ${(props) =>
		props.selected ? props.theme.primary : props.theme.secondary};
	padding: 10px;
	color: white;
	cursor: pointer;
	font-size: 18px;
	display: flex;
	flex-direction: row;
	align-items: center;

	&:hover {
		background: ${(props) =>
			props.selected ? props.theme.primary : props.theme.light};
	}
`;

function SideBarItem({ user, onClick, selectedUserId }) {
	return (
		<SideBarItemContainer
			selected={selectedUserId === user.id}
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
				<UserOnlineStatus status={user.status} lastSeen={user.lastSeen} />
			</div>
		</SideBarItemContainer>
	);
}

function UserOnlineStatus({ status, lastSeen }) {
	let text = "";

	if (status === "online") {
		text = "🟢 Online";
	} else if (status === "offline" && lastSeen) {
		text = "Last seen at " + new Date(lastSeen).toLocaleString();
	} else {
		text = "🔴 Offline";
	}

	return (
		<div
			style={{
				fontSize: "10px",
			}}
		>
			{text}
		</div>
	);
}
