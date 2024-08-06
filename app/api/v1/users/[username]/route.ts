import prisma from "@/helpers/prismaHelper"
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	notFoundResponse,
} from "@/helpers/apiHelper"
import { NextRequest } from "next/server"

export async function GET(
	req: NextRequest,
	{ params }: { params: { username: string } }
) {
	try {
	const { username } = params

	const user = await prisma.user.findUnique({
		where: {
		username: username,
		},
		select: {
		id: true,
		username: true,
		displayName: true,
		profilePic: true,
		lastSeen: true,
		online: true,
		settings: {
			select: {
			activityStatus: true,
			},
		},
		mood: {
			select: {
			emoji: true,
			name: true,
			},
		},
		},
	})

	if (!user) {
		return notFoundResponse("User not found")
	}

	const activityStatus = user.settings?.activityStatus

	const response = {
		id: user.id,
		username: user.username,
		displayName: user.displayName,
		profilePic: user.profilePic,
		lastSeen: activityStatus ? user.lastSeen : null,
		online: activityStatus ? user.online : false,
		mood: user.mood,
	}

	return successResponse({ user: response })
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
