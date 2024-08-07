import CommentCard from "../commentCard"

const UserProfileComments = ({ comments }: { comments: IComment[] }) => {
	return (
		<div>
			{comments.map((comment) => (
				<CommentCard key={comment.id} commentData={comment} />
			))}
		</div>
	)
}

export default UserProfileComments
