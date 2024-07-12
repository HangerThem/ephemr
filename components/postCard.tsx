import styled from "styled-components"
import { Heart, HeartFill, Chat } from "react-bootstrap-icons"
import Link from "next/link"
import { timeSince } from "@/utils/timeSince"
import Avatar from "@/components/avatar"
import { formatCount } from "@/utils/formatCount"
import { formatContentForDisplay } from "@/utils/formatContentForDisplay"
import {
  requestLikePost,
  requestUnlikePost,
} from "@/services/api-services/postService"
import { isError } from "@/utils/isError"
import { useState, useOptimistic, startTransition } from "react"
import { useAuth } from "@/context/authContext"

const Card = styled.div`
  background-color: rgb(var(--dark));
  color: rgb(var(--light));
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(var(--light), 0.1);
  margin-bottom: 1rem;
  width: 600px;
  max-width: 100%;
`

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(var(--light));
  text-decoration: none;
`

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1rem;
    font-weight: 500;
  }

  p {
    font-size: 0.75rem;
    color: rgba(var(--light), 0.5);
  }
`

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`

const PostAction = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  justify-content: center;
  color: rgba(var(--light));
  background-color: rgba(var(--light), 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 1.5rem;
  transition: background-color 0.2s;

  span {
    width: 1rem;
    text-align: center;
  }

  &:hover {
    background-color: rgba(var(--light), 0.2);
  }
`

const PostContent = styled(Link)`
  margin-bottom: 1rem;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  white-space: normal;
  color: rgb(var(--light));

  a.hashtag,
  a.handle {
    color: rgb(var(--secondary));
  }
`

interface IPostSimpleCardProps {
  postData: IPostSimple
}

const PostCard = ({ postData }: IPostSimpleCardProps) => {
  const [post, setPost] = useState<IPostSimple>(postData)
  const { user, toggleModal } = useAuth()
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic<boolean>(
    post.isLiked || false
  )
  const [optimisticLikeCount, setOptimisticLikeCount] = useOptimistic<number>(
    post._count.postLike
  )

  const handleLike = (post: IPostSimple) => {
    if (!user) {
      toggleModal()
      return
    }

    startTransition(async () => {
      const newLikeCount = optimisticIsLiked
        ? optimisticLikeCount - 1
        : optimisticLikeCount + 1
      setOptimisticIsLiked(!optimisticIsLiked)
      setOptimisticLikeCount(newLikeCount)

      const response = optimisticIsLiked
        ? await requestUnlikePost(post.id)
        : await requestLikePost(post.id)

      if (isError(response)) {
        console.error(response)
        setOptimisticIsLiked(optimisticIsLiked)
        setOptimisticLikeCount(optimisticLikeCount)
        return
      }

      setPost(response.post)
    })
  }

  return (
    <Card>
      <Info>
        <ProfileLink href={`/${post.user.username}`}>
          <Avatar
            seed={post.user.displayName}
            size={30}
            online={post.user.online}
          />
          <ProfileWrapper>
            <h3>{post.user.displayName}</h3>
            <p>@{post.user.username}</p>
          </ProfileWrapper>
        </ProfileLink>
        <p>{timeSince(new Date(post.createdAt))}</p>
      </Info>
      {post.mood && <p>{post.mood.name}</p>}
      <PostContent href={`/post/${post.id}`}>
        {formatContentForDisplay(post.content)}
      </PostContent>
      <PostActions>
        <PostAction onClick={() => handleLike(post)}>
          {optimisticIsLiked ? <HeartFill /> : <Heart />}
          <span>{optimisticLikeCount}</span>
        </PostAction>
        <Link href={`/post/${post.id}`}>
          <PostAction>
            <Chat />
            <span>{formatCount(post._count.comments)}</span>
          </PostAction>
        </Link>
      </PostActions>
    </Card>
  )
}

export default PostCard
