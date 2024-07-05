import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  useLazyGetSkinsOnSaleQuery,
  useLazyRemoveAllItemsFromSaleQuery,
  useSetNewPriceForItemMutation,
} from "../services/skinsApi"
import { DefaultButton } from "./UI/buttons/DefaultButton"
import { Spinner } from "./UI/Spinner"
import WebSocketComponent from "../features/counter/WebSocketComponent"
import { selectSkins, selectSkinsStatus } from "../features/counter/skinsSlice"
import { Button } from "flowbite-react"
import { TiDelete } from "react-icons/ti"
import { Link } from "react-router-dom"
import { BASE_URL, BASE_URL_STEAMMARKET, BASE_URL_USER } from "../constants"
import DefaultLink from "./UI/DefaultLink"
import { MdOutlinePriceChange } from "react-icons/md"
import DefaultInput from "./UI/DefaultInput"
import { BiSave } from "react-icons/bi"

const ItemsOnSale = () => {
  const data = useSelector(selectSkins)
  const status = useSelector(selectSkinsStatus)

  const [storedLimits, setStoredLimits] = useState(
    JSON.parse(localStorage.getItem("priceLimits") || "{}"),
  )

  const [setNewPriceById] = useSetNewPriceForItemMutation()
  const [refetchItems] = useLazyGetSkinsOnSaleQuery()
  const [removeAllItems] = useLazyRemoveAllItemsFromSaleQuery()
  const [editingPrice, setEditingPrice] = useState(null)
  const [editingPriceLimit, setEditingPriceLimit] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [priceLimit, setPriceLimit] = useState("")

  useEffect(() => {
    refetchItems()
  }, [])

  useEffect(() => {
    if (editingPriceLimit) {
      setPriceLimit(storedLimits[editingPriceLimit] || "")
    }
  }, [editingPriceLimit])

  const handleSavePriceLimit = () => {
    storedLimits[editingPriceLimit] = priceLimit
    localStorage.setItem("priceLimits", JSON.stringify(storedLimits))
    setEditingPriceLimit("")
  }

  if (status === "loading") {
    return <Spinner />
  }

  if (!data?.length) {
    return <div>No items on sale</div>
  }

  const itemsOnSale = data

  const handleEditPrice = item => {
    setEditingPrice(item.assetid)
    if (editingPrice === item.assetid) {
      setEditingPrice(null)
    } else {
      setEditingPrice(item.assetid)
    }
    setNewPrice(item.price)
  }

  const handleEditPriceLimit = item => {
    if (editingPriceLimit === item.market_hash_name) {
      setEditingPriceLimit(null)
    } else {
      setEditingPriceLimit(item.market_hash_name)
    }
  }

  const handleSavePrice = item => {
    const price = parseFloat(newPrice) * 100
    const itemId = item.item_id
    setNewPriceById({ itemId, price })
    setEditingPrice(null)
  }

  const handleRemoveFromMarket = item => {
    const price = 0
    const itemId = item.item_id
    setNewPriceById({ itemId, price })
  }

  const handleRemoveAllFromMarket = () => {
    removeAllItems()
  }

  const handleSaveRecommenendedPrice = item => {
    const price = parseFloat(item.recommendedPrice) * 100
    const itemId = item.item_id
    setNewPriceById({ itemId, price })
    setEditingPrice(null)
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex p-3 space-x-3">
        <DefaultButton onClick={refetchItems}>Refetch</DefaultButton>
        <DefaultButton onClick={handleRemoveAllFromMarket}>
          Remove all items from market
        </DefaultButton>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Asset ID
            </th>
            <th scope="col" className="px-6 py-3">
              Market Hash Name
            </th>
            <th scope="col" className="px-6 py-3">
              Links
            </th>
            <th scope="col" className="px-6 py-3">
              Position
            </th>
            <th scope="col" className="px-6 py-3">
              Price (RUB)
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {itemsOnSale.map((item: any) => (
            <tr
              key={item.assetid}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {item.assetid}
              </th>
              <td className="px-6 py-4 text-xl text-gray-700 font-semibold">
                {item.market_hash_name}
              </td>
              <td className="px-6 py-4 flex flex-col">
                <DefaultLink
                  to={`${BASE_URL_USER}item/${item.classid}-${item.instanceid}-${item.market_hash_name}`}
                >
                  Market.tm
                </DefaultLink>
                <DefaultLink
                  to={`${BASE_URL_STEAMMARKET}${item.market_hash_name}`}
                >
                  STEAM
                </DefaultLink>
              </td>

              <td className="px-6 py-4">{item.position}</td>
              <td className="px-6 py-4">
                {editingPrice === item.assetid ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newPrice}
                      onChange={e => setNewPrice(e.target.value)}
                      className="rounded-lg border border-blue-700 p-2 mr-2"
                    />
                    <DefaultButton onClick={() => handleSavePrice(item)}>
                      Save price
                    </DefaultButton>
                  </div>
                ) : (
                  <div className="rounded-lg border border-blue-700 p-2 text-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-[150px] bg-blue-200 items-center p-2 selft-center rounded-lg">
                        {item.price} rub
                      </span>
                      {storedLimits[item.market_hash_name] && (
                        <span className=" bg-red-200 items-center p-2 selft-center rounded-lg">
                          Lim [{storedLimits[item.market_hash_name]}]
                        </span>
                      )}
                      {editingPriceLimit === item.market_hash_name && (
                        <>
                          <DefaultInput
                            value={priceLimit}
                            onChange={e => setPriceLimit(e.target.value)}
                          />
                          <DefaultButton isIcon onClick={handleSavePriceLimit}>
                            <BiSave className="text-3xl" />
                          </DefaultButton>
                        </>
                      )}
                      <DefaultButton
                        isIcon
                        onClick={() => handleEditPriceLimit(item)}
                      >
                        <MdOutlinePriceChange className="text-3xl" />
                      </DefaultButton>
                    </div>
                    <div className="flex items-center justify-between space-x-3">
                      {item.recommendedPrice && (
                        <>
                          <span className="w-[150px] items-center p-2 selft-center rounded-lg bg-green-200">
                            {item.recommendedPrice} rub
                          </span>
                          <Button
                            className="text-green-600 border-2 border-green-400"
                            onClick={() => handleSaveRecommenendedPrice(item)}
                          >
                            set lowest price
                          </Button>
                        </>
                      )}
                      <DefaultButton onClick={() => handleEditPrice(item)}>
                        Change price
                      </DefaultButton>
                      <TiDelete
                        type="button"
                        onClick={() => handleRemoveFromMarket(item)}
                        className="text-black text-5xl text-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <WebSocketComponent />
    </div>
  )
}

export default ItemsOnSale
