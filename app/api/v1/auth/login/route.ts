import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	unauthorizedResponse,
	badRequestResponse,
	notFoundResponse,
	forbiddenResponse,
} from "@/helpers/apiHelper"
import { generateNewTokens } from "@/utils/jwt"
import { verifyPassword } from "@/utils/bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, res: NextResponse) {
	try {
	const { usernameOrEmail, password } = await req.json()
	if (!usernameOrEmail || !password) {
		return badRequestResponse("Missing required fields")
	}

	const userVerified = await prisma.user.findFirst({
		where: {
		OR: [
			{
			username: usernameOrEmail,
			},
			{
			email: usernameOrEmail,
			},
		],
		},
		select: {
		id: true,
		verified: true,
		},
	})

	if (!userVerified) {
		return notFoundResponse("User not found")
	}

	const user = await prisma.user.findFirst({
		where: {
		id: userVerified.id,
		},
		select: {
		id: true,
		email: true,
		password: true,
		},
	})

	if (!user) {
		return internalServerErrorResponse()
	}

	const passwordMatch = await verifyPassword(password, user.password)

	if (!passwordMatch) {
		return unauthorizedResponse("Invalid username or password")
	}

	if (!userVerified.verified) {
		return forbiddenResponse("User not verified")
	}

	const { token, newRefreshToken } = generateNewTokens(user.id)

	return successResponse({ token, refreshToken: newRefreshToken })
	} catch (e) {
	console.error("Error logging in: ", e)
	return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST",
	})
}
