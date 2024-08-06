import { get, post, requestDelete } from "../requestHelpers"

export const requestCreatePost = async (
	content: string
): Promise<
	| {
		status: number
		post: IPostSimple
	}
	| IErrorResponse
> => {
	return await post<{
	status: number
	post: IPostSimple
	}>("/posts", {
	content,
	})
}

export const requestGetPosts = async (): Promise<
	| {
		status: number
		posts: IPostSimple[]
	}
	| IErrorResponse
> => {
	const token = localStorage.getItem("ephemrToken") || ""
	return await get<{
	status: number
	posts: IPostSimple[]
	}>("/posts")
}

export const requestGetPost = async (
	postId: string
): Promise<
	| {
		status: number
		post: IPostFull
	}
	| IErrorResponse
> => {
	return await get<{
	status: number
	post: IPostFull
	}>(`/posts/${postId}`)
}

export const requestLikePost = async (
	postId: string
): Promise<
	| {
		status: number
		post: IPostSimple
	}
	| IErrorResponse
> => {
	return await post<
	| {
		status: number
		post: IPostSimple
		}
	| IErrorResponse
	>(`/posts/${postId}/like`, {})
}

export const requestUnlikePost = async (
	postId: string
): Promise<
	| {
		status: number
		post: IPostSimple
	}
	| IErrorResponse
> => {
	return await requestDelete<
	| {
		status: number
		post: IPostSimple
		}
	| IErrorResponse
	>(`/posts/${postId}/like`, {})
}
