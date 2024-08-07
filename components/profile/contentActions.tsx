import styled from "styled-components"
import { CardText, Chat } from "react-bootstrap-icons"
import { FC } from "react"

const Container = styled.div`
	display: flex;
	justify-content: space-around;
	width: 100%;

	svg {
		color: rgba(var(--light), 0.5);
		transition: color 0.2s;
		cursor: pointer;

		&:hover {
			color: rgba(var(--light), 0.75);
		}

		&.active {
			color: rgb(var(--light));
		}
	}
`

interface ContentActionsProps {
	content: string
	setContent: React.Dispatch<React.SetStateAction<string>>
}

const ContentActions: FC<ContentActionsProps> = ({ content, setContent }) => {
	return (
		<Container>
			<CardText
				onClick={() => setContent("posts")}
				size={30}
				className={content === "posts" ? "active" : ""}
			/>
			<Chat
				onClick={() => setContent("comments")}
				size={30}
				className={content === "comments" ? "active" : ""}
			/>
		</Container>
	)
}

export default ContentActions
