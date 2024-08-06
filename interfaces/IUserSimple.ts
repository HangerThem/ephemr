interface IUserSimple {
	id: string
	username: string
	displayName: string
	profilePic?: string
	online?: boolean
	lastSeen?: Date
	mood?: IMood
	email?: string
}
