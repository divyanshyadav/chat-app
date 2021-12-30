import React from "react";

export default function UserImage({ url, size = 55 }) {
	if (!url) return null;
	return (
		<img
			style={{
				borderRadius: "50%",
				marginRight: "10px",
			}}
			src={url}
			alt="profile_img"
			height={size}
			width={size}
		/>
	);
}
