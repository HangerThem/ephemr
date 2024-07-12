import {
  internalServerErrorResponse,
  optionsResponse,
  successResponse,
  badRequestResponse,
} from "@/helpers/apiHelper"
import { verifyRefreshToken, generateNewTokens } from "@/utils/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const refreshToken = req.headers.get("Authorization")?.split(" ")[1]
    if (!refreshToken) {
      return badRequestResponse("No refresh token provided")
    }

    try {
      const decoded = verifyRefreshToken(refreshToken)
      const { token, newRefreshToken } = generateNewTokens(decoded.id)
      return successResponse({ token, refreshToken: newRefreshToken })
    } catch (error) {
      return badRequestResponse("Invalid refresh token")
    }
  } catch (e) {
    console.error("Error refreshing tokens: ", e)
    return internalServerErrorResponse()
  }
}

export async function OPTIONS() {
  return optionsResponse({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
  })
}
