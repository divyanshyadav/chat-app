import React, { useEffect, useLayoutEffect } from "react";
import { useAuth } from "../utils/auth";
import socket from "../utils/socket";
import Header from "../components/Header";
import SideBar from "../components/Sidebar";
import Chat from "../components/Chat";

export default function Dashboard() {
	const { user, logout } = useAuth();
	const [users, setUsers] = React.useState([]);
	const [selectedUserId, setSelectedUserId] = React.useState(null);
	const [conversation, setConversation] = React.useState({});

	function addMessage(message, userId) {
		setConversation((conversation) => {
			return {
				...conversation,
				[userId]: [...(conversation[userId] || []), message],
			};
		});
	}

	useEffect(() => {
		socket.auth = user;
		socket.connect();
		socket.on("users", (users) =>
			setUsers(users.filter((u) => u.id !== user.id))
		);

		socket.on("conversations", (conversations) => {
			setConversation(conversations);
		});

		socket.on("user connected", (newUser) => {
			setUsers((users) => {
				if (user.id === newUser.id) {
					return users;
				}

				if (users.find((u) => u.id === newUser.id)) {
					return users;
				}

				return [...users, newUser];
			});
		});

		socket.on("private message", (message) => {
			addMessage(message, message.from);
		});

		socket.on("same private message", (message) => {
			addMessage(message, message.to);
		});

		socket.on("user disconnected", (user) => {
			setUsers((users) => users.filter((u) => u.id !== user.id));
		});

		return () => {
			socket.emit("user disconnected", user);
			socket.disconnect();
		};
	}, [user]);

	return (
		<div
			style={{
				height: "100%",
			}}
		>
			<Header user={user} onClickLogout={logout} />
			<div
				style={{
					display: "flex",
					height: "calc(100% - 50px)",
				}}
			>
				<SideBar
					users={users}
					selectedUserId={selectedUserId}
					onSelectUser={(userId) => setSelectedUserId(userId)}
				/>
				{selectedUserId && (
					<Chat
						userId={user.id}
						messages={conversation[selectedUserId] || []}
						onSendMessage={(text) => {
							const message = {
								id: Math.random().toString(),
								text,
								to: selectedUserId,
								from: user.id,
								toName: users.find((u) => u.id === selectedUserId).username,
								fromName: user.username,
							};

							// addMessage(message, selectedUserId);
							socket.emit("private message", message, () => {
								addMessage(message, message.to);
							});
						}}
					/>
				)}
			</div>
		</div>
	);
}
