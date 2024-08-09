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

		const notifications = await prisma.settings.findUnique({
			where: {
				userId: decoded.id,
			},
			select: {
				inAppNotifications: true,
				emailNotifications: true,
				pushNotifications: true,
			},
		})

		if (!notifications) {
			return notFoundResponse("User not found")
		}

		return successResponse({ notifications })
	} catch (e) {
		console.error("Error getting user notifications: ", e)
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

		const { inAppNotifications, emailNotifications, pushNotifications } =
			await req.json()

		const notifications = await prisma.settings.update({
			where: {
				userId: decoded.id,
			},
			data: {
				inAppNotifications,
				emailNotifications,
				pushNotifications,
			},
			select: {
				inAppNotifications: true,
				emailNotifications: true,
				pushNotifications: true,
			},
		})

		if (!notifications) {
			return notFoundResponse("User not found")
		}

		return successResponse({ notifications })
	} catch (e) {
		console.error("Error updating user notifications: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, PATCH",
	})
}
