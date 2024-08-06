import styled, { keyframes } from "styled-components"

const dotPulse = keyframes`
	0%, 20% {
	background-color: rgba(var(--light), 0.2);
	transform: scale(1);
	}
	50% {
	background-color: rgba(var(--light), 0.6);
	transform: scale(1.5);
	}
	100% {
	background-color: rgba(var(--light), 0.2);
	transform: scale(1);
	}
`

const DotLoaderWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;

	.dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: rgba(var(--light), 0.2);
	animation: ${dotPulse} 1s infinite;
	}

	.dot:nth-child(1) {
	animation-delay: 0.1s;
	}

	.dot:nth-child(2) {
	animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
	animation-delay: 0.3s;
	}
`

const DotLoader = () => {
	return (
	<DotLoaderWrapper>
		<div className="dot"></div>
		<div className="dot"></div>
		<div className="dot"></div>
	</DotLoaderWrapper>
	)
}

export default DotLoader
