import Link from "next/link"
import styled from "styled-components"
import DotLoader from "@/components/loaders/dotLoader"

const ButtonWrapper = styled.button`
	color: rgb(var(--light));
	border: none;
	border-radius: 5px;
	padding: 0 1rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	font-size: 0.8rem;
	height: 35px;
	font-weight: 500;
	transition: background-color 0.2s ease;
	width: 100%;
	background-color: rgba(var(--light), 0.1);
	border: 1px solid rgba(var(--light), 0.2);

	&.danger {
	background-color: rgba(var(--danger), 0.6);

	&:hover {
		background-color: rgba(var(--danger), 0.8);
	}
	}

	&.small {
	width: 75px;
	}

	&.medium {
	width: 100px;
	}

	&.large {
	width: 150px;
	}

	&.full {
	width: 100%;
	}

	&:hover {
	background-color: rgba(var(--light), 0.2);
	}

	&:disabled {
	cursor: default;
	background-color: rgba(var(--light), 0.1);
	}
`

interface ButtonProps {
	children: React.ReactNode
	loading?: boolean
	size?: "small" | "medium" | "large" | "full"
	type?: "button" | "submit" | "reset"
	className?: string
	link?: string
	icon?: React.ReactNode
	onClick?: () => void
}

export default function Button({
	children,
	loading = false,
	size = "medium",
	type = "button",
	className,
	icon,
	link,
	onClick,
}: ButtonProps) {
	if (link) {
	return (
		<Link href={link}>
		<ButtonWrapper
			className={className + " " + size}
			type={type}
			onClick={onClick}
		>
			{icon} {children}
		</ButtonWrapper>
		</Link>
	)
	}

	return (
	<ButtonWrapper
		className={className + " " + size}
		type={type}
		onClick={onClick}
		disabled={loading}
	>
		{loading ? (
		<DotLoader />
		) : (
		<>
			{icon} {children}
		</>
		)}
	</ButtonWrapper>
	)
}
