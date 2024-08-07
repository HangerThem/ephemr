interface IComment {
	id: string
	postId: string
	content: string
	user: IUserSimple
	createdAt: string
	updatedAt: string
	_count: {
		commentLike: number
		replies: number
	}
	isLiked?: boolean
}
