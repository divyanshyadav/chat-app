import React, { useCallback, useEffect, useState } from "react";
import { get, debounce } from "../utils/api-client";

export default function Search({ url, onSelect }) {
	const [value, setValue] = useState("");
	const [items, setItems] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const requestItems = useCallback(
		debounce(async (url) => {
			setItems(await get(url));
		}, 200),
		[setItems]
	);

	function cleanup() {
		setItems([]);
		setValue("");
		setSelectedIndex(0);
	}

	function handleSubmit(e) {
		e.preventDefault();
		onSelect(items[selectedIndex]);
		cleanup();
	}

	function handleChange(e) {
		e.preventDefault();
		setValue(e.target.value);
		requestItems(url + `?search=${e.target.value}`);
	}

	function handleKeyDown(e) {
		if (e.keyCode === 38) {
			setSelectedIndex((selectedIndex) => Math.max(0, selectedIndex - 1));
			e.preventDefault();
		} else if (e.keyCode === 40) {
			setSelectedIndex((selectedIndex) =>
				Math.min(items.length - 1, selectedIndex + 1)
			);
			e.preventDefault();
		}
	}

	return (
		<div onKeyDown={handleKeyDown}>
			<form onSubmit={handleSubmit}>
				<label htmlFor="search">
					<input
						value={value}
						type="text"
						name="search"
						autoComplete="off"
						onChange={handleChange}
					/>
				</label>
			</form>
			<div
				style={{
					position: "relative",
				}}
			>
				<div
					style={{
						position: "absolute",
					}}
				>
					{items.map((i, index) => (
						<div
							key={i.id}
							style={{
								background: index === selectedIndex ? "red" : "#000",
							}}
							onClick={() => {
								onSelect(i);
								cleanup();
							}}
						>
							{i.username}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
