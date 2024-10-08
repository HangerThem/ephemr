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
import { emailRegex } from "@/constants/emailRegex"

export async function GET(req: NextRequest, res: NextResponse) {
	try {
		const query = decodeURIComponent(req.url.split("username=")[1])

		const user = await prisma.user.findUnique({
			where: {
				username: query,
			},
			select: {
				email: true,
			},
		})

		if (!user) {
			return notFoundResponse("User not found")
		}

		return successResponse({ email: user.email })
	} catch (e) {
		console.error("Error getting post: ", e)
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

		const { email } = await req.json()

		if (!email) {
			badRequestResponse("No email provided")
		}

		if (!emailRegex.test(email)) {
			badRequestResponse("Invalid email")
		}

		const emailInUse = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (emailInUse) {
			return badRequestResponse("Email already in use")
		}

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (!user) {
			return notFoundResponse("User not found")
		}

		await prisma.user.update({
			where: {
				id: decoded.id,
			},
			data: {
				email,
			},
		})

		return successResponse({ message: "Email updated" })
	} catch (e) {
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, PATCH",
	})
}
