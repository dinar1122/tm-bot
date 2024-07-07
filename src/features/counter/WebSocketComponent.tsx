import React, { useEffect, useState, useRef } from "react"
import { useGetTokenWSQuery } from "../../services/skinsApi"
import { useDispatch, useSelector } from "react-redux"
import {
  selectSkins,
  selectSkinsStatus,
  setRecommendedPrice,
  setRecommendedPriceAndUpdate,
} from "./skinsSlice"
import { Button } from "flowbite-react"
import SkinCard from "../../components/SkinCard"

const WebSocketComponent = () => {
  const dispatch = useDispatch()
  const dataMatching = useSelector(selectSkins)
  const status = useSelector(selectSkinsStatus)

  const [storedLimits, setStoredLimits] = useState(
    JSON.parse(localStorage.getItem("priceLimits") || "{}"),
  )

  const abortControllers = useRef<{ [key: string]: AbortController }>({})

  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [matchedItems, setMatchedItems] = useState([])
  const { data: dataToken, isLoading, isError } = useGetTokenWSQuery()
  const targetItemNames = dataMatching.map(item => item.market_hash_name)

  const [isAutoUpdate, setIsAutoUpdate] = useState(true)

  const toggleUpdateMode = () => {
    setIsAutoUpdate(!isAutoUpdate)
  }

  const toggleWebSocket = () => {}

  useEffect(() => {
    if (!isLoading && !isError && dataToken) {
      const { token } = dataToken
      const ws = new WebSocket("wss://wsn.dota2.net/wsn/")

      ws.onopen = () => {
        console.log("WebSocket connection opened")
        setIsConnected(true)
        ws.send(token)
        ws.send("newitems_go")

        const pingInterval = setInterval(() => {
          ws.send("ping")
        }, 45000)

        ws.onclose = () => {
          clearInterval(pingInterval)
          console.log("WebSocket connection closed")
          setIsConnected(false)
        }
      }

      ws.onmessage = event => {
        const message = JSON.parse(event.data)
        const newItem = JSON.parse(message.data)

        setMessages(prevMessages => {
          const updatedMessages = [newItem, ...prevMessages]
          return updatedMessages.slice(0, 5)
        })

        if (targetItemNames.some(el => el === newItem.i_market_hash_name)) {
          const recommendedPrice = parseFloat(
            (newItem.ui_price - 0.02).toFixed(2),
          )
          console.log(newItem)
          const limitedPrice = storedLimits[newItem.i_market_hash_name]
          if ((limitedPrice < recommendedPrice) || limitedPrice === undefined) {

            const skin = dataMatching.find(item => item.market_hash_name === newItem.i_market_hash_name);

            console.log(abortControllers)
            if (skin) {
              const itemId = skin.item_id;
  
              if (abortControllers.current[itemId]) {
                abortControllers.current[itemId].abort();
                console.log(`ABORTED`, itemId);
              }

              const controller = new AbortController();
              abortControllers.current[itemId] = controller;
  
              if (isAutoUpdate) {
                dispatch(setRecommendedPriceAndUpdate({
                  hashName: newItem.i_market_hash_name,
                  recommendedPrice,
                  signal: controller.signal,
                }));
              } else {
                dispatch(setRecommendedPrice({ hashName: newItem.i_market_hash_name, recommendedPrice }));
              }
            }
          }
          setMatchedItems(prevMatchedItems => {
            const updatedMatchedItems = [newItem, ...prevMatchedItems]
            return updatedMatchedItems.slice(0, 5)
          })
        }
      }

      ws.onerror = error => {
        console.error("WebSocket error:", error)
      }

      return () => {
        ws.close()
      }
    }
  }, [isLoading, isError, dataToken])

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        History market
      </h1>
      <Button
        className="text-gray-600 border-blue-400 border-2"
        onClick={toggleUpdateMode}
      >
        {isAutoUpdate ? "Automatic Update Price" : "Manual Update Price"}
      </Button>
      <button onClick={toggleWebSocket}>
        {isConnected ? "Disconnect WebSocket" : "Connect WebSocket"}
      </button>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Connection status: {isConnected ? "Connected" : "Disconnected"}
      </p>
      <div className="space-x-4 flex-row h-[250px]">
        {messages.map((item: any, index) => (
          <SkinCard key={index} item={item} />
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-8">
        Matched Items
      </h2>
      <ul className="space-x-4 flex-row h-[250px]">
        {matchedItems.map((item: any, index) => (
          <SkinCard key={index} item={item} />
        ))}
      </ul>
    </div>
  )
}

export default WebSocketComponent
