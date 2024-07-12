import { useState, useEffect } from "react"
import { requestGetPosts } from "@/services/api-services/postService"
import PostCard from "@/components/postCard"
import { isError } from "@/utils/isError"
import { useAuth } from "@/context/authContext"

export default function Feed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<IPostSimple[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await requestGetPosts()

      if (isError(response)) {
        return
      }

      setPosts(response.posts)
    }

    fetchPosts()
  }, [user])

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} postData={post} />
      ))}
    </>
  )
}
