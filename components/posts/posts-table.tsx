"use client"

import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Edit } from "lucide-react"
import Image from "next/image"
import { MembersChip, PublicChip, SupportersChip } from "./post-chips"
import { Database } from "../../types/supabase.types"

type PostsTableProps = {
  userPosts: any[]
}

export default function PostsTable({ userPosts }: PostsTableProps) {
  return (
    <div className="overflow-x-auto p-3">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 text-xs font-semibold uppercase">
          <tr>
            <th className="whitespace-nowrap p-2">
              <div className="text-center font-semibold">Id</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-center font-semibold">Content</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-center font-semibold">Audience</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-center font-semibold">Total Reactions</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-center font-semibold">Image</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-center font-semibold">Action</div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300 text-sm">
          {userPosts &&
            userPosts.map((post: Database["public"]["Tables"]["tbl_posts"]["Row"], index: number) => {
              let imageUrl = ""
              if (post.image_urls && post.image_urls[0]) {
                imageUrl = post.image_urls[0]
              }
              return (
                <tr key={post.id}>
                  <td className="w-1/12 whitespace-nowrap p-2 text-center">{post.id}</td>
                  <td className="w-4/12 p-2">
                    <div className="text-left">
                      {post.content.length > 60 ? `${post.content.slice(0, 50)}...` : post.content}
                    </div>
                  </td>
                  <td className="w-1/12 whitespace-nowrap p-2 text-center">
                    {post.audience === "members" && <MembersChip />}
                    {post.audience === "supporters" && <SupportersChip />}
                    {post.audience === "public" && <PublicChip />}
                  </td>
                  <td className="w-1/12 whitespace-nowrap p-2 text-center">{post.total_reactions}</td>
                  <td className="w-1/12 p-2">
                    {imageUrl && (
                      <div>
                        <AspectRatio className="flex items-center justify-center overflow-hidden rounded-xl bg-gray-500/24">
                          <Image src={imageUrl ?? ""} fill alt={""} className="mx-auto object-contain" />{" "}
                        </AspectRatio>
                      </div>
                    )}
                  </td>
                  <td className="w-1/12 whitespace-nowrap p-2">
                    <div className="flex items-center justify-center">
                      <Edit size={16} />
                    </div>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}
