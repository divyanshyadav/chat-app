import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./auth";
const { API_URL } = process.env;

function useSocket() {
	const [socket, setSocket] = useState(null);
	const { logout } = useAuth();

	useEffect(() => {
		const newSocket = io(API_URL, {
			autoConnect: false,
		});

		newSocket.onAny((event, ...args) => {
			console.log(event, ...args);
		});

		newSocket.on("connect_error", (err) => {
			if (err.message === "Invalid token") {
				logout();
			}
			console.error(err);
		});

		setSocket(newSocket);

		console.log("socket connected");

		return () => {
			newSocket.close();
			console.log("socket closed");
		};
	}, [setSocket]);

	return socket;
}

export default useSocket;
