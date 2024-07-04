import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Navbar as FlowbiteNavbar } from "flowbite-react"
import {
    useGetBalanceQuery,
  useGetSkinsOnSaleQuery,
  useLazyGetBalanceQuery,
  useLazyGoOfflineQuery,
  usePingSellingStatusMutation,
} from "../services/skinsApi"
import ToggleSwitch from "./UI/ToggleSwitch"
import NavLink from "./UI/NavLink"

export const Navbar = () => {
  const { data: dataSelling, isFetching } = useGetSkinsOnSaleQuery()
  const [pingSelling] = usePingSellingStatusMutation()
  const [stopSelling] = useLazyGoOfflineQuery()
  const [isSellingMode, setIsSellingMode] = useState(false)
  const [refetchBalance] = useLazyGetBalanceQuery()

  const [pingInterval, setPingInterval] = useState<any>(null)

  const { data: moneyBalance } = useGetBalanceQuery()

  useEffect(() => {
    if (isSellingMode) {
      pingSelling()
      const interval = setInterval(() => {
        pingSelling()
      }, 170000)
      setPingInterval(interval)
    } else {
      if (pingInterval) {
        clearInterval(pingInterval)
        setPingInterval(null)
      }
      stopSelling()
    }

    return () => {
      if (pingInterval) {
        clearInterval(pingInterval)
      }
    }
  }, [isSellingMode])

  const handleToggleSellingMode = () => {
    setIsSellingMode(prev => !prev)
  }
  return (
    <FlowbiteNavbar fluid={true} rounded={true} className="p-0">
      <div className="flex p-4 w-full">
        <ul className="font-medium flex flex-col  p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li className="p-2">
            <ToggleSwitch
              type="checkbox"
              checked={isSellingMode}
              onChange={handleToggleSellingMode}
              label="Sale Mode"
            />
          </li>
          <li>
            <div >
              <span className="font-semibold text-lg">
                Balance: {moneyBalance?.money}
              </span>
              <button
                onClick={() => refetchBalance()}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Refetch
              </button>
            </div>
          </li>
          <li>
            <NavLink to="/prices">Price</NavLink>
          </li>
          <li>
            <NavLink to="/">inventory</NavLink>
          </li>
          <li>
            <NavLink to="/selling">on Sale items</NavLink>
          </li>
          <li></li>
        </ul>
      </div>
    </FlowbiteNavbar>
  )
}
