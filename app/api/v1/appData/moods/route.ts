import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	createdResponse,
	unauthorizedResponse,
	badRequestResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {
	try {
		const moods = await prisma.mood.findMany({
			select: {
				id: true,
				name: true,
				emoji: true,
				color: true,
			},
		})

		return successResponse({ moods })
	} catch (e) {
		console.error("Error getting moods: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS(req: NextRequest, res: NextResponse) {
	return optionsResponse({
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "*",
	})
}
