import { verifyToken } from "@/utils/jwt"
import {
	createdResponse,
	internalServerErrorResponse,
	optionsResponse,
	unauthorizedResponse,
	badRequestResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { put, del, list } from "@vercel/blob"
import prisma from "@/helpers/prismaHelper"
import { NextRequest } from "next/server"
import sharp from "sharp"

const MAX_FILE_SIZE = 1024 * 1024

export async function PATCH(req: NextRequest) {
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

		const isUser = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (!isUser) {
			return notFoundResponse("User not found")
		}

		const formData = await req.formData()
		let profilePic = formData.get("profilePic")

		if (!profilePic || !(profilePic instanceof File)) {
			return badRequestResponse("No file provided or invalid file type")
		}

		let convertedProfilePic = await sharp(await profilePic.arrayBuffer())
			.resize({
				width: 200,
				height: 200,
				fit: "cover",
			})
			.png()
			.toBuffer()

		if (convertedProfilePic.byteLength > MAX_FILE_SIZE) {
			return badRequestResponse("File size too large")
		}

		const { name: filename } = profilePic

		const path = `users/${decoded.id}/profilePic/${filename}`

		const { url } = await put(path, convertedProfilePic, {
			access: "public",
		})

		await prisma.user.update({
			where: {
				id: decoded.id,
			},
			data: {
				profilePic: url,
			},
		})

		return createdResponse("Profile picture uploaded")
	} catch (e) {
		console.error("Error uploading profile picture: ", e)
		return internalServerErrorResponse()
	}
}

export async function DELETE(req: NextRequest) {
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

		const isUser = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (!isUser) {
			return notFoundResponse("User not found")
		}

		const listResult = await list({
			limit: 1000,
		})

		listResult.blobs.filter((blob) =>
			blob.pathname.startsWith(`users/${decoded.id}/profilePic`)
		)

		await del(listResult.blobs.map((blob) => blob.url))

		await prisma.user.update({
			where: {
				id: decoded.id,
			},
			data: {
				profilePic: null,
			},
		})

		return createdResponse("Profile picture deleted")
	} catch (e) {
		console.error("Error deleting profile picture: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
		"Access-Control-Allow-Methods": "PATCH, OPTIONS",
	})
}
