import React from "react"
import { SkinItem } from "../app/types"

type SkinCardProps = {
  item: SkinItem
}

const SkinCard = ({ item }: SkinCardProps) => {
  return (
    <div
      className={`p-4 bg-white ${item.ui_price > 10000 && "bg-red-200"} rounded-lg border`}
    >
      <div className="flex items-center justify-between">
        <div className="text-gray-900 font-medium">
          {item.i_market_hash_name}
        </div>
      </div>
      <div className="text-gray-600 bg-gray-200 text-xl">
        {item.ui_price} {item.ui_currency}
      </div>
      <div className="text-gray-500 mt-2">Quality: {item.i_quality}</div>
      <div className="text-gray-500 mt-1">Float: {item.ui_float}</div>
      <div className="text-gray-500 mt-1">Paint Seed: {item.ui_paintseed}</div>
    </div>
  )
}

export default SkinCard
