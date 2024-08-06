import styled from "styled-components"

export const ModalContainer = styled.dialog`
	position: absolute;
	transform: translate(-50%, -50%);
	top: 50%;
	left: 50%;
	background: none;
	border: none;
	z-index: 105;
	outline: none;

	&::backdrop {
	backdrop-filter: blur(5px);
	background: rgba(var(--dark), 0.75);
	}
`
