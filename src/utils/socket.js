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

		if (process.env.NODE_ENV === "development") {
			newSocket.onAny((event, ...args) => {
				console.log(event, ...args);
			});
		}

		newSocket.on("connect_error", (err) => {
			logout();
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
