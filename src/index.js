import regeneratorRuntime from "regenerator-runtime";
import "./utils/logger";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./utils/auth";
import { ThemeProvider } from "styled-components";
import theme from "./utils/theme";

const app = document.getElementById("app");
ReactDOM.render(
	<ThemeProvider theme={theme}>
		<AuthProvider>
			<App />
		</AuthProvider>
	</ThemeProvider>,
	app
);
