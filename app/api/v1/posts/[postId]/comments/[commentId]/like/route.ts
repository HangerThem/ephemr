import prisma from "@/helpers/prismaHelper"
import {
  internalServerErrorResponse,
  optionsResponse,
  successResponse,
  unauthorizedResponse,
  badRequestResponse,
  notFoundResponse,
} from "@/helpers/apiHelper"
import { verifyToken } from "@/utils/jwt"
import { NextRequest } from "next/server"
import { io } from "socket.io-client"

export async function POST(
  req: NextRequest,
  { params }: { params: { commentId: string } }
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

    const isUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    })

    if (!isUser) {
      return notFoundResponse("User not found")
    }

    const { commentId } = params

    const isComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        content: true,
        userId: true,
      },
    })

    if (!isComment) {
      return notFoundResponse("Comment not found")
    }

    const existingLike = await prisma.commentLike.findFirst({
      where: {
        commentId: commentId,
        userId: decoded.id,
      },
    })

    if (existingLike) {
      return badRequestResponse("User has already liked this comment")
    }

    await prisma.commentLike.create({
      data: {
        commentId: commentId,
        userId: decoded.id,
      },
    })

    const socketsTemp = await prisma.userSession.findMany({
      where: {
        userId: isComment.userId || undefined,
      },
      select: {
        socketId: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    })

    const sockets = socketsTemp.filter((socket) => socket.user.id !== decoded.id)

    const socketIo =
      sockets &&
      io(process.env.SOCKET_URL || "http://localhost:3000")

    socketIo.emit("post-like", {
      user: {
        username: isUser.username,
        displayName: isUser.displayName,
      },
      profilePic: isUser.profilePic,
      socketIds: sockets.map((socket) => socket.socketId),
      id: commentId,
    })

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            lastSeen: true,
            online: true,
            profilePic: true,
            settings: {
              select: {
                activityStatus: true,
              },
            },
          },
        },
        _count: {
          select: {
            commentLike: true,
          },
        },
      },
    })

    const activityStatus = comment?.user?.settings?.activityStatus

    const response = {
      ...comment,
      isLiked: true,
      user: {
        id: comment?.user?.id,
        username: comment?.user?.username,
        displayName: comment?.user?.displayName,
        lastSeen: activityStatus ? comment.user?.lastSeen : null,
        online: activityStatus ? comment.user?.online : false,
        profilePic: comment?.user?.profilePic,
      },
    }

    return successResponse({ comment: response })
  } catch (e) {
    console.error("Error liking comment: ", e)
    return internalServerErrorResponse()
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
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

    const isUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    })

    if (!isUser) {
      return notFoundResponse("User not found")
    }

    const { commentId } = params

    const isComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    })

    if (!isComment) {
      return notFoundResponse("Comment not found")
    }

    await prisma.commentLike.deleteMany({
      where: {
        commentId: commentId,
        userId: decoded.id,
      },
    })

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            lastSeen: true,
            online: true,
            profilePic: true,
            settings: {
              select: {
                activityStatus: true,
              },
            },
          },
        },
        _count: {
          select: {
            commentLike: true,
          },
        },
      },
    })

    const activityStatus = comment?.user?.settings?.activityStatus

    const response = {
      ...comment,
      isLiked: true,
      user: {
        id: comment?.user?.id,
        username: comment?.user?.username,
        displayName: comment?.user?.displayName,
        lastSeen: activityStatus ? comment.user?.lastSeen : null,
        online: activityStatus ? comment.user?.online : false,
        profilePic: comment?.user?.profilePic,
      },
    }

    return successResponse({ comment: response })
  } catch (e) {
    console.error("Error removing like on comment: ", e)
    return internalServerErrorResponse()
  }
}

export async function OPTIONS() {
  return optionsResponse({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, DELETE",
  })
}
