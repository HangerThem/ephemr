"use client"

import { useSearchParams } from "next/navigation"
import { requestSearchPosts } from "@/services/api-services/searchService"
import {
	requestLikePost,
	requestUnlikePost,
} from "@/services/api-services/postService"
import { isError } from "@/utils/isError"
import PostCard from "@/components/postCard"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/authContext"
import PageLoader from "@/components/loaders/pageLoader"

export default function SearchPage() {
	const query = useSearchParams().get("q") || ""
	const { user, toggleModal } = useAuth()
	const [posts, setPosts] = useState<IPostSimple[] | null>(null)

	useEffect(() => {
	const fetchPosts = async () => {
		const response = await requestSearchPosts(query)

		if (isError(response)) {
		console.error(response.error)
		return
		}

		setPosts(response.posts)
	}

	fetchPosts()
	}, [query])

	return (
	<>
		{!posts ? (
		<PageLoader />
		) : posts.length === 0 ? (
		<p>No results found</p>
		) : (
		<div>
			{posts.map((post) => (
			<PostCard key={post.id} postData={post} />
			))}
		</div>
		)}
	</>
	)
}
