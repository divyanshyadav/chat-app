import React, { useLayoutEffect } from "react";

export default function MessagesBox({ userId, messages }) {
	const container = React.useRef(null);

	useLayoutEffect(() => {
		container.current.scrollTop = container.current.scrollHeight;
	}, [messages]);

	return (
		<div
			ref={container}
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				overflowY: "scroll",
				padding: "15px",
			}}
		>
			{messages.map((message) => (
				<div
					key={message.id}
					style={{
						textAlign: message.from === userId ? "right" : "left",
						backgroundColor: message.from === userId ? "#fafafa" : "#eaeaea",
						padding: "5px",
						borderRadius: "5px",
						display: "inline-block",
						margin: "5px",
					}}
				>
					<div>
						<strong>{message.fromName}</strong>
					</div>
					<div>{message.text}</div>
				</div>
			))}
		</div>
	);
}
