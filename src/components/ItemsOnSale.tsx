import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLazyGetSkinsOnSaleQuery, useSetNewPriceForItemMutation } from "../services/skinsApi"
import { DefaultButton } from "./UI/buttons/DefaultButton"
import { Spinner } from "./UI/Spinner"
import WebSocketComponent from "../features/counter/WebSocketComponent"
import { selectSkins, selectSkinsStatus } from "../features/counter/skinsSlice"
import { Button } from "flowbite-react"
import { TiDelete } from "react-icons/ti"

const ItemsOnSale = () => {
  const data = useSelector(selectSkins)
  const status = useSelector(selectSkinsStatus)
  const dispatch = useDispatch()

  const [setNewPriceById] = useSetNewPriceForItemMutation()
  const [refetchItems] = useLazyGetSkinsOnSaleQuery()
  const [editingPrice, setEditingPrice] = useState(null)
  const [newPrice, setNewPrice] = useState("")

  if (status === "loading") {
    return <Spinner />
  }

  if (!data?.length) {
    return <div>No items on sale</div>
  }

  const itemsOnSale = data

  const handleEditPrice = (item: any) => {
    setEditingPrice(item.assetid)
    setNewPrice(item.price)
  }

  const handleSavePrice = (item: any) => {
    let price = parseFloat(newPrice) * 100
    let itemId = item.item_id
    setNewPriceById({ itemId, price })
    setEditingPrice(null)
  }

  const handleRemoveFromMarket = (item: any) => {
    console.log(1)
    let price = 0
    let itemId = item.item_id
    setNewPriceById({ itemId, price })
  }
  const handleSaveRecommenendedPrice = (item: any) => {
    let price = parseFloat(item.recommendedPrice) * 100
    let itemId = item.item_id
    console.log({ itemId, price })
    /* setNewPriceById({ itemId, price }) */
    setEditingPrice(null)
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex p-3 space-x-3">
        <DefaultButton
          onClick={() => {
            refetchItems()
          }}>Refetch</DefaultButton>
        <DefaultButton>Remove all items from market</DefaultButton>
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
              <td className="px-6 py-4">{item.market_hash_name}</td>
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
                    <span>{item.price} руб</span>
                    {item.recommendedPrice && <><span>{item.recommendedPrice} руб</span>
                    <Button className="text-green-600 border-2 border-green-400" onClick={() => handleSaveRecommenendedPrice(item)}>
                      set lowest price
                    </Button></>}
                    <DefaultButton onClick={() => handleEditPrice(item)}>
                      Change price
                    </DefaultButton>
                    <TiDelete type="button" onClick={()=>handleRemoveFromMarket(item)} className="text-black text-5xl text-blue-500 cursor-pointer" />
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <WebSocketComponent ></WebSocketComponent>
    </div>
  )
}

export default ItemsOnSale
