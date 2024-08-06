import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	successResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { NextRequest, NextResponse } from "next/server"

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
