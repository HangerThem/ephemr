import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { verifyToken } from "@/utils/jwt"
import { NextRequest } from "next/server"

export async function GET(
	req: NextRequest,
	{
		params,
	}: {
		params: { username: string }
	}
) {
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

		let comments = await prisma.comment.findMany({
			where: {
				user: {
					username: params.username,
				},
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
						profilePic: true,
						settings: {
							select: {
								activityStatus: true,
							},
						},
						lastSeen: true,
						online: true,
					},
				},
				_count: {
					select: {
						replies: true,
						commentLike: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		})

		if (!comments) {
			return notFoundResponse("No comments found")
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

		const response = comments.map((post) => {
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

		return successResponse({ comments: response })
	} catch (e) {
		console.error("Error getting comments: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST",
	})
}
