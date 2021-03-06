import React from "react";
import MessagesBox from "./MessageBox";
import styled from "styled-components";

const Header = styled.div`
	background: gray;
	color: white;
	padding: 10px;
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 50px;
`;

const ChatContainer = styled.div`
	flex-grow: 8;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

export default function Chat({ user, messages, onSendMessage, loggedInUser }) {
	const messageInput = React.useRef(null);

	function handleSubmit(event) {
		event.preventDefault();
		const text = event.target.message.value;
		if (!text) return;
		onSendMessage(text);
		event.target.message.value = "";
		messageInput.current.focus();
	}

	return (
		<ChatContainer>
			{/* <Header>{user.name}</Header> */}
			<MessagesBox loggedInUser={loggedInUser} messages={messages} />
			<form
				style={{
					display: "flex",
				}}
				onSubmit={handleSubmit}
			>
				<input
					style={{
						width: "100%",
						height: "40px",
						fontSize: "16px",
						backgroundColor: "#fafafa",
					}}
					ref={messageInput}
					type="text"
					name="message"
					autoComplete="off"
				/>
				<button type="submit">Send</button>
			</form>
		</ChatContainer>
	);
}
