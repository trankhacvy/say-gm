"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useDrops } from "@/hooks/use-drops"
import { MEMBERSHIP_TIERS_TABLE } from "@/lib/supabase"
import dayjs from "dayjs"
import { IconButton } from "../ui/icon-button"
import { MoreVerticalIcon } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

export default function MyDrops() {
  const { data: session } = useSession()
  const { data: drops = [], isLoading } = useDrops(String(session?.user.id))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Num of NFTs</TableHead>
          <TableHead>Audience</TableHead>
          <TableHead>Start at</TableHead>
          <TableHead>End at</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <>
            <TableRow>
              <TableCell colSpan={3}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell colSpan={4}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
              <TableCell colSpan={4}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            </TableRow>
          </>
        )}
        {drops.map((drop) => (
          <TableRow key={drop.id}>
            <TableCell>
              <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                <Image alt={drop.name ?? ""} src={drop.image ?? ""} fill />
              </div>
            </TableCell>
            <TableCell className="font-medium">{drop.name}</TableCell>
            <TableCell className="font-medium">{drop.num_of_nfts}</TableCell>
            {/* @ts-ignore */}
            <TableCell className="font-medium">{drop[MEMBERSHIP_TIERS_TABLE].name}</TableCell>
            <TableCell className="font-medium">{dayjs(drop.start_at).format("DD/MM/YYYY")}</TableCell>
            <TableCell className="font-medium">{dayjs(drop.end_at).format("DD/MM/YYYY")}</TableCell>
            <TableCell className="font-medium">
              <IconButton size="sm">
                <MoreVerticalIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
