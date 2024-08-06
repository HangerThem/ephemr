"use client"

import { useAuth } from "@/context/authContext"
import PageLoader from "@/components/loaders/pageLoader"
import Feed from "@/components/feed"

export default function Home() {
	const { loading } = useAuth()

	if (loading) {
	return <PageLoader />
	}

	return <Feed />
}
