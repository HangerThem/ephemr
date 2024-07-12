import PostCard from "../postCard"

const UserProfilePosts = ({ posts }: { posts: IPostSimple[] }) => {
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} postData={post} />
      ))}
    </div>
  )
}

export default UserProfilePosts
