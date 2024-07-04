import React, { useState } from "react"
import {
  useGetBalanceQuery,
  useGetPricesWithBuyOrdersQuery,
  useLazyGetBalanceQuery,
} from "../services/skinsApi"
import { Pagination } from "./Pagination"
import { Spinner } from "./UI/Spinner"
import { useSelector } from "react-redux"
import { selectSkins } from "../features/counter/skinsSlice"

export const UserBalance = () => {

  


 
  const [currency, setCurrency] = useState("USD")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 70
  const {
    data: skins,
    error,
    isLoading,
  } = useGetPricesWithBuyOrdersQuery(currency)
  

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber)
  }

  if (isLoading) return <Spinner />
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        Error: {JSON.stringify(error)}
      </div>
    )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = skins?.items?.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil((skins?.items?.length || 0) / itemsPerPage)

  return (
    <div className="bg-gray-200 p-4 space-y-4">
      
      <div className="mb-4">
        <button
          onClick={() => setCurrency("USD")}
          className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
        >
          USD
        </button>
        <button
          onClick={() => setCurrency("EUR")}
          className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
        >
          EUR
        </button>
        <button
          onClick={() => setCurrency("RUB")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
        >
          RUB
        </button>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                skin name
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems &&
              currentItems.map((item: any, index: any) => (
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
                  <td className="px-6 py-4">
                    {item.price} {currency}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
