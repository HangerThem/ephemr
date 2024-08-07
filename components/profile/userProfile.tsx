"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/authContext"
import {
	requestUserFull,
	requestUserPosts,
	requestUserComments,
} from "@/services/api-services/userService"
import {
	requestFollowUser,
	requestUnfollowUser,
} from "@/services/api-services/followService"
import ContentActions from "./contentActions"
import PageLoader from "../loaders/pageLoader"
import { isError } from "@/utils/isError"
import { ProfileWrapper } from "@/components/profile/profileStyles"
import ProfileHeader from "./profileHeader"
import UserProfilePosts from "./userProfilePosts"
import UserProfileComments from "./userProfileComments"

interface UserProfileProps {
	username?: string
}

export default function UserProfile({ username }: UserProfileProps) {
	const { user: authUser, loading: authLoading } = useAuth()
	const [content, setContent] = useState<string>("posts")
	const [user, setUser] = useState<IUserFull | null>(null)
	const [posts, setPosts] = useState<IPostSimple[]>([])
	const [comments, setComments] = useState<IComment[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const populateData = async () => {
			let userData
			let postsResponse
			let commentsResponse

			if (username) {
				userData = await requestUserFull(username)
				postsResponse = await requestUserPosts(username)
				commentsResponse = await requestUserComments(username)
			} else if (authUser) {
				userData = await requestUserFull(authUser.username)
				postsResponse = await requestUserPosts(authUser.username)
				commentsResponse = await requestUserComments(authUser.username)
			}

			if (
				isError(userData) ||
				isError(postsResponse) ||
				isError(commentsResponse)
			) {
				setLoading(false)
				return
			}

			if (userData) {
				setUser(userData.user)
			}
			if (postsResponse) {
				setPosts(postsResponse.posts)
			}
			if (commentsResponse) {
				setComments(commentsResponse.comments)
			}
			setLoading(false)
		}

		populateData()
	}, [username, authUser])

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

		const response = await requestUserFull(user.username)

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

	if (loading || (!username && authLoading) || !user) {
		return <PageLoader />
	}

	return (
		<ProfileWrapper>
			<ProfileHeader
				user={user}
				refreshData={refreshData}
				currentUser={authUser?.username === user.username}
			/>
			<ContentActions setContent={setContent} content={content} />
			{content === "posts" && <UserProfilePosts posts={posts} />}
			{content === "comments" && <UserProfileComments comments={comments} />}
		</ProfileWrapper>
	)
}
