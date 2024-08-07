import styled from "styled-components"
import { X } from "react-bootstrap-icons"

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

export const ModalClose = styled(X)`
	position: absolute;
	top: 10px;
	right: 10px;
	font-size: 20px;
	cursor: pointer;
	color: rgba(var(--light), 0.5);
	transition: color 0.2s;

	&:hover {
		color: rgb(var(--light));
	}
`
