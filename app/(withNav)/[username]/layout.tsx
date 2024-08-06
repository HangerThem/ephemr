import { Metadata } from "next"
import prisma from "@/helpers/prismaHelper"

export async function generateMetadata({
	params,
}: Readonly<{
	params: any
}>): Promise<Metadata> {
	const username = params.username.toLowerCase()

	const user = await prisma.user.findUnique({
	where: {
		username: username,
	},
	select: {
		username: true,
		displayName: true,
	},
	})

	if (!user) {
	return {
		title: "User not found",
	}
	}

	return {
	title: `${user.displayName} • @${user.username}`,
	}
}

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return children
}
