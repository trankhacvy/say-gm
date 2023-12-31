"use client"

import { useGrouppedDonations } from "@/hooks/use-donations"
import { getUserAvatar } from "@/utils/common"
import { formatCurrency } from "@/utils/currency"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Skeleton } from "../ui/skeleton"
import { IconButton } from "../ui/icon-button"
import { MoreVerticalIcon } from "lucide-react"

export default function MySupporters() {
  const { data: session } = useSession()
  const { data: donations = [], isLoading } = useGrouppedDonations(String(session?.user.id))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Wallet Address</TableHead>
          <TableHead>Total amount</TableHead>
          <TableHead>Number of donations</TableHead>
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
        {donations.map((donation) => (
          <TableRow key={donation.donator}>
            <TableCell>
              <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                <Image
                  className="rounded-full"
                  src={getUserAvatar(donation.donator ?? "")}
                  width="40"
                  height="40"
                  alt="user"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{donation.donator}</TableCell>
            <TableCell className="font-medium">{formatCurrency(donation.total_amount ?? 0)}</TableCell>
            <TableCell className="font-medium">{donation.count_donation}</TableCell>
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
