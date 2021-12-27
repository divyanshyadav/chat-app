import React, { useEffect } from "react";
import { useAuth } from "../utils/auth";
import socket from "../utils/socket";
import Header from "../components/Header";
import SideBar from "../components/Sidebar";
import Chat from "../components/Chat";
import { beep } from "../utils/sound";
import { get } from "../utils/api-client";

export default function Dashboard() {
	const { user, logout } = useAuth();
	const [users, setUsers] = React.useState([]);
	const [selectedUserId, setSelectedUserId] = React.useState(null);
	const [conversation, setConversation] = React.useState({});
	const [loading, setLoading] = React.useState(true);

	function addMessage(message, userId) {
		setConversation((conversation) => {
			return {
				...conversation,
				[userId]: [...(conversation[userId] || []), message],
			};
		});
	}

	function updateMessage(message, userId) {
		setConversation((conversation) => {
			return {
				...conversation,
				[userId]: [
					...(conversation[userId].map((m) => {
						if (m.id === message.id) {
							return { ...m, ...message };
						}
						return m;
					}) || []),
				],
			};
		});
	}

	useEffect(async () => {
		const users = await get(process.env.API_URL + "/users");
		setUsers(users.filter((u) => u.id !== user.id));

		const conversations = await get(
			process.env.API_URL + "/users/conversations/" + user.id
		);
		setConversation(conversations);
		setLoading(false);
	}, []);

	useEffect(() => {
		if (loading) return;

		socket.auth = user;
		socket.connect();
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
			if (message.from !== selectedUserId) {
				setUsers((users) => {
					return users.map((u) =>
						u.id === message.from && message.from !== selectedUserId
							? { ...u, newMessages: (u.newMessages || 0) + 1 }
							: u
					);
				});
			} else {
				message.seenByUser = true;
			}

			if (document.visibilityState === "hidden") {
				beep();
			}

			message.reachedToUser = true;
			addMessage(message, message.from);
			socket.emit("private message reached to user", message);
		});

		socket.on("update private message", (message) => {
			addMessage(message, message.to);
		});

		socket.on("private message reached to user", (message) => {
			updateMessage(message, message.to);
		});

		socket.on("update private message reached to user", (message) => {
			updateMessage(message, message.from);
		});

		socket.on("user disconnected", (user) => {
			setUsers((users) =>
				users.map((u) => (u.id === user.id ? { ...u, status: "offline" } : u))
			);
		});

		socket.on("message seen by user", (message) => {
			updateMessage(message, message.to);
		});

		socket.on("update message seen by user", (message) => {
			updateMessage(message, message.from);
		});

		const messages = conversation[selectedUserId] || [];
		messages
			.filter((m) => m.from === selectedUserId)
			.forEach((m) => {
				if (m.seenByUser !== undefined && m.seenByUser === false) {
					socket.emit("message seen by user", m);
				}
			});

		return () => {
			socket.removeAllListeners();
			// socket.disconnect();
		};
	}, [user, loading, selectedUserId]);

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
								toUser: users.find((u) => u.id === selectedUserId),
								from: user.id,
								fromUser: user,
								reachedToServer: false,
								reachedToUser: false,
								seenByUser: false,
							};

							addMessage(message, message.to);
							socket.emit("private message", message, (msg) => {
								updateMessage(msg, msg.to);
							});
						}}
					/>
				)}
			</div>
		</div>
	);
}
