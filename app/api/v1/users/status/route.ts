import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	unauthorizedResponse,
	successResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { NextRequest } from "next/server"
import { verifyToken } from "@/utils/jwt"

export async function POST(req: NextRequest) {
	try {
		const authHeader = req.headers.get("Authorization")
		const token = authHeader?.startsWith("Bearer ")
			? authHeader.split(" ")[1]
			: null

		if (!token) {
			return unauthorizedResponse("No token provided")
		}

		let decoded
		try {
			decoded = verifyToken(token)
		} catch (e) {
			console.error("Error verifying token: ", e)
			return unauthorizedResponse("Invalid token")
		}

		const { online, socketId } = await req.json()
		if (online === undefined) {
			return unauthorizedResponse("Online status is required")
		}

		const user = await prisma.user.update({
			where: { id: decoded.id },
			data: { online, lastSeen: new Date() },
		})

		if (!user) {
			return notFoundResponse("User not found")
		}

		const socketExists = await prisma.userSession.findFirst({
			where: { socketId },
		})

		if (socketExists) {
			await prisma.userSession.delete({ where: { socketId } })
		}

		if (online) {
			await prisma.userSession.create({
				data: { socketId, userId: user.id },
			})
		} else {
			await prisma.userSession.deleteMany({
				where: { userId: user.id },
			})
		}

		return successResponse("User status updated successfully")
	} catch (e) {
		console.error("Error updating user status: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "POST",
	})
}
