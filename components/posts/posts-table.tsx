"use client"

import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Edit } from "lucide-react"
import Image from "next/image"
import { AUDIENCE_OPTIONS_MAP } from "@/utils/constants"
import { Database } from "../../types/supabase.types"

type PostsTableProps = {
  userPosts: any[]
}

export default function PostsTable({ userPosts }: PostsTableProps) {
  return (
    <div className="overflow-x-auto p-3">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400">
          <tr>
            <th className="whitespace-nowrap p-2">
              <div className="text-left font-semibold">Id</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-left font-semibold">Content</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-left font-semibold">Audience</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-left font-semibold">Total Reactions</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-center font-semibold">Image</div>
            </th>
            <th className="whitespace-nowrap p-2">
              <div className="text-center font-semibold">Action</div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {userPosts &&
            userPosts.map((post: Database["public"]["Tables"]["tbl_posts"]["Row"], index: number) => {
              return (
                <tr key={post.id}>
                  <td className="whitespace-nowrap p-2">{post.id}</td>
                  <td className="p-2">
                    <div className="text-left">
                      {post.content.length > 40 ? `${post.content.slice(0, 30)}...` : post.content}
                    </div>
                  </td>
                  <td className="w-[180px] whitespace-nowrap p-2">{AUDIENCE_OPTIONS_MAP[post.audience]}</td>
                  <td className="w-[160px] whitespace-nowrap p-2">{post.total_reactions}</td>
                  <td className="w-[160px] p-2">
                    {post.image_urls[0] && (
                      <div className="w-[80px]r">
                        <AspectRatio className="flex items-center justify-center overflow-hidden rounded-xl bg-gray-500/24">
                          {" "}
                          {/* Adjusted here */}
                          <Image src={post.image_urls[0] ?? ""} fill alt={""} className="mx-auto object-contain" />{" "}
                          {/* Adjusted here */}
                        </AspectRatio>
                      </div>
                    )}
                  </td>
                  <td className="w-[30px] whitespace-nowrap p-2">
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
