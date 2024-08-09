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

		const privateStatus = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
			select: {
				private: true,
			},
		})

		const showActivityStatus = await prisma.settings.findUnique({
			where: {
				userId: decoded.id,
			},
			select: {
				activityStatus: true,
			},
		})

		if (!privateStatus || !showActivityStatus) {
			return notFoundResponse("User not found")
		}

		return successResponse({
			privacy: {
				privateStatus: privateStatus.private,
				activityStatus: showActivityStatus.activityStatus,
			},
		})
	} catch (e) {
		console.error("Error getting user privacy settings: ", e)
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

		const { privateStatus, activityStatus } = await req.json()

		const user = await prisma.user.update({
			where: {
				id: decoded.id,
			},
			data: {
				private: privateStatus,
			},
		})

		const settings = await prisma.settings.update({
			where: {
				userId: decoded.id,
			},
			data: {
				activityStatus,
			},
		})

		if (!user || !settings) {
			return notFoundResponse("User not found")
		}

		return successResponse({
			privacy: {
				privateStatus: user.private,
				activityStatus: settings.activityStatus,
			},
		})
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
