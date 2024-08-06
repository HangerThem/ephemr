"use client"

import { useState, useEffect } from "react"
import {
	requestUserFull,
	requestUserPosts,
} from "@/services/api-services/userService"
import {
	requestFollowUser,
	requestUnfollowUser,
} from "@/services/api-services/followService"
import PageLoader from "../loaders/pageLoader"
import { isError } from "@/utils/isError"
import ProfileHeader from "./profileHeader"
import ProfileActions from "./profileActions"
import UserProfilePosts from "./userProfilePosts"

interface UserProfileProps {
	username: string
}

export default function UserProfile({ username }: UserProfileProps) {
	const [user, setUser] = useState<IUserFull | null>(null)
	const [posts, setPosts] = useState<IPostSimple[]>([])

	useEffect(() => {
	const populateData = async () => {
		const response = await requestUserFull(username)
		const postsResponse = await requestUserPosts(username)

		if (isError(response) || isError(postsResponse)) {
		return
		}

		setUser(response.user)
		setPosts(postsResponse.posts)
	}

	populateData()
	}, [username])

	const refreshData = async (isFollowing: boolean) => {
	if (!user) return

	if (isFollowing) {
		setUser({
		...user,
		_count: { ...user._count, followers: user._count.followers - 1 },
		})
		await requestUnfollowUser(user.username)
	} else {
		setUser({
		...user,
		_count: { ...user._count, followers: user._count.followers + 1 },
		})
		await requestFollowUser(user.username)
	}

	const response = await requestUserFull(username)

	if (isError(response)) {
		if (isFollowing) {
		setUser({
			...user,
			_count: { ...user._count, followers: user._count.followers + 1 },
		})
		} else {
		setUser({
			...user,
			_count: { ...user._count, followers: user._count.followers - 1 },
		})
		}
		return
	}

	setUser(response.user)
	}

	if (!user) {
	return <PageLoader />
	}

	return (
	<>
		<ProfileHeader user={user} />
		<ProfileActions userData={user} refreshData={refreshData} />
		<UserProfilePosts posts={posts} />
	</>
	)
}
