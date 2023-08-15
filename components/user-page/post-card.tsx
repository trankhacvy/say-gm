"use client"

import dayjs from "dayjs"
import { HeartIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Database } from "../../types/supabase.types"
import { getUserAvatar } from "../../utils/common"
import { MembersChip, PublicChip, SupportersChip } from "../posts/post-chips"
import { AspectRatio } from "../ui/aspect-ratio"
import { Typography } from "../ui/typography"

type PostCardProps = {
  post: Database["public"]["Tables"]["tbl_posts"]["Row"]
  creator: { domain_name: string; wallet: string; profile_metadata: { avatar?: string } }
}

export default function PostCard({ post, creator }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.total_reactions || 0)

  const [isCollapsed, setIsCollapsed] = useState(true)
  const MAX_LENGTH = 200

  const displayedContent =
    isCollapsed && post.content.length > MAX_LENGTH ? post.content.slice(0, MAX_LENGTH) + "..." : post.content

  const handleToggleContent = () => {
    setIsCollapsed((prev) => !prev)
  }

  let imageUrl = ""
  if (post.image_urls && post.image_urls[0]) {
    imageUrl = post.image_urls[0]
  }
  const toggleHeart = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  return (
    <div className="w-3/4 rounded-2xl bg-white shadow-card">
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div className="flex items-center gap-4">
          <Image
            width={40}
            height={40}
            alt="profile"
            src={creator?.profile_metadata?.avatar ?? getUserAvatar(creator?.wallet ?? "A")}
            className="rounded-full"
          />
          <div className="flex-1">
            <Typography className="font-semibold">{creator.domain_name}</Typography>
            <Typography as="p" level="body5" className="mt-1" color="secondary">
              {dayjs(post.created_at).format("DD MMM YYYY")}
            </Typography>
          </div>
        </div>
        {post.audience === "members" && <MembersChip />}
        {post.audience === "supporters" && <SupportersChip />}
        {post.audience === "public" && <PublicChip />}
      </div>
      <div className="px-6 pb-2 pt-4">
        <Typography as="p" level="body4">
          {displayedContent}
          {post.content.length > MAX_LENGTH && (
            <span className="cursor-pointer text-blue-500" onClick={handleToggleContent}>
              {isCollapsed ? " More" : " Less"}
            </span>
          )}
        </Typography>
      </div>
      {imageUrl && (
        <div className="px-6 py-2">
          <AspectRatio>
            <Image className="rounded-xl" alt="profile" src={imageUrl} fill />
          </AspectRatio>
        </div>
      )}
      <div className="flex items-center justify-start px-6 pb-4 pt-2">
        <span className={`cursor-pointer ${liked ? "text-red-500" : "text-gray-400"}`} onClick={toggleHeart}>
          <HeartIcon fill={liked ? "#f04444" : "none"} stroke={liked ? "none" : "currentColor"} />
        </span>
        <span className="ml-2">{likes}</span>
      </div>
    </div>
  )
}
