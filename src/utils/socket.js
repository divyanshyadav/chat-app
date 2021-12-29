import { useState, useEffect } from "react";
import io from "socket.io-client";
const { API_URL } = process.env;

function useSocket(user) {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const newSocket = io(API_URL, {
			autoConnect: false,
		});

		newSocket.auth = user;
		if (process.env.NODE_ENV === "development") {
			newSocket.onAny((event, ...args) => {
				console.log(event, ...args);
			});
		}

		newSocket.on("connect_error", (err) => {
			console.error(err);
		});

		setSocket(newSocket);

		console.log("socket connected");

		return () => {
			newSocket.close();
			console.log("socket closed");
		};
	}, [setSocket, user]);

	return socket;
}

export default useSocket;
