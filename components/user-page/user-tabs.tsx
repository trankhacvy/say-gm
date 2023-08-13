"use client"

import { useRouter, useParams, useSelectedLayoutSegments } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { useEffect, useState } from "react"
import { Database } from "@/types/supabase.types"

type UserTabsProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default function UserTabs({ user }: UserTabsProps) {
  const router = useRouter()
  const segments = useSelectedLayoutSegments()
  const params = useParams()

  const [activeTab, setActiveTab] = useState("tab1")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/users/${params?.username}/${value === "about" ? "/" : value}`)
  }

  useEffect(() => {
    if (segments.length === 0) {
      setActiveTab("about")
    } else {
      setActiveTab(segments[0])
    }
  }, [segments, setActiveTab])

  return (
    <Tabs defaultValue="about" value={activeTab} onValueChange={handleTabChange} className="mt-10 w-full">
      <TabsList className="w-full shadow-[rgba(145,158,171,0.24)_0px_-2px_0px_0px_inset]">
        <TabsTrigger className="px-3 py-4" value="about">
          About
        </TabsTrigger>
        <TabsTrigger className="px-3 py-4" value="membership">
          Membership
        </TabsTrigger>
        <TabsTrigger className="px-3 py-4" value="drops">
          Drops
        </TabsTrigger>
        <TabsTrigger className="px-3 py-4" value="posts">
          Posts
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
