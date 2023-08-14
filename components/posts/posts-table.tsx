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
              return (
                <tr key={post.id}>
                  <td className="w-1/12 whitespace-nowrap p-2 text-center">{post.id}</td>
                  <td className="w-4/12 p-2">
                    <div className="text-left">
                      {post.content.length > 40 ? `${post.content.slice(0, 30)}...` : post.content}
                    </div>
                  </td>
                  <td className="w-2/12 whitespace-nowrap p-2">{AUDIENCE_OPTIONS_MAP[post.audience]}</td>
                  <td className="w-2/12 whitespace-nowrap p-2 text-center">{post.total_reactions}</td>
                  <td className="w-2/12 p-2">
                    {post.image_urls[0] && (
                      <div className="w-[80px]r">
                        <AspectRatio className="flex items-center justify-center overflow-hidden rounded-xl bg-gray-500/24">
                          <Image src={post.image_urls[0] ?? ""} fill alt={""} className="mx-auto object-contain" />{" "}
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
