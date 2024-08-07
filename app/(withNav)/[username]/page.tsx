"use client"

import { useAuth } from "@/context/authContext"
import PageLoader from "@/components/loaders/pageLoader"
import UserProfile from "@/components/profile/userProfile"

export default function Profile({ params }: { params: { username: string } }) {
	const { loading } = useAuth()
	const username = params.username.toLowerCase()

	if (loading) {
		return <PageLoader />
	}

	return <UserProfile username={username} />
}
