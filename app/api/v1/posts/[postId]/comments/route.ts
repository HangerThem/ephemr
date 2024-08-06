import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	createdResponse,
	unauthorizedResponse,
	badRequestResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { verifyToken } from "@/utils/jwt"
import { NextRequest } from "next/server"

export async function GET(
	req: NextRequest,
	{ params }: { params: { postId: string } }
) {
	try {
	const authHeader = req.headers.get("Authorization")
	const token =
		authHeader && authHeader.startsWith("Bearer ")
		? authHeader.split(" ")[1]
		: null

	let decoded

	try {
		decoded = token && verifyToken(token)
	} catch (e) {
		console.error("Error verifying token: ", e)
	}

	const { postId } = params

	const post = await prisma.post.findFirst({
		where: {
		id: postId,
		},
	})

	if (!post) {
		return notFoundResponse("Post not found")
	}

	let comments = await prisma.comment.findMany({
		where: {
		postId: postId,
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
		orderBy: {
		createdAt: "desc",
		},
	})

	if (!comments) {
		return notFoundResponse("Comments not found")
	}

	if (decoded) {
		const like = await prisma.commentLike.findMany({
		where: {
			userId: decoded.id,
		},
		select: {
			commentId: true,
		},
		})

		if (like) {
		comments = comments.map((comment) => {
			const isLiked = like.find((l) => l.commentId === comment.id)
			return {
			...comment,
			isLiked: isLiked ? true : false,
			}
		})
		}
	}

	const response = comments.map((comment) => {
		const user = comment?.user as IUserSimple
		const activityStatus = comment.user?.settings?.activityStatus

		return {
		...comment,
		user: {
			id: user.id,
			username: user.username,
			displayName: user.displayName,
			profilePic: user.profilePic,
			lastSeen: activityStatus ? user.lastSeen : null,
			online: activityStatus ? user.online : false,
		},
		}
	})

	return successResponse({ comments: response })
	} catch (e) {
	console.error("Error getting post: ", e)
	return internalServerErrorResponse()
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { postId: string } }
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

	const { postId } = params

	const { content } = await req.json()

	if (!content || !content.trim()) {
		return badRequestResponse("No content provided")
	}

	const isPost = await prisma.post.findUnique({
		where: {
		id: postId,
		},
	})

	if (!isPost) {
		return notFoundResponse("Post not found")
	}

	const comment = await prisma.comment.create({
		data: {
		content,
		postId,
		userId: decoded.id,
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

	const activityStatus = comment?.user?.settings?.activityStatus

	const response = {
		...comment,
		isLiked: true,
		user: {
		id: comment?.user?.id,
		username: comment?.user?.username,
		displayName: comment?.user?.displayName,
		profilePic: comment?.user?.profilePic,
		lastSeen: activityStatus ? comment.user?.lastSeen : null,
		online: activityStatus ? comment.user?.online : false,
		},
	}

	return createdResponse({ comment: response })
	} catch (e) {
	console.error("Error creating comment: ", e)
	return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
	"Access-Control-Allow-Methods": "GET, POST",
	"Access-Control-Allow-Origin": "*",
	})
}
