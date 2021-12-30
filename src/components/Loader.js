import React from "react";
import { Oval } from "react-loader-spinner/dist/loader/Oval";
import styled from "styled-components";

const LoaderContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
`;

export default function Loader() {
	return (
		<LoaderContainer>
			<Oval
				color="rgb(64, 0, 57)"
				secondaryColor="rgb(231, 140, 231)"
				arialLabel="loading-indicator"
			/>
		</LoaderContainer>
	);
}
