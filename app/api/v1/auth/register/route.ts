import prisma from "@/helpers/prismaHelper"
import {
  internalServerErrorResponse,
  optionsResponse,
  successResponse,
  badRequestResponse,
  conflictResponse,
} from "@/helpers/apiHelper"
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

    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName,
        password: hashedPassword,
        settings: {
          create: {},
        },
      },
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
