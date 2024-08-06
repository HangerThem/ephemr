import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	unauthorizedResponse,
	badRequestResponse,
	successResponse,
} from "@/helpers/apiHelper"
import { emailRegex } from "@/constants/emailRegex"
import { generateToken } from "@/utils/jwt"
import { sendEmail } from "@/utils/emailUtils"

export async function POST(req: any) {
	try {
	const { email } = await req.json()

	if (!email) {
		return badRequestResponse("Email is required")
	}

	if (!emailRegex.test(email)) {
		return badRequestResponse("Invalid email")
	}

	const user = await prisma.user.findUnique({
		where: {
		email,
		},
	})

	if (!user) {
		return successResponse("Email sent")
	}

	const token = generateToken({ payload: email, expiresIn: "1d" })

	await prisma.user.update({
		where: {
		email,
		},
		data: {
		resetToken: token,
		resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
		},
	})

	const resetLink = `${process.env.BASE_URL}/resetPassword/${token}`

	await sendEmail({
		to: email,
		subject: "Reset your Ephemr password",
		text: `A password reset has been requested for the account with the email ${email}. Please reset your password by clicking the link below.\n\n${resetLink}\n\nIf you didn't initiate this action, please disregard this email.`,
		html: `
		<!DOCTYPE html>
		<html lang="en">
			<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=K2D:wght@400&display=swap" rel="stylesheet">
			<style>
				body {
				font-family: 'K2D', Arial, sans-serif;
				background-color: #0c0c11;
				color: #fff;
				margin: 0;
				padding: 0;
				}
				.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				}
				.header {
				background-color: #212121;
				color: #3498db;
				text-align: center;
				padding: 20px 0;
				}
				.content {
				padding: 20px;
				background-color: #0c0c11;
				}
				.button {
				display: inline-block;
				cursor: pointer;
				color: #3498db;
				text-decoration: none;
				}
			</style>
			</head>
			<body>
			<div class="container">
				<div class="header">
				<h1>Reset your Ephemr password</h1>
				</div>
				<div class="content">
				<p>Hello ${user.username},</p>
				<p>A password reset has been requested for the account with the email ${email}. The link will expire in 24 hours. Please reset your password by clicking the link below.</p>
				<p>
					<a class="button" href="${resetLink}">Reset Password</a>
				</p>
				<p><i>If you didn't initiate this action, please disregard this email or contact our support team at <a href="mailto:support@ephemr.net" class="button">support@ephemr.net</a>.</i></p>
				</div>
			</div>
			</body>
		</html>
		`,
	})

	return successResponse({ message: "Email sent" })
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
