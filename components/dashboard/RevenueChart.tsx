"use client"

import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Jan",
    Donation: 4000,
    Sales: 2400,
  },
  {
    name: "Feb",
    Donation: 3000,
    Sales: 1398,
  },
  {
    name: "Mar",
    Donation: 2000,
    Sales: 9800,
  },
  {
    name: "Apr",
    Donation: 2780,
    Sales: 3908,
  },
  {
    name: "May",
    Donation: 1890,
    Sales: 4800,
  },
  {
    name: "Jun",
    Donation: 2390,
    Sales: 3800,
  },
  {
    name: "July",
    Donation: 3490,
    Sales: 4300,
  },
  {
    name: "Aug",
    Donation: 2000,
    Sales: 9800,
  },
  {
    name: "Sep",
    Donation: 2780,
    Sales: 3908,
  },
  {
    name: "Oct",
    Donation: 1890,
    Sales: 4800,
  },
  {
    name: "Nov",
    Donation: 2390,
    Sales: 3800,
  },
  {
    name: "Dec",
    Donation: 3490,
    Sales: 4300,
  },
]

export default function RevenueChart() {
  return (
    <div className="flex h-[22rem] flex-1 flex-col rounded-sm border border-gray-200 bg-white p-4">
      <strong className="font-medium text-gray-700">Revenue</strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Donation" fill="#ea580c" />
            <Bar dataKey="Sales" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
