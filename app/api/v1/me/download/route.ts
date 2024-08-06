import { verifyToken } from "@/utils/jwt"
import {
	internalServerErrorResponse,
	optionsResponse,
	downloadResponse,
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
				_count: {
					select: {
						followers: true,
						following: true,
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
			},
		})

		if (!user) {
			return notFoundResponse("User not found")
		}

		const data = JSON.stringify(user, null, 2)

		return downloadResponse(200, data)
	} catch (e) {
		console.error("Error getting user: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS(req: NextRequest, res: NextResponse) {
	return optionsResponse({
		"Access-Control-Allow-Methods": "GET",
		"Access-Control-Allow-Origin": "*",
	})
}
