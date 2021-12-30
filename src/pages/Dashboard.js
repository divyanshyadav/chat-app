import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../utils/auth";
import useSocket from "../utils/socket";
import Header from "../components/Header";
import SideBar from "../components/Sidebar";
import Chat from "../components/Chat";
import { beep } from "../utils/sound";
import { get } from "../utils/api-client";
import { deepMerge } from "../utils/object";

export default function Dashboard() {
	const { user, logout } = useAuth();
	const socket = useSocket(user);
	const [users, setUsers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [conversation, setConversation] = useState({});

	const addMessage = useCallback(
		(message) => {
			const userId = getUserId(message, user);

			setConversation((conversation) => ({
				...conversation,
				[userId]: [...(conversation[userId] || []), message],
			}));
		},
		[user, setConversation]
	);

	const updateMessage = useCallback(
		(message) => {
			const userId = getUserId(message, user);

			setConversation((conversation) => {
				const messages =
					conversation[userId].map((m) => {
						if (m.id === message.id) {
							return { ...m, ...message };
						}
						return m;
					}) || [];

				return {
					...conversation,
					[userId]: messages,
				};
			});
		},
		[user, setConversation]
	);

	const updateOrAddMessage = useCallback(
		(message) => {
			const userId = getUserId(message, user);
			const messages = conversation[userId] || [];

			if (messages.find((m) => m.id === message.id)) {
				updateMessage(message);
			} else {
				updateMessageCounter(message);
				addMessage(message);
			}
		},
		[user, conversation, addMessage, updateMessage, updateMessageCounter]
	);

	const updateMessageCounter = useCallback(
		(message) => {
			if (message.from === selectedUserId) {
				return;
			}

			setUsers((users) => {
				return users.map((u) =>
					u.id === message.from && message.from !== selectedUserId
						? { ...u, newMessages: (u.newMessages || 0) + 1 }
						: u
				);
			});
		},
		[setUsers, selectedUserId]
	);

	useEffect(() => {
		if (!socket) return;

		function handleConnect() {
			socket.emit("user connect", user);
		}

		function handleDisconnect() {
			socket.emit("user disconnect", user);
		}

		function handleUserConnect(newUser) {
			if (users.find((u) => u.id === newUser.id)) {
				setUsers(
					users.map((u) => (u.id === newUser.id ? { ...u, ...newUser } : u))
				);
			} else {
				setUsers([...users, newUser]);
			}
		}

		function handleUserDisconnect(user) {
			setUsers(users.map((u) => (u.id === user.id ? { ...u, ...user } : u)));
		}

		socket.on("connect", handleConnect);
		socket.on("disconnect", handleDisconnect);
		socket.on("user connect", handleUserConnect);
		socket.on("user disconnect", handleUserDisconnect);

		return () => {
			socket.off("connect", handleConnect);
			socket.off("disconnect", handleDisconnect);
			socket.off("user connect", handleUserConnect);
			socket.off("user disconnect", handleUserDisconnect);
		};
	}, [socket, user, users, setUsers]);

	useEffect(() => {
		if (!socket) return;
		function handleUsers(users) {
			setUsers((oldUsers) => {
				const updatedUsers = deepMerge(oldUsers, users);
				return updateNewMessagesCounter(updatedUsers, conversation, user);
			});
		}

		socket.on("users", handleUsers);
		return () => {
			socket.off("users", handleUsers);
		};
	}, [socket, user, conversation, users, setUsers]);

	useEffect(() => {
		if (!socket) return;

		function onConversations(conversations) {
			for (const [userId, messages] of Object.entries(conversations)) {
				messages.forEach((message) => {
					if (message.to === user.id) {
						if (!message.reachedToUser) {
							if (message.from === selectedUserId) {
								message.seenByUser = true;
							}

							message.reachedToUser = true;
							socket.emit("message ack", message);
						}
					}
				});
			}

			setConversation((oldConversations) => {
				const updatedConversations = deepMerge(oldConversations, conversations);
				setUsers(updateNewMessagesCounter(users, updatedConversations, user));
				return updatedConversations;
			});
		}

		socket.on("conversations", onConversations);

		return () => {
			socket.off("conversations", onConversations);
		};
	}, [socket, users, user, setConversation, setUsers]);

	useEffect(() => {
		if (!socket) return;

		function handleMessage(message) {
			if (document.visibilityState === "hidden") {
				beep();
			}

			if (message.from === selectedUserId) {
				message.seenByUser = true;
			}

			message.reachedToUser = true;
			updateOrAddMessage(message);
			socket.emit("message ack", message);
		}

		socket.on("message", handleMessage);
		socket.on("message ack", updateMessage);
		socket.on("message seen", updateMessage);
		socket.on("add/update message", updateOrAddMessage);

		return () => {
			socket.off("message", handleMessage);
			socket.off("message ack", updateMessage);
			socket.off("message seen", updateMessage);
			socket.off("add/update message", updateOrAddMessage);
		};
	}, [socket, selectedUserId, addMessage, updateMessage, updateOrAddMessage]);

	useEffect(() => {
		if (!socket) return;

		setConversation((conversation) => {
			const messages = conversation[selectedUserId] || [];

			return {
				...conversation,
				[selectedUserId]: messages.map((message) => {
					if (isMessageNotSeen(message, user)) {
						message.seenByUser = true;

						socket.emit("message seen", message);

						return {
							...message,
						};
					}

					return message;
				}),
			};
		});
	}, [socket, user, selectedUserId, setConversation]);

	function sendMessage(text) {
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
			timestamp: new Date().getTime(),
		};

		addMessage(message);
		socket.emit("message", message, (msg) => {
			updateMessage(msg);
		});
	}

	useEffect(async () => {
		if (!socket) return;
		socket.connect();
	}, [socket]);

	if (socket && !socket.connect) return <div>Please wait...</div>;

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
					users={users.filter((u) => u.id !== user.id)}
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
						loggedInUser={user}
						user={users.find((u) => u.id === selectedUserId)}
						messages={conversation[selectedUserId] || []}
						onSendMessage={sendMessage}
					/>
				)}
			</div>
		</div>
	);
}

// Util functions
function getUserId(message, user) {
	if (message.from === user.id) {
		return message.to;
	}

	return message.from;
}

function isMessageNotSeen(message, user) {
	return message.to === user.id && !message.seenByUser;
}

function updateNewMessagesCounter(users, conversations, user) {
	return users.map((u) => {
		const messages = conversations[u.id] || [];
		const unseenMessages = messages.reduce((acc, message) => {
			if (isMessageNotSeen(message, user)) return 1 + acc;
			return acc;
		}, 0);

		return {
			...u,
			newMessages: unseenMessages,
		};
	});
}
