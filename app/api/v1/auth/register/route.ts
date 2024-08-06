import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	badRequestResponse,
	conflictResponse,
} from "@/helpers/apiHelper"
import { sendEmail } from "@/utils/emailUtils"
import { generateNewTokens } from "@/utils/jwt"
import { hashPassword } from "@/utils/bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, res: NextResponse) {
	try {
	const { email, username, displayName, password, passwordConfirm } =
		await req.json()
	if (!email || !username || !displayName || !password || !passwordConfirm) {
		return badRequestResponse("Missing required fields")
	}

	if (password !== passwordConfirm) {
		return badRequestResponse("Passwords do not match")
	}

	const usernameExists = await prisma.user.findUnique({
		where: {
		username,
		},
	})

	if (usernameExists) {
		return conflictResponse("Username already in use")
	}

	const emailExists = await prisma.user.findUnique({
		where: {
		email,
		},
	})

	if (emailExists) {
		return conflictResponse("Email already in use")
	}

	const hashedPassword = await hashPassword(password)
	const verificationCode = Math.floor(100000 + Math.random() * 900000)

	const user = await prisma.user.create({
		data: {
		email,
		username,
		displayName,
		password: hashedPassword,
		verificationCode,
		settings: {
			create: {},
		},
		userInformation: {
			create: {},
		},
		},
	})

	const returnLink = `${
		process.env.BASE_URL
	}/register/verify?email=${encodeURIComponent(
		email
	)}&code=${verificationCode}`

	await sendEmail({
		to: email,
		subject: "Verify your Ephemr account",
		text: `A new account has been created with the email ${email}. Please verify your account with the code ${verificationCode}. If you lost the page, you can return to the verification page by clicking this link: ${returnLink}. If you didn't initiate this action, please disregard this email or contact our support team at support@ephemr.net.`,
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
				.code-container {
				display: flex;
				justify-content: center;
				align-items: center;
				color: #3498db;
				font-size: 24px;
				letter-spacing: 8px;
				}
				.link {
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
				<h1>Welcome to Ephemr</h1>
				</div>
				<div class="content">
				<p>Hello ${username},</p>
				<p>A new account has been created with the email ${email}. Please use the verification code below to activate your account:</p>
				<div class="code-container">
					${verificationCode}
				</div>
				<p>If you lost the page, you can return to the verification page by clicking the link below:</p>
				<p><a href="${returnLink}" class="link">Verify Account</a></p>
				<p><i>If you didn't initiate this action, please disregard this email or contact our support team at <a href="mailto:support@ephemr.net" class="link">support@ephemr.net</a>.</i></p>
				</div>
			</div>
			</body>
		</html>
		`,
	})

	const { token, newRefreshToken } = generateNewTokens(user.id)

	return successResponse({ token, refreshToken: newRefreshToken })
	} catch (e) {
	console.error("Error registering user: ", e)
	return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST",
	})
}
