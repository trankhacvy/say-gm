import { Typography } from "@/components/ui/typography"
import Post, { NewPostDialogButton } from "../../components/posts/post"

export default function PostPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="mb-6 flex items-center justify-between lg:mb-10">
        <Typography as="h4" level="h6" className="font-bold">
          Posts
        </Typography>
        <NewPostDialogButton />
      </div>
      <Post />
    </div>
  )
}
