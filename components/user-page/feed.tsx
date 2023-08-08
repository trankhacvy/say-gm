import { Database } from "@/types/supabase.types"
import PostCard from "./post"

type FeedProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default async function Feed(_: FeedProps) {
  const posts = (await (await fetch("https://jsonplaceholder.typicode.com/posts")).json()) as {
    id: string
    title: string
    body: string
  }[]

  return (
    <div className="flex w-full flex-col gap-6 px-3 lg:w-2/3">
      {posts.map((post) => (
        <PostCard key={post.id} title={post.title} body={post.body} />
      ))}
    </div>
  )
}
