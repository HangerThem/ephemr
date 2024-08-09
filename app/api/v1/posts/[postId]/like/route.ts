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
import { io } from "socket.io-client"

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
			select: {
				username: true,
				displayName: true,
				profilePic: true,
			},
		})

		if (!isUser) {
			return notFoundResponse("User not found")
		}

		const { postId } = params

		const isPost = await prisma.post.findUnique({
			where: {
				id: postId,
			},
			select: {
				content: true,
				userId: true,
			},
		})

		if (!isPost) {
			return notFoundResponse("Post not found")
		}

		const existingLike = await prisma.postLike.findFirst({
			where: {
				postId: postId,
				userId: decoded.id,
			},
		})

		if (existingLike) {
			return badRequestResponse("User has already liked this post")
		}

		await prisma.postLike.create({
			data: {
				postId: postId,
				userId: decoded.id,
			},
		})

		const socketsTemp = await prisma.userSession.findMany({
			where: {
				userId: isPost.userId || undefined,
				user: {
					settings: {
						inAppNotifications: {
							equals: true,
						},
					},
				},
			},
			select: {
				socketId: true,
				user: {
					select: {
						id: true,
					},
				},
			},
		})

		const sockets = socketsTemp.filter(
			(socket) => socket.user.id !== decoded.id
		)

		const socketIo = sockets && io(process.env.SOCKET_URL as string)

		socketIo.emit("post-like", {
			user: {
				username: isUser.username,
				displayName: isUser.displayName,
			},
			profilePic: isUser.profilePic,
			socketIds: sockets.map((socket) => socket.socketId),
			id: postId,
		})

		const postTemp = await prisma.post.findUnique({
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

		const activityStatus = postTemp?.user?.settings?.activityStatus

		const post = {
			...postTemp,
			isLiked: true,
			user:
				{
					id: postTemp?.user?.id,
					username: postTemp?.user?.username,
					displayName: postTemp?.user?.displayName,
					profilePic: postTemp?.user?.profilePic,
					lastSeen: activityStatus ? postTemp.user?.lastSeen : null,
					online: activityStatus ? postTemp.user?.online : false,
				} || null,
		}

		return successResponse({ post: post })
	} catch (e) {
		console.error("Error creating post: ", e)
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

		const isPost = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		})

		if (!isPost) {
			return notFoundResponse("Post not found")
		}

		const like = await prisma.postLike.deleteMany({
			where: {
				postId: postId,
				userId: decoded.id,
			},
		})

		if (!like.count) {
			return badRequestResponse("User has not liked this post")
		}

		const postTemp = await prisma.post.findUnique({
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

		const activityStatus = postTemp?.user?.settings?.activityStatus

		const post = {
			...postTemp,
			isLiked: false,
			user: {
				id: postTemp?.user?.id,
				username: postTemp?.user?.username,
				displayName: postTemp?.user?.displayName,
				profilePic: postTemp?.user?.profilePic,
				lastSeen: activityStatus ? postTemp.user?.lastSeen : null,
				online: activityStatus ? postTemp.user?.online : false,
			},
		}

		return successResponse({ post: post })
	} catch (e) {
		console.error("Error creating post: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "POST, DELETE",
	})
}
