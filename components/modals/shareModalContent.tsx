import styled from "styled-components"
import {
	Envelope,
	Facebook,
	Linkedin,
	Twitter,
	Whatsapp,
} from "react-bootstrap-icons"
import Link from "next/link"
import Button from "../buttons/button"

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 350px;
	gap: 1rem;
	background-color: rgb(var(--dark));
	padding: 1rem;
	border-radius: 5px;
	border: 1px solid rgba(var(--light), 0.25);

	h3 {
		font-size: 1.75rem;
		color: rgb(var(--light));
	}

	p {
		color: rgba(var(--light), 0.5);
		text-align: center;
	}
`

const ShareContainer = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-evenly;

	svg {
		color: rgba(var(--light), 0.8);
		font-size: 1.5rem;
		cursor: pointer;

		&:hover {
			color: rgb(var(--primary));
		}
	}
`

interface ShareModalContentProps {
	username: string
}

const ShareModalContent = ({ username }: ShareModalContentProps) => {
	const handleCopy = () => {
		navigator.clipboard.writeText(window.location.href)
	}

	return (
		<Container>
			<h3>Share!</h3>
			<p>If you like this profile, share it with your friends!</p>
			<ShareContainer>
				<Link
					href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
					passHref
				>
					<Facebook />
				</Link>
				<Link
					href={`https://www.linkedin.com/shareArticle?url=${window.location.href}`}
					passHref
				>
					<Linkedin />
				</Link>
				<Link
					href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
					passHref
				>
					<Twitter />
				</Link>
				<Link href={`https://wa.me/?text=${window.location.href}`} passHref>
					<Whatsapp />
				</Link>
				<Link href={`mailto:?body=${window.location.href}`} passHref>
					<Envelope />
				</Link>
			</ShareContainer>
			<Button onClick={handleCopy}>Copy Link</Button>
		</Container>
	)
}

export default ShareModalContent
