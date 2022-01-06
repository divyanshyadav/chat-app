import React, { useCallback, useState } from "react";
import { get, debounce } from "../utils/api-client";
import styled from "styled-components";

const SearchContainer = styled.div`
	width: 100%;
	margin: 0 20px;
`;

const ItemsContainer = styled.div`
	position: relative;
	width: 100%;
`;

const Items = styled.div`
	position: absolute;
	width: 100%;
	-webkit-box-shadow: 0px 10px 13px -7px #000000,
		5px 5px 15px 5px rgba(0, 0, 0, 0);
	box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
`;

const Item = styled.div`
	background: ${({ selected, theme }) => (selected ? theme.light : theme.dark)};
	height: 40px;
	display: flex;
	align-items: center;
	padding: 0 10px;
`;

const SearchInput = styled.input`
	border: none;
	outline: none;
	padding: 0px 10px;
	width: 100%;
	height: 40px;
	font-size: 16px;
	box-sizing: border-box;
`;

export default function Search({ onSelect, getItems }) {
	const [value, setValue] = useState("");
	const [items, setItems] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const requestItems = useCallback(
		debounce(async (value) => {
			setItems(await getItems(value));
		}, 200),
		[setItems, getItems]
	);

	function cleanup() {
		setItems([]);
		setValue("");
		setSelectedIndex(0);
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (items[selectedIndex] === undefined) {
			return;
		}

		onSelect(items[selectedIndex]);
		cleanup();
	}

	function handleChange(e) {
		e.preventDefault();
		setValue(e.target.value);
		requestItems(e.target.value);
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
		<SearchContainer onKeyDown={handleKeyDown}>
			<form onSubmit={handleSubmit}>
				{/* <label htmlFor="search"> */}
				<SearchInput
					placeholder="Search"
					value={value}
					type="text"
					name="search"
					autoComplete="off"
					onChange={handleChange}
				/>
				{/* </label> */}
			</form>
			<ItemsContainer>
				<Items>
					{items.map((i, index) => (
						<Item
							key={i.id}
							selected={index === selectedIndex}
							onClick={() => {
								onSelect(i);
								cleanup();
							}}
						>
							<div>{i.username}</div>
						</Item>
					))}
				</Items>
			</ItemsContainer>
		</SearchContainer>
	);
}
