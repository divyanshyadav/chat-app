window.console.log = (...args) => {
	if (process.env.NODE_ENV === "development") {
		window.console.log(...args);
	}
};
