import React, { useEffect } from "react";
import { useAuth } from "../utils/auth";
import socket from "../utils/socket";
import Header from "../components/Header";
import SideBar from "../components/Sidebar";
import Chat from "../components/Chat";
import { beep } from "../utils/sound";

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
				if (user.id === newUser.id || users.find((u) => u.id === newUser.id)) {
					return users.map((u) => {
						if (u.id === newUser.id) {
							return { ...u, status: "online" };
						}
						return u;
					});
				}

				return [...users, newUser];
			});
		});

		socket.on("private message", (message) => {
			setUsers((users) => {
				return users.map((u) =>
					u.id === message.from && message.from !== selectedUserId
						? { ...u, newMessages: (u.newMessages || 0) + 1 }
						: u
				);
			});

			if (document.visibilityState === "hidden") {
				beep();
			}

			addMessage(message, message.from);
		});

		socket.on("same private message", (message) => {
			addMessage(message, message.to);
		});

		socket.on("user disconnected", (user) => {
			setUsers((users) =>
				users.map((u) => (u.id === user.id ? { ...u, status: "offline" } : u))
			);
		});

		return () => {
			socket.removeAllListeners();
			socket.disconnect();
		};
	}, [user, selectedUserId]);

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
					onSelectUser={(userId) => {
						setSelectedUserId(userId);
						setUsers((users) =>
							users.map((u) => (u.id === userId ? { ...u, newMessages: 0 } : u))
						);
					}}
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
								toName: users.find((u) => u.id === selectedUserId).username,
								toImageUrl: users.find((u) => u.id === selectedUserId).imageUrl,
								from: user.id,
								fromName: user.username,
								fromImageUrl: user.imageUrl,
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
