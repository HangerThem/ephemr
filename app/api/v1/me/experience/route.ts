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

		const experience = await prisma.settings.findUnique({
			where: {
				userId: decoded.id,
			},
			select: {
				theme: true,
				language: true,
			},
		})

		if (!experience) {
			return notFoundResponse("User not found")
		}

		return successResponse({ experience })
	} catch (e) {
		console.error("Error getting user experience: ", e)
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

		const { theme, language } = await req.json()

		const user = await prisma.settings.findUnique({
			where: {
				userId: decoded.id,
			},
		})

		if (!user) {
			return notFoundResponse("User not found")
		}

		const experience = await prisma.settings.update({
			where: {
				userId: decoded.id,
			},
			data: {
				theme,
				language,
			},
			select: {
				theme: true,
				language: true,
			},
		})

		return successResponse({ experience })
	} catch (e) {
		console.error("Error updating user experience: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, PATCH",
	})
}
