"use client"

import { Database } from "@/types/supabase.types"
import PostCard from "./post-card"
import SayGMForm from "./say-gm-form"
import { useCreatorPosts } from "../../hooks/use-creator-posts"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

type PostProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default function Post({ user }: PostProps) {
  return (
    <div className="flex w-full flex-col gap-6 lg:basis-3/5">
      <SayGMForm user={user} />
      <PostList user={user} id={String(user.id)} />
    </div>
  )
}

const PostList = ({ id, user }: { id: string; user: Database["public"]["Tables"]["tbl_users"]["Row"] }) => {
  const { data: posts = [], isLoading } = useCreatorPosts(id)

  if (isLoading || !posts) {
    return Array.from({ length: 10 }).map((_, idx) => (
      <div className="w-full rounded-2xl bg-white p-5 shadow-card" key={idx}>
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-1/3 rounded-xl" />
            <Skeleton className="mt-2 h-3 w-1/4 rounded-xl" />
          </div>
        </div>
      </div>
    ))
  }

  if (posts.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-white p-5 shadow-card">
        <span className="text-7xl">👋</span>
        <Typography className="mt-4 font-semibold" color="primary">
          No posts from creators yet. Check back later!
        </Typography>
      </div>
    )
  }

  return posts.map((post) => {
    let userAvatar = ""

    if (user?.profile_metadata && typeof user.profile_metadata === "object" && "avatar" in user.profile_metadata) {
      userAvatar = user.profile_metadata.avatar?.toString() || ""
    }

    return (
      <PostCard
        key={post.id}
        user={{
          domain_name: user.domain_name || "",
          wallet: user.wallet || "",
          profile_metadata: { avatar: userAvatar },
        }}
        post={post}
      />
    )
  })
}
