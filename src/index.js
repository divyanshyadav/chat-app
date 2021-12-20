import React from "react";
import ReactDOM from "react-dom";

const Hello = (props) => {
	return <h1>Hello World!</h1>;
};

const app = document.getElementById("app");
ReactDOM.render(<Hello />, app);
