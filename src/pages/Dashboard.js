import React, { useEffect } from "react";
import { useAuth } from "../utils/auth";
import socket from "../utils/socket";

export default function Dashboard() {
	const { user } = useAuth();
	const [users, setUsers] = React.useState([]);

	useEffect(() => {
		socket.auth = user;
		socket.connect();
		socket.on("users", (users) => setUsers(users));
		socket.on("user connected", (user) => setUsers((users) => [...users, user]));
	}, [user]);

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome, {user.username}</p>
			<div>
				<h2>Online Users</h2>
				<div>
					{users.map((user) => (
						<div key={user.id}>{user.username}</div>
					))}
				</div>
			</div>
		</div>
	);
}
