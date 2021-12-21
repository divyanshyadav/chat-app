import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import { PrivateRoute } from "./utils/router";

const App = () => {
	return (
		<Router>
			<Switch>
				<PrivateRoute exact path="/">
					<Dashboard />
				</PrivateRoute>
				<Route exact path="/login" component={LoginPage} />
			</Switch>
		</Router>
	);
};

export default App;
