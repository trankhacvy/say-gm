"use client"

import { useGrouppedDonations } from "@/hooks/use-donations"
import { getUserAvatar } from "@/utils/common"
import { formatCurrency } from "@/utils/currency"
import { useSession } from "next-auth/react"
import Image from "next/image"

export default function MySupporters() {
  const { data: session } = useSession()
  const { data: donations = [] } = useGrouppedDonations(String(session?.user.id))

  return (
    <div className="mx-auto w-full rounded-sm border border-gray-200 bg-white shadow-lg">
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 text-xs font-semibold uppercase">
              <tr>
                <th className="whitespace-nowrap p-2">
                  <div className="text-left font-semibold"></div>
                </th>
                <th className="whitespace-nowrap p-2">
                  <div className="text-left font-semibold">Wallet Address</div>
                </th>
                <th className="whitespace-nowrap p-2">
                  <div className="text-left font-semibold">Total amount</div>
                </th>
                <th className="whitespace-nowrap p-2">
                  <div className="text-center font-semibold">Number of donations</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {donations.map((supporter, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap p-2">
                    <div className="flex items-center">
                      <div className="mr-2 h-10 w-10 flex-shrink-0 sm:mr-3">
                        <Image
                          className="rounded-full"
                          src={getUserAvatar(supporter.donator ?? "")}
                          width="40"
                          height="40"
                          alt="user"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-2">
                    <div className="text-left">{supporter.donator}</div>
                  </td>
                  <td className="whitespace-nowrap p-2">
                    <div className="text-left font-medium text-green-500">
                      {formatCurrency(supporter.total_amount ?? 0)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-2">
                    <div className="text-center">{supporter.count_donation}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
