import prisma from "@/helpers/prismaHelper"
import {
  internalServerErrorResponse,
  optionsResponse,
  successResponse,
  unauthorizedResponse,
  badRequestResponse,
  notFoundResponse,
} from "@/helpers/apiHelper"
import { generateNewTokens } from "@/utils/jwt"
import { verifyPassword } from "@/utils/bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { usernameOrEmail, password } = await req.json()
    if (!usernameOrEmail || !password) {
      return badRequestResponse("Missing required fields")
    }

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: usernameOrEmail,
          },
          {
            email: usernameOrEmail,
          },
        ],
      },
    })

    if (!userExists) {
      return notFoundResponse("User not found")
    }

    const passwordMatch = await verifyPassword(password, userExists.password)

    if (!passwordMatch) {
      return unauthorizedResponse("Invalid username or password")
    }

    const { token, newRefreshToken } = generateNewTokens(userExists.id)

    return successResponse({ token, refreshToken: newRefreshToken })
  } catch (e) {
    console.error("Error logging in: ", e)
    return internalServerErrorResponse()
  }
}

export async function OPTIONS() {
  return optionsResponse({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
  })
}
