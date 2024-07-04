import React from "react"
import { Link } from "react-router-dom"
import { Navbar as FlowbiteNavbar } from "flowbite-react"
import { useGetSkinsOnSaleQuery } from "../services/skinsApi"

export const Navbar = () => {

    const { data: dataSelling, isFetching } = useGetSkinsOnSaleQuery()

  return (
    <FlowbiteNavbar fluid={true} rounded={true} className="p-0">
      <div className="flex p-4 w-full">
        <ul className="font-medium flex flex-col  p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <Link
              to="/prices"
              className="block py-2 px-3 bg-gray-200 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              Price
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="block py-2 px-3 bg-gray-200 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              inventory
            </Link>
          </li>
          <li>
            <Link
              to="/selling"
              className="block py-2 px-3 bg-gray-200 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              on Sale items
            </Link>
          </li>
        </ul>
      </div>
    </FlowbiteNavbar>
  )
}
