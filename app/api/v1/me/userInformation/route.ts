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

		await prisma.userInformation.update({
			where: {
				userId: decoded.id,
			},
			data: {
				...body,
			},
		})

		return successResponse({ message: "User information updated" })
	} catch (e) {
		console.error("Error updating user: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "PATCH",
	})
}
