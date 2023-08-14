"use client"

import { PlusIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useMyPosts } from "@/hooks/use-my-posts"
import { NewPostDialog } from "./new-post-dialog"
import PostsTable from "./posts-table"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

export default function Post() {
  const { data: authSession } = useSession()
  const { data: userPosts = [], isLoading, mutate } = useMyPosts(String(authSession?.user.id))

  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-3 px-4 py-6">
        <Skeleton className="h-5 w-1/2 rounded-xl" />
        <Skeleton className="h-5 w-1/2 rounded-xl" />
        <Skeleton className="h-5 w-1/2 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-8 pt-4">
      <div className="flex justify-end">
        <NewPostDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={mutate}
          trigger={<Button endDecorator={<PlusIcon />}>New Post</Button>}
        />
      </div>
      <div className="mx-auto w-full rounded-sm border border-gray-200 bg-white shadow-lg">
        <PostsTable userPosts={userPosts} />
      </div>
    </div>
  )
}
