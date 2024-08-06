import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { NextRequest } from "next/server"
import { verifyToken } from "@/utils/jwt"

export async function GET(
	req: NextRequest,
	{ params }: { params: { username: string } }
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

		const { username } = params

		const tempUser = await prisma.user.findUnique({
			where: {
				username: username,
			},
			select: {
				id: true,
				username: true,
				displayName: true,
				lastSeen: true,
				online: true,
				profilePic: true,
				private: true,
				createdAt: true,
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
				_count: {
					select: {
						followers: true,
						following: true,
						posts: true,
					},
				},
				userInformation: {
					select: {
						bio: true,
						location: true,
						website: true,
						pronouns: true,
					},
				},
			},
		})

		if (!tempUser) {
			return notFoundResponse("User not found")
		}

		let user = {
			...tempUser,
			isFollowed: false,
			isFollowing: false,
		}

		if (decoded) {
			const followee = await prisma.follow.findFirst({
				where: {
					followerId: decoded.id,
					followeeId: user.id,
				},
			})

			const follower = await prisma.follow.findFirst({
				where: {
					followerId: user.id,
					followeeId: decoded.id,
				},
			})

			user.isFollowed = Boolean(follower)
			user.isFollowing = Boolean(followee)
		}

		const activityStatus = user.settings?.activityStatus

		const response = {
			id: user.id,
			username: user.username,
			displayName: user.displayName,
			profilePic: user.profilePic,
			lastSeen: activityStatus ? user.lastSeen : null,
			online: activityStatus ? user.online : false,
			createdAt: user.createdAt,
			private: user.private,
			_count: user._count,
			isFollowed: user.isFollowed,
			isFollowing: user.isFollowing,
			mood: user.mood,
			userInformation: user.userInformation,
		}

		return successResponse({ user: response })
	} catch (e) {
		console.error("Error getting user: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET",
	})
}
