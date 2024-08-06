import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	unauthorizedResponse,
	badRequestResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { verifyToken } from "@/utils/jwt"
import { NextRequest } from "next/server"

export async function PATCH(
	req: NextRequest,
	{
		params,
	}: {
		params: { postId: string; commentId: string }
	}
) {
	try {
		const authHeader = req.headers.get("Authorization")
		const token =
			authHeader && authHeader.startsWith("Bearer ")
				? authHeader.split(" ")[1]
				: null
		if (!token) {
			return badRequestResponse("No token provided")
		}

		let decoded

		try {
			decoded = verifyToken(token)
		} catch (e) {
			console.error("Error verifying token: ", e)
			return unauthorizedResponse("Invalid token")
		}

		const isUser = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (!isUser) {
			return notFoundResponse("User not found")
		}

		const { postId, commentId } = params
		const { content } = await req.json()

		const isPost = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		})

		if (!isPost) {
			return notFoundResponse("Post not found")
		}

		const isComment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		})

		if (!isComment) {
			return notFoundResponse("Comment not found")
		}

		const isAuthor = isComment.userId === decoded.id

		if (!isAuthor) {
			return unauthorizedResponse("You are not the author of this comment")
		}

		const tempComment = await prisma.comment.update({
			where: {
				id: commentId,
			},
			data: {
				content: content,
			},
			select: {
				id: true,
				content: true,
				createdAt: true,
				updatedAt: true,
				user: {
					select: {
						id: true,
						username: true,
						displayName: true,
						lastSeen: true,
						online: true,
						profilePic: true,
						settings: {
							select: {
								activityStatus: true,
							},
						},
					},
				},
				_count: {
					select: {
						commentLike: true,
					},
				},
			},
		})

		const like = await prisma.commentLike.findFirst({
			where: {
				userId: decoded.id,
				commentId: tempComment.id,
			},
		})

		if (like) {
			var comment = {
				...tempComment,
				isLiked: true,
			}
		} else {
			var comment = {
				...tempComment,
				isLiked: false,
			}
		}

		const activityStatus = comment?.user?.settings?.activityStatus

		const response = {
			...comment,
			user: {
				id: comment?.user?.id,
				username: comment?.user?.username,
				displayName: comment?.user?.displayName,
				profilePic: comment?.user?.profilePic,
				lastSeen: activityStatus ? comment.user?.lastSeen : null,
				online: activityStatus ? comment.user?.online : false,
			},
		}

		return successResponse({ comment: response })
	} catch (e) {
		console.error("Error updating comment: ", e)
		return internalServerErrorResponse()
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { postId: string; commentId: string } }
) {
	try {
		const authHeader = req.headers.get("Authorization")
		const token =
			authHeader && authHeader.startsWith("Bearer ")
				? authHeader.split(" ")[1]
				: null
		if (!token) {
			return badRequestResponse("No token provided")
		}

		let decoded

		try {
			decoded = verifyToken(token)
		} catch (e) {
			console.error("Error verifying token: ", e)
			return unauthorizedResponse("Invalid token")
		}

		const isUser = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (!isUser) {
			return notFoundResponse("User not found")
		}

		const { postId, commentId } = params

		const isPost = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		})

		if (!isPost) {
			return notFoundResponse("Post not found")
		}

		const isComment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		})

		if (!isComment) {
			return notFoundResponse("Comment not found")
		}

		const isAuthor = isComment.userId === decoded.id

		if (!isAuthor) {
			return unauthorizedResponse("You are not the author of this comment")
		}

		await prisma.comment.delete({
			where: {
				id: commentId,
			},
		})

		return successResponse({ message: "Comment deleted" })
	} catch (e) {
		console.error("Error deleting comment: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Methods": "PATCH, DELETE",
		"Access-Control-Allow-Origin": "*",
	})
}
