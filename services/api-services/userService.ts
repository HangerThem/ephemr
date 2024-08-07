import { get, getWithoutToken } from "../requestHelpers"

export const requestUserSimple = async (
	username: string
): Promise<
	| {
			status: number
			user: IUserSimple
	  }
	| IErrorResponse
> => {
	return await getWithoutToken<
		| {
				status: number
				user: IUserSimple
		  }
		| IErrorResponse
	>(`/users/${username}`, "force-cache", 600)
}

export const requestUserFull = async (
	username: string
): Promise<
	| {
			status: number
			user: IUserFull
	  }
	| IErrorResponse
> => {
	return await get<
		| {
				status: number
				user: IUserFull
		  }
		| IErrorResponse
	>(`/users/${username}/full`, "force-cache", 600)
}

export const requestUserPosts = async (
	username: string
): Promise<
	| {
			status: number
			posts: IPostSimple[]
	  }
	| IErrorResponse
> => {
	return await get<
		| {
				status: number
				posts: IPostSimple[]
		  }
		| IErrorResponse
	>(`/users/${username}/posts`)
}

export const requestUserComments = async (
	username: string
): Promise<
	| {
			status: number
			comments: IComment[]
	  }
	| IErrorResponse
> => {
	return await get<
		| {
				status: number
				comments: IComment[]
		  }
		| IErrorResponse
	>(`/users/${username}/comments`)
}
