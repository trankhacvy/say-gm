"use client"

import React, { ReactNode } from "react"
import { IoCafeOutline, IoPieChart, IoPeople, IoCart } from "react-icons/io5"

export default function DashboardStatsGrid() {
  return (
    <div className="flex gap-4">
      <BoxWrapper>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500">
          <IoCafeOutline className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm font-light text-gray-500">Total Donations</span>
          <div className="flex items-center">
            <strong className="text-xl font-semibold text-gray-700">$24232</strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
          <IoCart className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm font-light text-gray-500">Total Sales</span>
          <div className="flex items-center">
            <strong className="text-xl font-semibold text-gray-700">$49432</strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600">
          <IoPieChart className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm font-light text-gray-500">Total Memberships</span>
          <div className="flex items-center">
            <strong className="text-xl font-semibold text-gray-700">3423</strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
          <IoPeople className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm font-light text-gray-500">Total Supporters</span>
          <div className="flex items-center">
            <strong className="text-xl font-semibold text-gray-700">1313</strong>
          </div>
        </div>
      </BoxWrapper>
    </div>
  )
}

interface BoxWrapperProps {
  children: ReactNode
}
function BoxWrapper({ children }: BoxWrapperProps) {
  return <div className="flex flex-1 items-center rounded-sm border border-gray-200 bg-white p-4">{children}</div>
}
