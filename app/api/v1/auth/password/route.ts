import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	successResponse,
	notFoundResponse,
	unauthorizedResponse,
	badRequestResponse,
	optionsResponse,
} from "@/helpers/apiHelper"
import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/utils/jwt"
import { verifyPassword, hashPassword } from "@/utils/bcryptjs"

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

		const { currentPassword, newPassword, confirmPassword } = await req.json()

		if (!currentPassword || !newPassword || !confirmPassword) {
			return badRequestResponse("Missing fields")
		}

		if (newPassword !== confirmPassword) {
			return badRequestResponse("Passwords do not match")
		}

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (!user) {
			return notFoundResponse("User not found")
		}

		const passwordMatch = await verifyPassword(currentPassword, user.password)

		if (!passwordMatch) {
			return unauthorizedResponse("Invalid password")
		}

		const newPasswordHashed = await hashPassword(newPassword)

		await prisma.user.update({
			where: {
				id: decoded.id,
			},
			data: {
				password: newPasswordHashed,
			},
		})

		return successResponse({ message: "Password updated" })
	} catch (e) {
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "PATCH",
	})
}
