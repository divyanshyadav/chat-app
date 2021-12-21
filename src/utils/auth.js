import React, { createContext } from "react";

const authContext = createContext();

export function AuthProvider({ children }) {
	const auth = useProvideAuth();

	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useProvideAuth() {
	const [user, setUser] = React.useState({});

	function login(username) {
		setUser({
			id: Math.random().toString(),
			username,
		});
	}

	function logout() {
		setUser({});
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
