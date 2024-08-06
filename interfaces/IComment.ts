interface IComment {
	id: string
	content: string
	user: IUserSimple
	createdAt: string
	updatedAt: string
	_count: {
	commentLike: number
	}
	isLiked?: boolean
}
