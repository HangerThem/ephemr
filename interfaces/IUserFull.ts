interface IUserFull extends IUserSimple {
	isFollowing?: boolean
	isFollowed?: boolean
	createdAt: Date
	_count: {
		followers: number
		following: number
		posts: number
	}
	userInformation: IUserInformation
}
