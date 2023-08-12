"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import SetupTab from "./setup-tab"
import MemberTab from "./member-tab"

export default function MembershipsTab() {
  return (
    <div>
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="boder-gray-500 w-full rounded-t-2xl border-b bg-white shadow-card">
          <TabsTrigger className="px-3 py-4" value="setup">
            Setup
          </TabsTrigger>
          <TabsTrigger className="px-3 py-4" value="members">
            Members
          </TabsTrigger>
        </TabsList>
        <TabsContent value="setup">
          <SetupTab />
        </TabsContent>
        <TabsContent value="members">
          <MemberTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
