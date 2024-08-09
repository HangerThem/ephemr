import { timeSince } from "@/utils/timeSince"
import { useState } from "react"
import {
	CommentContainer,
	Info,
	ProfileLink,
	TimeStamp,
	CommentWrapper,
	PostContent,
	CommentEditor,
	CommentEditorActions,
} from "./commentStyles"
import CommentActions from "./commentActions"
import { formatContentForDisplay } from "@/utils/formatContentForDisplay"
import Avatar from "@/components/avatar"

interface PostCommentsProps {
	comments: IComment[]
	handleLike: (comment: IComment) => void
	handleEditComment: (commentId: string, content: string) => void
	handleDeleteComment: (commentId: string) => void
}

const PostComments: React.FC<PostCommentsProps> = ({
	comments,
	handleLike,
	handleEditComment,
	handleDeleteComment,
}) => {
	const [editing, setEditing] = useState<string | null>(null)

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		commentId: string
	) => {
		e.preventDefault()
		const target = e.target as typeof e.target & {
			content: { value: string }
		}
		const content = target.content.value
		handleEditComment(commentId, content)
		setEditing(null)
	}

	return (
		<>
			{comments.map((comment) => (
				<CommentContainer key={comment.id}>
					<Info>
						<ProfileLink href={`/${comment.user?.username}` || ""}>
							<Avatar
								src={comment.user?.profilePic}
								seed={comment.user?.displayName || "deleted"}
								size={25}
								online={comment.user?.online}
							/>
							<h4>{comment.user?.displayName || "Deleted User"}</h4>
						</ProfileLink>
						<TimeStamp>
							{comment.updatedAt === comment.createdAt ? "Posted " : "Edited "}
							{timeSince(new Date(comment.updatedAt))}
						</TimeStamp>
					</Info>
					<CommentWrapper>
						{editing === comment.id ? (
							<form
								onSubmit={(e) => {
									handleSubmit(e, comment.id)
								}}
							>
								<CommentEditor name="content" defaultValue={comment.content} />
								<CommentEditorActions>
									<button type="submit">Save</button>
									<button onClick={() => setEditing(null)} className="cancel">
										Cancel
									</button>
								</CommentEditorActions>
							</form>
						) : (
							<PostContent>
								{formatContentForDisplay(comment.content)}
							</PostContent>
						)}
					</CommentWrapper>
					<CommentActions
						comment={comment}
						handleLike={handleLike}
						handleDeleteComment={handleDeleteComment}
						setEditing={setEditing}
					/>
				</CommentContainer>
			))}
		</>
	)
}

export default PostComments
