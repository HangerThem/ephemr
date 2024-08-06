import { get, post, requestDelete, patch } from "../requestHelpers"

export const requestGetComments = async (
	postId: string
): Promise<
	| {
		status: number
		comments: IComment[]
	}
	| IErrorResponse
> => {
	return await get<{
	status: number
	comments: IComment[]
	}>(`/posts/${postId}/comments`)
}

export const requestCreateComment = async (
	postId: string,
	content: string
): Promise<
	| {
		status: number
		comment: IComment
	}
	| IErrorResponse
> => {
	return await post<{
	status: number
	comment: IComment
	}>(`/posts/${postId}/comments`, {
	content,
	})
}

export const requestDeleteComment = async (
	postId: string,
	commentId: string
): Promise<IErrorResponse> => {
	return await requestDelete<IErrorResponse>(
	`/posts/${postId}/comments/${commentId}`,
	{}
	)
}

export const requestEditComment = async (
	postId: string,
	commentId: string,
	content: string
): Promise<
	| {
		status: number
		comment: IComment
	}
	| IErrorResponse
> => {
	return await patch<{
	status: number
	comment: IComment
	}>(`/posts/${postId}/comments/${commentId}`, {
	content,
	})
}

export const requestLikeComment = async (
	postId: string,
	commentId: string
): Promise<
	| {
		status: number
		comment: IComment
	}
	| IErrorResponse
> => {
	return await post<
	| {
		status: number
		comment: IComment
		}
	| IErrorResponse
	>(`/posts/${postId}/comments/${commentId}/like`, {})
}

export const requestUnlikeComment = async (
	postId: string,
	commentId: string
): Promise<
	| {
		status: number
		comment: IComment
	}
	| IErrorResponse
> => {
	return await requestDelete<
	| {
		status: number
		comment: IComment
		}
	| IErrorResponse
	>(`/posts/${postId}/comments/${commentId}/like`, {})
}
