import React, { useLayoutEffect } from "react";
import MessagesBox from "./MessageBox";

export default function Chat({ userId, messages, onSendMessage }) {
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
		<div
			style={{
				flexGrow: "8",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<MessagesBox userId={userId} messages={messages} />
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
		</div>
	);
}
