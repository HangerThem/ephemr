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
			mood: {
				select: {
				emoji: true,
				name: true,
				},
			},
			},
		},
		mood: {
			select: {
			emoji: true,
			name: true,
			},
		},
		_count: {
			select: {
			comments: true,
			postLike: true,
			},
		},
		},
	})

	if (!post) {
		return notFoundResponse("Post not found")
	}

	const activityStatus = post.user?.settings?.activityStatus
	const user = {
		id: post.user?.id,
		username: post.user?.username,
		displayName: post.user?.displayName,
		profilePic: post.user?.profilePic,
		lastSeen: activityStatus ? post.user?.lastSeen : null,
		online: activityStatus ? post.user?.online : false,
		mood: post.user?.mood,
	}

	const responseTemp = {
		...post,
		user,
	}

	let response = { ...responseTemp, isLiked: false }

	if (decoded) {
		const like = await prisma.postLike.findUnique({
		where: {
			postId_userId: {
			postId: postId,
			userId: decoded.id,
			},
		},
		})

		if (like) {
		response.isLiked = true
		}
	}

	return successResponse({ post: response })
	} catch (e) {
	console.error("Error getting post: ", e)
	return internalServerErrorResponse()
	}
}

export async function PATCH(
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

	const { postId } = params
	let decoded

	try {
		decoded = verifyToken(token)
	} catch (e) {
		console.error("Error verifying token: ", e)
		return unauthorizedResponse("Invalid token")
	}

	const post = await prisma.post.findFirst({
		where: {
		id: postId,
		userId: decoded.id,
		},
	})

	if (!post) {
		return notFoundResponse("Post not found")
	}

	const { content } = await req.json()

	const updatedPost = await prisma.post.update({
		where: {
		id: postId,
		},
		data: {
		content,
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
			},
		},
		_count: {
			select: {
			comments: true,
			postLike: true,
			},
		},
		},
	})

	return successResponse({ post: updatedPost })
	} catch (e) {
	console.error("Error updating post: ", e)
	return internalServerErrorResponse()
	}
}

export async function DELETE(
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

	const { postId } = params
	let decoded

	try {
		decoded = verifyToken(token)
	} catch (e) {
		console.error("Error verifying token: ", e)
		return unauthorizedResponse("Invalid token")
	}

	const post = await prisma.post.findFirst({
		where: {
		id: postId,
		userId: decoded.id,
		},
	})

	if (!post) {
		return notFoundResponse("Post not found")
	}

	await prisma.post.delete({
		where: {
		id: postId,
		},
	})

	return successResponse({ message: "Post deleted" })
	} catch (e) {
	console.error("Error deleting post: ", e)
	return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, PATCH, DELETE",
	})
}
