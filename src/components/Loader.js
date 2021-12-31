import React from "react";
import { Oval } from "react-loader-spinner/dist/loader/Oval";
import styled from "styled-components";
import theme from "../utils/theme";

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
				color={theme.secondary}
				secondaryColor={theme.light}
				arialLabel="loading-indicator"
			/>
		</LoaderContainer>
	);
}
