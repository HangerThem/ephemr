import { verifyToken } from "@/utils/jwt"
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	unauthorizedResponse,
	badRequestResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import prisma from "@/helpers/prismaHelper"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {
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

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
			select: {
				id: true,
				username: true,
				displayName: true,
				email: true,
				profilePic: true,
				private: true,
				createdAt: true,
				_count: {
					select: {
						followers: true,
						following: true,
						posts: true,
					},
				},
				mood: {
					select: {
						emoji: true,
						name: true,
					},
				},
				lastSeen: true,
				online: true,
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

		if (!user) {
			return notFoundResponse("User not found")
		}

		return successResponse({ user: user })
	} catch (e) {
		console.error("Error getting user: ", e)
		return internalServerErrorResponse()
	}
}

export async function PATCH(req: NextRequest, res: NextResponse) {
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

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (!user) {
			return notFoundResponse("User not found")
		}

		const body = await req.json()

		await prisma.user.update({
			where: {
				id: decoded.id,
			},
			data: {
				...body,
				mood: {
					connect: {
						id: body.mood.id,
					},
				},
			},
		})

		return successResponse({ message: "User updated" })
	} catch (e) {
		console.error("Error updating user: ", e)
		return internalServerErrorResponse()
	}
}

export async function DELETE(req: NextRequest, res: NextResponse) {
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

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (!user) {
			return notFoundResponse("User not found")
		}

		await prisma.user.delete({
			where: {
				id: user.id,
			},
		})

		return successResponse({ message: "User deleted" })
	} catch (e) {
		console.error("Error deleting user: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, PATCH",
	})
}
