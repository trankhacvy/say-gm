"use client"

import { PlusIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useMyPosts } from "@/hooks/use-my-posts"
import { NewPostDialog } from "./new-post-dialog"
import PostsTable from "./posts-table"
import { Button } from "../ui/button"

export default function Post() {
  const { data: authSession } = useSession()
  const { data: userPosts = [], isLoading } = useMyPosts(String(authSession?.user.id))

  return (
    <div className="space-y-5 pb-8 pt-4">
      <PostsTable isLoading={isLoading} userPosts={userPosts} />
    </div>
  )
}

export const NewPostDialogButton = () => {
  const { data: authSession } = useSession()
  const { mutate } = useMyPosts(String(authSession?.user.id))
  const [isOpen, setIsOpen] = useState(false)

  return (
    <NewPostDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSuccess={mutate}
      trigger={<Button endDecorator={<PlusIcon />}>New Post</Button>}
    />
  )
}
