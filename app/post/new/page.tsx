"use client"

import { useToast } from "@/context/toastContext"
import { requestCreatePost } from "@/services/api-services/postService"
import { Form, FormArea } from "@/components/forms/formStyles"
import { isError } from "@/utils/isError"
import { useRouter } from "next/navigation"
import Button from "@/components/buttons/button"
import { withAuth } from "@/hoc/withAuth"

function NewPost() {
  const { addToastNotification } = useToast()
  const router = useRouter()
  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      content: { value: string }
    }
    const content = target.content.value

    const response = await requestCreatePost(content)
    if (isError(response)) {
      return
    }

    addToastNotification({
      title: "Post created",
      description: "Your post has been successfully created",
      type: "success",
    })

    router.push(`/post/${response.post.id}`)
  }
  return (
    <Form onSubmit={handleCreatePost}>
      <FormArea name="content" placeholder="What's on your mind?" required />
      <Button type="submit">Post</Button>
    </Form>
  )
}

export default withAuth(NewPost)
