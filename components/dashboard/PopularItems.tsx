"use client"

import classNames from "classnames"
import React from "react"

const popularItems = [
  {
    id: "3432",
    product_name: "MS Excel Full Course A to Z",
    product_thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&h=120&q=80",
    product_price: "$149.00",
    product_stock: 341,
  },
  {
    id: "7633",
    product_name: "Piano Sheet Music",
    product_thumbnail:
      "https://plus.unsplash.com/premium_photo-1683121300880-cb796d397fb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&h=120&q=80",
    product_price: "$20.00",
    product_stock: 24,
  },
  {
    id: "6534",
    product_name: "Photography",
    product_thumbnail:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&h=120&q=80",
    product_price: "$10.00",
    product_stock: 56,
  },
  {
    id: "9234",
    product_name: "Solana cookbook for beginners",
    product_thumbnail:
      "https://images.unsplash.com/photo-1660062993674-c3830d07ca0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&h=120&q=80",
    product_price: "$259.00",
    product_stock: 98,
  },
  {
    id: "4314",
    product_name: "Blockchain technology explained PDF",
    product_thumbnail:
      "https://images.unsplash.com/photo-1623227413711-25ee4388dae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&h=120&q=80",
    product_price: "$99.00",
    product_stock: 0,
  },
]

function PopularItems() {
  return (
    <div className="w-full rounded-sm border border-gray-200 bg-white p-4">
      <strong className="font-medium text-gray-700">Popular Items</strong>
      <div className="mt-4 flex flex-col gap-3">
        {popularItems.map((item) => (
          <div key={item.id} className="flex items-start hover:no-underline">
            <div className="h-10 w-10 min-w-[2.5rem] rounded-sm bg-gray-200">
              <img
                className="h-full w-full rounded-sm object-cover"
                src={item.product_thumbnail}
                alt={item.product_name}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm text-gray-800">{item.product_name}</p>
              <span
                className={classNames(
                  item.product_stock === 0
                    ? "text-red-500"
                    : item.product_stock > 50
                    ? "text-green-500"
                    : "text-orange-500",
                  "text-xs font-medium"
                )}
              >
                {item.product_stock === 0 ? "Out of Stock" : item.product_stock + " in Stock"}
              </span>
            </div>
            <div className="pl-1.5 text-xs">{item.product_price}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PopularItems
