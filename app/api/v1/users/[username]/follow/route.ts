import prisma from "@/helpers/prismaHelper"
import {
  internalServerErrorResponse,
  optionsResponse,
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
} from "@/helpers/apiHelper"
import { verifyToken } from "@/utils/jwt"
import { NextRequest } from "next/server"
import { io } from "socket.io-client"

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
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

    const { username } = params

    const isUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    })

    if (!isUser) {
      return badRequestResponse("User not found")
    }

    const isUserFollower = await prisma.user.findUnique({
      where: {
        id: decoded.id,
        username: username,
      },
    })

    if (isUserFollower) {
      return badRequestResponse("You cannot follow yourself")
    }

    const follow = await prisma.follow.create({
      data: {
        follower: {
          connect: {
            id: decoded.id,
          },
        },
        followee: {
          connect: {
            username: username,
          },
        },
      },
    })

    const sockets = await prisma.userSession.findMany({
      where: {
        userId: follow.followeeId,
      },
      select: {
        socketId: true,
      },
    })

    const socketIo =
      sockets &&
      io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000")

    socketIo.emit("new-follow", {
      user: {
        username: isUser.username,
        displayName: isUser.displayName,
      },
      profilePic: isUser.profilePic,
      socketIds: sockets.map((s) => s.socketId),
    })

    return successResponse({ follow: follow })
  } catch (e) {
    console.error("Error getting user: ", e)
    return internalServerErrorResponse()
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
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

    const { username } = params

    const isUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    })

    if (!isUser) {
      return badRequestResponse("User not found")
    }

    const followee = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    })

    if (!followee) {
      return badRequestResponse("User not found")
    }

    const follow = await prisma.follow.delete({
      where: {
        followerId_followeeId: {
          followerId: decoded.id,
          followeeId: followee.id,
        },
      },
    })

    return successResponse({ follow: follow })
  } catch (e) {
    console.error("Error getting user: ", e)
    return internalServerErrorResponse()
  }
}

export async function OPTIONS() {
  return optionsResponse({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
  })
}
