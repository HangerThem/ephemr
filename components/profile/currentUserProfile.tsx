"use client"

import { useAuth } from "@/context/authContext"
import PageLoader from "../loaders/pageLoader"
import ProfileHeader from "./profileHeader"
import { useState, useEffect } from "react"
import { requestUserPosts } from "@/services/api-services/userService"
import { isError } from "@/utils/isError"
import UserProfilePosts from "./userProfilePosts"
import ProfileActions from "./profileActions"

export default function CurrentUserProfile() {
  const { user, loading } = useAuth()
  const [posts, setPosts] = useState<IPostSimple[]>([])

  useEffect(() => {
    if (!user) return

    const populateData = async () => {
      const postsResponse = await requestUserPosts(user.username)

      if (isError(postsResponse)) {
        return
      }

      setPosts(postsResponse.posts)
    }

    populateData()
  }, [user])

  if (!user || loading) {
    return <PageLoader />
  }

  return (
    <>
      <ProfileHeader user={user} />
      <ProfileActions currentUser userData={user} />
      <UserProfilePosts posts={posts} />
    </>
  )
}
