import { deepMerge } from "./object";

const commonOptions = {
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
};

export function get(url, options) {
	return fetch(url, deepMerge(commonOptions, options)).then((response) =>
		response.json()
	);
}

export function post(url, options) {
	return fetch(url, {
		...deepMerge(commonOptions, options),
		method: "POST",
	}).then((response) => response.json());
}

export function debounce(fn, delay) {
	let timerId;
	return (...args) => {
		clearTimeout(timerId);
		timerId = setTimeout(() => fn(...args), delay);
	};
}
