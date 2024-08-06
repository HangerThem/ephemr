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

	let posts = await prisma.post.findMany({
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

export async function OPTIONS() {
	return optionsResponse({
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST",
	})
}
