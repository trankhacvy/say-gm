"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import SetupTab from "./setup-tab"
import MemberTab from "./member-tab"

export default function MembershipsTab() {
  return (
    <div>
      <Tabs defaultValue="setup" className="w-full rounded-2xl bg-white shadow-card">
        <TabsList className="boder-gray-500 w-full border-b">
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
