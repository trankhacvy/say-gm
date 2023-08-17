"use client"

import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

type PieData = {
  name: string
  value: number
}
const data: PieData[] = [
  { name: "Diamond", value: 540 },
  { name: "Gold", value: 620 },
  { name: "Silver", value: 210 },
  { name: "Bronze", value: 110 },
]

const RADIAN = Math.PI / 180
const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#6050DC"]

type LabelProps = {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function MembershipPieChart() {
  return (
    <div className="flex w-full flex-col rounded-sm border border-gray-200 bg-white p-4 sm:h-[22rem] sm:w-[20rem]">
      <strong className="font-medium text-gray-700">Membership</strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={105}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
