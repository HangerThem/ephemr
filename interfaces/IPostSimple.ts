interface IPostSimple {
	id: string
	content: string
	user: IUserSimple
	mood?: IMood
	createdAt: string
	updatedAt: string
	_count: {
	comments: number
	postLike: number
	}
	isLiked?: boolean
}
