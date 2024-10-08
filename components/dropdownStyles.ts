import styled from "styled-components"

interface IDropdownStyles {
	$visible: boolean
	$position?: "top" | "bottom"
}

export const DropdownSelection = styled.div`
	width: 100%;
	padding: 0.5rem;
	border: 1px solid rgba(var(--light), 0.2);
	border-radius: 0.5rem;
	color: rgba(var(--light));
	display: flex;
	align-items: center;
	justify-content: space-between;

	span {
		display: flex;
		align-items: center;
	}
`

export const DropdownContent = styled.div<IDropdownStyles>`
	display: ${({ $visible }) => ($visible ? "block" : "none")};
	position: absolute;
	background-color: rgba(var(--dark));
	right: 0;
	${({ $position }) =>
		$position === "top" ? "bottom: 2.5rem;" : "top: 2.5rem;"}
	min-width: 160px;
	border-radius: 0.5rem;
	border: 1px solid rgba(var(--light), 0.1);
	z-index: 1;
	overflow: hidden;

	&.input-dropdown {
		${({ $position }) => ($position === "top" ? "bottom: 3rem;" : "top: 3rem;")}
	}
`

export const DropdownContainer = styled.div`
	position: relative;
	display: inline-block;

	&.full-width {
		width: 100%;

		> ${DropdownContent} {
			width: 100%;
		}
	}
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
