"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"
import { Database } from "@/types/supabase.types"
import PostCard from "./post-card"
import { AUDIENCE_OPTIONS_ENUM } from "../../utils/constants"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

type PostProps = {
  creator: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default function Post({ creator }: PostProps) {
  const { publicKey } = useWallet()
  const [posts, setPosts] = useState<Database["public"]["Tables"]["tbl_posts"]["Row"][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userAddress, setUserAddress] = useState<string>("")
  const [listLikedPosts, setListLikedPosts] = useState<number[]>([])

  useEffect(() => {
    getListPosts(publicKey?.toBase58())
    setUserAddress(publicKey?.toBase58() || "")
    getListLikedPosts(publicKey?.toBase58())
  }, [publicKey])

  const getListLikedPosts = async (userAddress?: string) => {
    if (!userAddress) return

    const likedPosts = await supabase.getLikedPostsByUser(userAddress)

    if (likedPosts) {
      setListLikedPosts(likedPosts.map((post) => post.post_id))
    }
  }

  const getListPosts = async (userAddress?: string) => {
    const audiences = [AUDIENCE_OPTIONS_ENUM.public]

    const donation = await supabase.getDonationInLastMonth(userAddress)
    console.log("donation", donation)

    if (donation) audiences.push(AUDIENCE_OPTIONS_ENUM.supporters)

    const myMemberShip = await supabase.findMyMembership(String(creator.id), userAddress)
    let mininumTier = 0
    if (myMemberShip && myMemberShip.dev_tbl_memberships.length > 0) {
      audiences.push(AUDIENCE_OPTIONS_ENUM.members)
      mininumTier = myMemberShip.price
    }

    console.log("mininumTier ", mininumTier)

    setIsLoading(false)

    const posts = await supabase.findPosts(String(creator.id), audiences, mininumTier)

    setPosts(posts)
  }

  return (
    <div className="flex w-full flex-col gap-6 lg:basis-3/5">
      <PostList
        creator={creator}
        posts={posts}
        isLoading={isLoading}
        userAddress={userAddress}
        listLikedPosts={listLikedPosts}
      />
    </div>
  )
}

const PostList = ({
  creator,
  posts,
  isLoading,
  userAddress,
  listLikedPosts,
}: {
  creator: Database["public"]["Tables"]["tbl_users"]["Row"]
  posts: Database["public"]["Tables"]["tbl_posts"]["Row"][]
  isLoading: boolean
  userAddress: string
  listLikedPosts: number[]
}) => {
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

    if (
      creator?.profile_metadata &&
      typeof creator.profile_metadata === "object" &&
      "avatar" in creator.profile_metadata
    ) {
      userAvatar = creator.profile_metadata.avatar?.toString() || ""
    }

    return (
      <PostCard
        key={post.id}
        creator={{
          domain_name: creator.domain_name || "",
          wallet: creator.wallet || "",
          profile_metadata: { avatar: userAvatar },
        }}
        userAddress={userAddress}
        post={post}
        isLiked={listLikedPosts?.includes(post.id) || false}
      />
    )
  })
}
