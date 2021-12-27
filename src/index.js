import regeneratorRuntime from "regenerator-runtime";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./utils/auth";

const app = document.getElementById("app");
ReactDOM.render(
	<AuthProvider>
		<App />
	</AuthProvider>,
	app
);
