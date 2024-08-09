import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
} from "@/helpers/apiHelper"
import { NextRequest, NextResponse } from "next/server"
import { convertEnumToObj } from "@/utils/enumUtils"
import { Language } from "@prisma/client"

export async function GET(req: NextRequest, res: NextResponse) {
	try {
		const languages = convertEnumToObj(Language)

		return successResponse({ languages })
	} catch (e) {
		console.error("Error getting languages: ", e)
		return internalServerErrorResponse()
	}
}

export async function OPTIONS(req: NextRequest, res: NextResponse) {
	return optionsResponse({
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "*",
	})
}
