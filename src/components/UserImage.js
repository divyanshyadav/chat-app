import React from "react";

export default function UserImage({ url }) {
	return (
		<img
			style={{
				borderRadius: "50%",
				marginRight: "10px",
			}}
			src={url}
			alt="profile_img"
			height={55}
			width={55}
		/>
	);
}
