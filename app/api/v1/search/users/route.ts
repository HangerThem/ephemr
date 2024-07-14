import prisma from "@/helpers/prismaHelper"
import {
  successResponse,
  optionsResponse,
  internalServerErrorResponse,
} from "@/helpers/apiHelper"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {
  const query = decodeURIComponent(req.url.split("q=")[1])

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
                            
            },
          },
          {
            displayName: {
              contains: query,
            },
          },
        ],
      },
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
      orderBy: {
        username: "asc",
      },
      take: 5,
    })

    const response = users.map((user) => {
      const activityStatus = user?.settings?.activityStatus

      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        profilePic: user.profilePic,
        lastSeen: activityStatus ? user.lastSeen : null,
        online: activityStatus ? user.online : false,
      }
    })

    return successResponse({ users: response })
  } catch (e) {
    console.error("Error getting users: ", e)
    return internalServerErrorResponse()
  }
}

export async function OPTIONS(req: NextRequest, res: NextResponse) {
  return optionsResponse({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
  })
}
