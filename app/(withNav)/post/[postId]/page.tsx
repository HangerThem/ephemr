"use client"

import { useState, useEffect } from "react"
import { requestGetPost } from "@/services/api-services/postService"
import { isError } from "@/utils/isError"
import {
	requestEditComment,
	requestDeleteComment,
	requestLikeComment,
	requestCreateComment,
	requestUnlikeComment,
	requestGetComments,
} from "@/services/api-services/commentService"
import { useAuth } from "@/context/authContext"
import PostComments from "@/components/post/postComments"
import { formatContentForDisplay } from "@/utils/formatContentForDisplay"
import PageLoader from "@/components/loaders/pageLoader"
import { PostContent } from "@/components/post/commentStyles"

export default function PostPage({ params }: { params: { postId: string } }) {
	const { user } = useAuth()
	const [post, setPost] = useState<IPostFull | null>(null)
	const [comments, setComments] = useState<IComment[]>([])

	const postId = params.postId

	useEffect(() => {
	const populateData = async () => {
		const postsRes = await requestGetPost(postId)
		const commentsRes = await requestGetComments(postId)

		if (isError(postsRes) || isError(commentsRes)) {
		return
		}

		setPost(postsRes.post)
		setComments(commentsRes.comments)
	}

	populateData()
	}, [postId])

	const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault()
	const target = e.target as typeof e.target & {
		content: { value: string }
	}
	const content = target.content.value
	const res = await requestCreateComment(postId, content)

	if (isError(res)) {
		return
	}

	setComments([res.comment, ...comments])
	}

	const handleEditComment = async (commentId: string, content: string) => {
	const res = await requestEditComment(postId, commentId, content)

	if (isError(res)) {
		return
	}

	const updatedComments = comments.map((c) => {
		if (c.id === commentId) {
		return res.comment
		}
		return c
	})

	setComments(updatedComments)
	}

	const handleDeleteComment = async (commentId: string) => {
	const res = await requestDeleteComment(postId, commentId)

	if (isError(res)) {
		return
	}

	const updatedComments = comments.filter((c) => c.id !== commentId)

	setComments(updatedComments)
	}

	const handleLike = async (comment: IComment) => {
	if (!post) return
	if (comment.isLiked) {
		const response = await requestUnlikeComment(post.id, comment.id)
		if (isError(response)) {
		console.error(response.error)
		return
		}

		const updatedComments = comments.map((c) => {
		if (c.id === comment.id) {
			return response.comment
		}
		return c
		})

		setComments(updatedComments)
	} else {
		const response = await requestLikeComment(post.id, comment.id)
		if (isError(response)) {
		console.error(response.error)
		return
		}

		const updatedComments = comments.map((c) => {
		if (c.id === comment.id) {
			return response.comment
		}
		return c
		})

		setComments(updatedComments)
	}
	}

	if (!post) {
	return <PageLoader />
	}

	return (
	<>
		<div>
		<h1>{post.user.username}</h1>
		<PostContent>{formatContentForDisplay(post.content)}</PostContent>
		</div>
		<PostComments
		comments={comments}
		handleLike={handleLike}
		handleEditComment={handleEditComment}
		handleDeleteComment={handleDeleteComment}
		/>
		{user && (
		<form onSubmit={handleComment}>
			<textarea name="content" />
			<button type="submit">Comment</button>
		</form>
		)}
	</>
	)
}
