import io from "socket.io-client";

const URL = "http://localhost:3000";

const socket = io(URL, {
	autoConnect: false,
});

// socket.emit("online", loggedInUser);

// socket.on("online", (user) => {
// 	if (loggedInUser.id === user.id) return;
// 	console.log("online", user);
// 	setUsers((users) => [...users, user]);
// });

// socket.on("offline", (user) => {
// 	if (loggedInUser.id === user.id) return;
// 	console.log("offline", user);
// 	setUsers((users) => users.filter((u) => u.id !== user.id));
// });

socket.onAny((event, ...args) => {
	console.log(event, ...args);
});

socket.on("connect_error", (err) => {
	console.error(err);
});

export default socket;
