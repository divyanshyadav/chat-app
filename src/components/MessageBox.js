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
				height: "100%",
				overflowY: "scroll",
				padding: "15px",
			}}
		>
			{messages.map((message) => (
				<div
					key={message.id}
					style={{
						display: "flex",
						justifyContent: message.from === userId ? "flex-end" : "flex-start",
					}}
				>
					<div
						style={{
							textAlign: message.from === userId ? "right" : "left",
							backgroundColor:
								message.from === userId ? "rgb(233 207 233)" : "rgb(231 140 231)",
							padding: "5px",
							borderRadius: "5px",
							margin: "5px",
							display: "inline-block",
						}}
					>
						<strong>{message.fromName}</strong>
						<br />
						<div
							style={{
								fontSize: "18px",
								marginTop: "5px",
							}}
						>
							{message.text}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
