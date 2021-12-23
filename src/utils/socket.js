import io from "socket.io-client";
const { API_URL } = process.env;

const socket = io(API_URL, {
	autoConnect: false,
});

if (process.env.NODE_ENV === "development") {
	socket.onAny((event, ...args) => {
		console.log(event, ...args);
	});
}

socket.on("connect_error", (err) => {
	console.error(err);
});

export default socket;
