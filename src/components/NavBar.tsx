import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Navbar as FlowbiteNavbar } from "flowbite-react"
import {
  useGetBalanceQuery,
  useGetSkinsOnSaleQuery,
  useLazyGetBalanceQuery,
  useLazyGoOfflineQuery,
  usePingSellingStatusMutation,
} from "../services/skinsApi"
import ToggleSwitch from "./UI/ToggleSwitch"
import NavLink from "./UI/NavLink"
import { MdOutlineToken } from "react-icons/md"
import { DefaultButton } from "./UI/buttons/DefaultButton"
import DefaultInput from "./UI/DefaultInput"
import { FaRegQuestionCircle } from "react-icons/fa"
import DefaultLink from "./UI/DefaultLink"

export const Navbar = () => {
  useGetSkinsOnSaleQuery()
  const [pingSelling] = usePingSellingStatusMutation()
  const [stopSelling] = useLazyGoOfflineQuery()
  const [isSellingMode, setIsSellingMode] = useState(false)
  const [isEditingToken, setIsEditingToken] = useState(false)
  const [refetchBalance] = useLazyGetBalanceQuery()

  const [inputValue, setInputValue] = useState('')

  const [pingInterval, setPingInterval] = useState<any>(null)

  const { data: moneyBalance } = useGetBalanceQuery()

  useEffect(() => {
    const savedValue = localStorage.getItem('access_token')
    if (savedValue) {
      setInputValue(savedValue)
    }
  }, [])


  useEffect(() => {
    localStorage.setItem('access_token', inputValue)
  }, [inputValue])

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
          <li className="p-2 flex-row space-x-4">
            <ToggleSwitch
              type="checkbox"
              checked={isSellingMode}
              onChange={handleToggleSellingMode}
              label="SALES MODE"
            />
            {isEditingToken && (
              <div className="flex-row items-center space-x-2">
                <DefaultInput value={inputValue} onChange={(e:any)=>setInputValue(e.target.value)} placeholder={`acces_token`}></DefaultInput>
                <DefaultLink
                  to={`https://steamcommunity.com/pointssummary/ajaxgetasyncconfig`}
                >
                  <FaRegQuestionCircle className="text-2xl cursor-pointer" />
                </DefaultLink>
              </div>
            )}
            <DefaultButton
            isIcon
              onClick={() => {
                setIsEditingToken(prev => !prev)
              }}
            >
              <MdOutlineToken className="text-2xl cursor-pointer" />
            </DefaultButton>
          </li>
          <li className="items-center flex">
            <div className="items-center flex space-x-4">
              <span className="font-semibold text-lg ">
                BALANCE: {moneyBalance?.money}
              </span>
              <DefaultButton onClick={() => refetchBalance()}>
                Refetch
              </DefaultButton>
            </div>
          </li>
          <li className="items-center flex">
            <NavLink to="/prices">BEST PRICES</NavLink>
          </li>
          <li className="items-center flex">
            <NavLink to="/">INVENTORY</NavLink>
          </li>
          <li className="items-center flex">
            <NavLink to="/selling">SALES ITEMS</NavLink>
          </li>
          <li></li>
        </ul>
      </div>
    </FlowbiteNavbar>
  )
}
