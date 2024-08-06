import { useRef, useState } from "react"
import { CommentAction, CommentActionsContainer } from "./commentStyles"
import {
	Heart,
	HeartFill,
	ThreeDots,
	PencilFill,
	Trash,
} from "react-bootstrap-icons"
import { useAuth } from "@/context/authContext"
import {
	DropdownContainer,
	DropdownContent,
	DropdownItem,
} from "@/components/dropdownStyles"

interface CommentActionsProps {
	comment: IComment
	handleLike: (comment: IComment) => void
	setEditing: React.Dispatch<React.SetStateAction<string | null>>
	handleDeleteComment: (commentId: string) => void
}

const CommentActions: React.FC<CommentActionsProps> = ({
	comment,
	handleLike,
	setEditing,
	handleDeleteComment,
}) => {
	const [dropdown, setDropdown] = useState<boolean>(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const { user } = useAuth()

	if (typeof window !== "undefined") {
	window.addEventListener("click", (e) => {
		if (
		dropdownRef.current &&
		!dropdownRef.current.contains(e.target as Node)
		) {
		setDropdown(false)
		}
	})

	window.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
		setDropdown(false)
		}
	})
	}

	return (
	<CommentActionsContainer>
		<CommentAction onClick={() => handleLike(comment)}>
		{comment.isLiked ? <HeartFill /> : <Heart />}
		<span className="presized">{comment._count.commentLike}</span>
		</CommentAction>
		<DropdownContainer ref={dropdownRef}>
		<CommentAction onClick={() => setDropdown(!dropdown)}>
			<ThreeDots />
		</CommentAction>
		<DropdownContent $visible={dropdown} onClick={() => setDropdown(false)}>
			{user && user.id === comment.user.id && (
			<>
				<DropdownItem onClick={() => setEditing(comment.id)}>
				<PencilFill />
				<span>Edit</span>
				</DropdownItem>
				<DropdownItem onClick={() => handleDeleteComment(comment.id)}>
				<Trash />
				<span>Delete</span>
				</DropdownItem>
			</>
			)}
		</DropdownContent>
		</DropdownContainer>
	</CommentActionsContainer>
	)
}

export default CommentActions
