import React, { useState } from "react"
import {
  useGetSkinsAllowedForSaleQuery,
  useSetItemOnSellingByIdMutation,
} from "../services/skinsApi"
import { Spinner } from "../components/UI/Spinner"
import { DefaultButton } from "../components/UI/buttons/DefaultButton"

const UserInventory = () => {
  const { data: skinsForSale, isFetching } = useGetSkinsAllowedForSaleQuery()
  const [setSellingItem, { isLoading: isSaving }] = useSetItemOnSellingByIdMutation()
  const [sortDirection, setSortDirection] = useState("desc")
  const [selling, setSelling] = useState(null)
  const [newPrice, setNewPrice] = useState<string>("")

  const handleSavePrice = async (item: any) => {
    let price = parseFloat(newPrice) * 100
    let itemId = item.id
    console.log({ itemId, price })
    await setSellingItem({ itemId, price })
    setSelling(null)
  }

  const handleSell = (item: any) => {
    setSelling(item.id)
    setNewPrice(item.market_price)
  }

  if (isFetching) {
    return <Spinner />
  }

  const { items: itemsForSale } = skinsForSale

  const sortItems = (items: any, direction: any) => {
    return [...items].sort((a, b) => {
      const priceA = parseFloat(a.market_price)
      const priceB = parseFloat(b.market_price)
      return direction === "asc" ? priceA - priceB : priceB - priceA
    })
  }

  const toggleSortDirection = () => {
    setSortDirection(prevDirection =>
      prevDirection === "asc" ? "desc" : "asc",
    )
  }

  const sortedItems = sortItems(itemsForSale, sortDirection)

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Skin Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={toggleSortDirection}
              >
                Price {sortDirection === "asc" ? "↑" : "↓"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems &&
              sortedItems.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.market_hash_name}
                  </th>
                  <td className="px-6 py-4 w-1/2">
                    {selling === item.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newPrice}
                          onChange={e => setNewPrice(e.target.value)}
                          className="rounded-lg border border-blue-700 p-2 w-1/3"
                        />
                        <DefaultButton onClick={() => handleSavePrice(item)}>
                          {isSaving ? <Spinner /> : "Save price and send to market"}
                        </DefaultButton>
                        <DefaultButton onClick={() => setSelling(null)}>
                          Cancel
                        </DefaultButton>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-blue-700 p-2 flex items-center justify-between">
                        <span>{item.market_price} руб</span>
                        <DefaultButton onClick={() => handleSell(item)}>
                          sell
                        </DefaultButton>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default UserInventory
