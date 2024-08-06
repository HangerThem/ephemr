import styled from "styled-components"

interface IDropdownStyles {
	$visible: boolean
}

export const DropdownContainer = styled.div`
	position: relative;
	display: inline-block;
`

export const DropdownContent = styled.div<IDropdownStyles>`
	display: ${({ $visible }) => ($visible ? "block" : "none")};
	position: absolute;
	background-color: rgba(var(--dark));
	right: 0;
	top: 2.5rem;
	min-width: 160px;
	border-radius: 0.5rem;
	border: 1px solid rgba(var(--light), 0.1);
	z-index: 1;
	overflow: hidden;
`

export const DropdownItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
	color: rgba(var(--light));
	padding: 0.5rem 0.75rem;
	transition: background-color 0.2s;

	span {
	font-size: 0.75rem;
	text-align: center;
	}

	&:hover {
	background-color: rgba(var(--light), 0.1);
	}
`
