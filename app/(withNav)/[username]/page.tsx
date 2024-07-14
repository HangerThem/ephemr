"use client"

import { useAuth } from "@/context/authContext"
import PageLoader from "@/components/loaders/pageLoader"
import CurrentUserProfile from "@/components/profile/currentUserProfile"
import UserProfile from "@/components/profile/userProfile"

export default function Profile({ params }: { params: { username: string } }) {
  const { user, loading } = useAuth()
  const username = params.username.toLowerCase()

  if (loading) {
    return <PageLoader />
  }

  if (user?.username === username) {
    return <CurrentUserProfile />
  }

  return <UserProfile username={username} />
}
