import {
	successResponse,
	internalServerErrorResponse,
	optionsResponse,
} from "@/helpers/apiHelper"

export async function GET() {
	try {
	return successResponse({ message: "The server is up and running!" })
	} catch (e) {
	console.error("Error getting post: ", e)
	return internalServerErrorResponse()
	}
}

export async function OPTIONS() {
	return optionsResponse({
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET",
	})
}
