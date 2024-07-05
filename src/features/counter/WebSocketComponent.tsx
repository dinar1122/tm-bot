import React, { useEffect, useState, useRef } from "react";
import { useGetTokenWSQuery } from "../../services/skinsApi";
import { useDispatch, useSelector } from "react-redux";
import { selectSkins, selectSkinsStatus, setRecommendedPrice, setRecommendedPriceAndUpdate } from "./skinsSlice";
import { Button } from "flowbite-react";

const WebSocketComponent = () => {
  const dispatch = useDispatch();
  const dataMatching = useSelector(selectSkins);
  const status = useSelector(selectSkinsStatus);

  const [storedLimits, setStoredLimits] = useState(
    JSON.parse(localStorage.getItem("priceLimits") || "{}")
  )

  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [matchedItems, setMatchedItems] = useState([]);
  const { data: dataToken, isLoading, isError } = useGetTokenWSQuery();
  const targetItemNames = dataMatching.map(item => item.market_hash_name);


  const [isAutoUpdate, setIsAutoUpdate] = useState(true);

  const toggleUpdateMode = () => {
    setIsAutoUpdate(!isAutoUpdate);
  };

  const toggleWebSocket = () => {
    
  };

  useEffect(() => {
    if (!isLoading && !isError && dataToken) {
      const { token } = dataToken;
      const ws = new WebSocket('wss://wsn.dota2.net/wsn/');

      ws.onopen = () => {
        console.log('WebSocket connection opened');
        setIsConnected(true);
        ws.send(token);
        ws.send('newitems_go');

        const pingInterval = setInterval(() => {
          ws.send('ping');
        }, 45000);

        ws.onclose = () => {
          clearInterval(pingInterval);
          console.log('WebSocket connection closed');
          setIsConnected(false);
        };
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const newItem = JSON.parse(message.data);

        setMessages((prevMessages) => {
          const updatedMessages = [newItem, ...prevMessages];
          return updatedMessages.slice(0, 5);
        });

        if (targetItemNames.some(el => el === newItem.i_market_hash_name)) {
          const recommendedPrice = parseFloat((newItem.ui_price - 0.02).toFixed(2));
          console.log(storedLimits[newItem.i_market_hash_name], recommendedPrice)
          const limitedPrice = storedLimits[newItem.i_market_hash_name]
          if((limitedPrice < recommendedPrice) || limitedPrice === undefined) {
            if (isAutoUpdate) {
              dispatch(setRecommendedPriceAndUpdate({ hashName: newItem.i_market_hash_name, recommendedPrice }));
            } else {
              dispatch(setRecommendedPrice({ hashName: newItem.i_market_hash_name, recommendedPrice }));
            }
          }
          setMatchedItems((prevMatchedItems) => {
            const updatedMatchedItems = [newItem, ...prevMatchedItems];
            return updatedMatchedItems.slice(0, 5);
          });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        ws.close();
      };
    }
  }, [isLoading, isError, dataToken]);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">History market</h1>
      <Button className="text-gray-600 border-blue-400 border-2" onClick={toggleUpdateMode}>
        {isAutoUpdate ?  'Automatic Update Price' : 'Manual Update Price'}
      </Button>
      <button onClick={toggleWebSocket}>
        {isConnected ? 'Disconnect WebSocket' : 'Connect WebSocket'}
      </button>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Connection status: {isConnected ? 'Connected' : 'Disconnected'}
      </p>
      <div className="space-x-4 flex-row h-[250px]">
        {messages.map((item:any, index) => (
          <div key={index} className={`p-4 bg-white ${item.ui_price > 10000 && `bg-red-200`}  rounded-lg border`}>
            <div className="flex items-center justify-between">
              <div className="text-gray-900 dark:text-white font-medium">
                {item.i_market_hash_name}
              </div>
            </div>
            <div className="text-gray-600 dark:text-gray-400 bg-gray-200 text-xl">
              {item.ui_price} {item.ui_currency}
            </div>
            <div className="text-gray-500 dark:text-gray-400 mt-2">
              Quality: {item.i_quality}
            </div>
            <div className="text-gray-500 dark:text-gray-400 mt-1">
              Float: {item.ui_float}
            </div>
            <div className="text-gray-500 dark:text-gray-400 mt-1">
              Paint Seed: {item.ui_paintseed}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-8">Matched Items</h2>
      <ul className="space-y-4">
        {matchedItems.map((item:any, index) => (
          <li key={index} className="p-4 bg-red-100 dark:bg-red-800 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="text-gray-900 dark:text-white font-medium">
                {item.i_market_hash_name}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {item.ui_price} {item.ui_currency}
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400 mt-2">
              Quality: {item.i_quality}
            </div>
            <div className="text-gray-500 dark:text-gray-400 mt-1">
              Float: {item.ui_float}
            </div>
            <div className="text-gray-500 dark:text-gray-400 mt-1">
              Paint Seed: {item.ui_paintseed}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
