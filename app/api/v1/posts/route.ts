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
import { NextRequest, NextResponse } from "next/server"
import { io } from "socket.io-client"

export async function GET(req: NextRequest, res: NextResponse) {
	try {
		const authHeader = req.headers.get("Authorization")
		const token =
			authHeader && authHeader.startsWith("Bearer ")
				? authHeader.split(" ")[1]
				: null

		let decoded

		if (token && token !== "null") {
			try {
				decoded = verifyToken(token)
			} catch (e) {
				console.error("Error verifying token: ", e)
			}
		}

		let posts = await prisma.post.findMany({
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
						profilePic: true,
						lastSeen: true,
						online: true,
						settings: {
							select: {
								activityStatus: true,
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
			orderBy: {
				createdAt: "desc",
			},
		})

		if (!posts) {
			return notFoundResponse("No posts found")
		}

		if (decoded) {
			const like = await prisma.postLike.findMany({
				where: {
					userId: decoded.id,
				},
				select: {
					postId: true,
				},
			})

			if (like) {
				posts = posts.map((post) => {
					const isLiked = like.find((l) => l.postId === post.id)
					return {
						...post,
						isLiked: isLiked ? true : false,
					}
				})
			}
		}

		const response = posts.map((post) => {
			if (!post.user) {
				return {
					...post,
					user: null,
				}
			}

			const user = post?.user as IUserSimple
			const activityStatus = post.user?.settings?.activityStatus

			return {
				...post,
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

		return successResponse({ posts: response })
	} catch (e) {
		console.error("Error getting post: ", e)
		return internalServerErrorResponse()
	}
}

export async function POST(req: NextRequest, res: NextResponse) {
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

		const { content } = await req.json()

		if (!content || !content.trim()) {
			return badRequestResponse("No content provided")
		}

		const newPost = await prisma.post.create({
			data: {
				content,
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
						comments: true,
						postLike: true,
					},
				},
			},
		})

		const mentions = content.match(/@(\w+)/g)

		if (mentions) {
			const socketsTemp = await prisma.userSession.findMany({
				where: {
					user: {
						username: {
							in: mentions.map((m: string) => m.slice(1)),
						},
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

			socketIo.emit("mention", {
				user: {
					username: isUser.username,
					displayName: isUser.displayName,
				},
				profilePic: isUser.profilePic,
				socketIds: sockets.map((socket) => socket.socketId),
				id: newPost.id,
			})
		}

		const activityStatus = newPost.user?.settings?.activityStatus

		const response = {
			id: newPost.id,
			content: newPost.content,
			createdAt: newPost.createdAt,
			updatedAt: newPost.updatedAt,
			user: {
				id: newPost.user?.id,
				username: newPost.user?.username,
				displayName: newPost.user?.displayName,
				profilePic: newPost.user?.profilePic,
				lastSeen: activityStatus ? newPost.user?.lastSeen : null,
				online: activityStatus ? newPost.user?.online : false,
			},
			_count: newPost._count,
		}

		return createdResponse({ post: response })
	} catch (e) {
		console.error("Error creating post: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST",
	})
}
