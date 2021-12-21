import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./auth";

export function PrivateRoute({ children, ...rest }) {
	const auth = useAuth();
	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth.isAuthenticated() ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
}
