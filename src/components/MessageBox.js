import React, { useLayoutEffect } from "react";
import UserImage from "./UserImage";

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
				<Message key={message.id} message={message} userId={userId} />
			))}
		</div>
	);
}

function Message({ message, userId }) {
	const isFromLoggedInUser = message.from === userId;

	return (
		<div
			style={{
				display: "flex",
				justifyContent: isFromLoggedInUser ? "flex-end" : "flex-start",
			}}
		>
			<div
				style={{
					textAlign: isFromLoggedInUser ? "right" : "left",
					backgroundColor:
						message.from === userId ? "rgb(233 207 233)" : "rgb(231 140 231)",
					padding: "5px",
					borderRadius: "5px",
					margin: "5px",
					display: "flex",
					flexDirection: "row",
				}}
			>
				<UserImage url={message.fromUser.imageUrl} />
				<div>
					<strong>{message.fromUser.name}</strong>
					<br />
					<div
						style={{
							fontSize: "18px",
							marginTop: "5px",
						}}
					>
						{message.text}
					</div>
					<div
						style={{
							textAlign: "right",
						}}
					>
						<Time timestamp={message.timestamp} />
						{isFromLoggedInUser && (
							<MessageStatus
								reachedToServer={message.reachedToServer}
								reachedToUser={message.reachedToUser}
								seenByUser={message.seenByUser}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function Time({ timestamp }) {
	function formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? "pm" : "am";
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? "0" + minutes : minutes;
		var strTime = hours + ":" + minutes + " " + ampm;
		return strTime;
	}

	return (
		<div
			style={{
				display: "inline-block",
				marginRight: "5px",
				fontSize: "12px",
			}}
		>
			{formatAMPM(new Date(timestamp))}
		</div>
	);
}

function MessageStatus({ reachedToServer, reachedToUser, seenByUser }) {
	if (seenByUser) {
		return "👀";
	}

	if (reachedToUser) {
		return "✔️✔️";
	}

	if (reachedToServer) {
		return "✔️";
	}

	return "🕑";
}
