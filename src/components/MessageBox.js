import React, { useLayoutEffect } from "react";
import styled from "styled-components";

const MessageBoxContainer = styled.div`
	height: 100%;
	overflow-y: auto;
	padding: 15px;
	background: ${(props) => props.theme.dark};
`;

export default function MessagesBox({ loggedInUser, messages }) {
	const container = React.useRef(null);

	useLayoutEffect(() => {
		container.current.scrollTop = container.current.scrollHeight;
	}, [messages]);

	return (
		<MessageBoxContainer ref={container}>
			{messages.map((message) => (
				<Message key={message.id} message={message} loggedInUser={loggedInUser} />
			))}
		</MessageBoxContainer>
	);
}

const MessageContainer = styled.div`
	display: flex;
	justify-content: ${({ isFromLoggedInUser }) =>
		isFromLoggedInUser ? "flex-end" : "flex-start"};

	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.1s;

	@keyframes fadeInOpacity {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
`;

function Message({ message, loggedInUser }) {
	const isFromLoggedInUser = message.from === loggedInUser.id;

	return (
		<MessageContainer isFromLoggedInUser={isFromLoggedInUser}>
			<div
				style={{
					textAlign: isFromLoggedInUser ? "right" : "left",
					backgroundColor:
						message.from === loggedInUser.id
							? "rgb(233 207 233)"
							: "rgb(231 140 231)",
					padding: "5px",
					borderRadius: "5px",
					margin: "5px",
					display: "flex",
					flexDirection: "row",
				}}
			>
				<div>
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
		</MessageContainer>
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

	if (!timestamp) return null;

	return (
		<div
			style={{
				display: "inline-block",
				marginRight: "5px",
				fontSize: "9px",
			}}
		>
			{formatAMPM(new Date(timestamp))}
		</div>
	);
}

function MessageStatus({ reachedToServer, reachedToUser, seenByUser }) {
	let symbol = "";

	if (seenByUser) {
		symbol = "????";
	} else if (reachedToUser) {
		symbol = "????????????";
	} else if (reachedToServer) {
		symbol = "??????";
	} else {
		symbol = "????";
	}

	return (
		<span
			style={{
				fontSize: "9px",
			}}
		>
			{symbol}
		</span>
	);
}
