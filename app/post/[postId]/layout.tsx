import { Metadata } from "next"
import prisma from "@/helpers/prismaHelper"

export async function generateMetadata({
  params,
}: Readonly<{
  params: any
}>): Promise<Metadata> {
  const id = params.postId

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    select: {
      content: true,
    },
  })

  if (!post) {
    return {
      title: "Post not found",
    }
  }

  const title =
    post.content.split("\n")[0].slice(0, 50) +
    (post.content.split("\n")[0].length > 50 ? "..." : "")

  return {
    title,
  }
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
