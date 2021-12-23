import React, { createContext } from "react";

const authContext = createContext();

export function AuthProvider({ children }) {
	const auth = useProvideAuth();

	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useProvideAuth() {
	const [user, setUser] = React.useState(() => {
		const user = localStorage.getItem("user");
		return user ? JSON.parse(user) : {};
	});

	function login(username) {
		const user = {
			id: Math.random().toString(),
			username,
		};
		setUser(user);
		localStorage.setItem("user", JSON.stringify(user));
	}

	function logout() {
		setUser({});
		localStorage.removeItem("user");
	}

	function isAuthenticated() {
		return !!user.id;
	}

	return {
		login,
		logout,
		isAuthenticated,
		user,
	};
}

export function useAuth() {
	const context = React.useContext(authContext);
	if (!context) {
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
}
