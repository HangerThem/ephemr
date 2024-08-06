import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	badRequestResponse,
	successResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { hashPassword } from "@/utils/bcryptjs"

export async function POST(req: any) {
	try {
		const { resetToken, password, passwordConfirmation } = await req.json()

		if (!resetToken) {
			badRequestResponse("Reset token is required")
		}

		if (!password) {
			badRequestResponse("Password is required")
		}

		if (!passwordConfirmation) {
			badRequestResponse("Password confirmation is required")
		}

		if (password !== passwordConfirmation) {
			badRequestResponse("Passwords do not match")
		}

		const user = await prisma.user.findUnique({
			where: {
				resetToken,
			},
		})

		if (!user) {
			notFoundResponse("User not found")
		}

		if (user?.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
			badRequestResponse("Reset token has expired")
		}

		const hashedPassword = await hashPassword(password)

		await prisma.user.update({
			where: {
				resetToken,
			},
			data: {
				password: hashedPassword,
				resetToken: null,
				resetTokenExpiry: null,
			},
		})

		successResponse("Password reset successfully")
	} catch (e) {
		console.error("Error resetting password: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "POST",
	})
}
