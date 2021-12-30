const log = window.console.log;

window.console.log = (...args) => {
	if (process.env.NODE_ENV === "development") {
		log(...args);
	}
};
