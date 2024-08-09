import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
} from "@/helpers/apiHelper"
import { NextRequest, NextResponse } from "next/server"
import { convertEnumToObj } from "@/utils/enumUtils"
import { Theme } from "@prisma/client"

export async function GET(req: NextRequest, res: NextResponse) {
	try {
		const themes = convertEnumToObj(Theme)

		return successResponse({ themes })
	} catch (e) {
		console.error("Error getting themes: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS(req: NextRequest, res: NextResponse) {
	return optionsResponse({
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "*",
	})
}
