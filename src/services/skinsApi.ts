import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ACCESS_TOKEN, API_KEY, BASE_URL } from "../constants"
import {
  AllowedToSaleItem,
  MarketItem,
  SetPriceRequest,
  Skin,
  setPriceResponse,
} from "../app/types"

const token_ls = localStorage.getItem("access_token")
export const skinsApi = createApi({
  reducerPath: "skinsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    getBalance: builder.query<
      { success: Boolean; money: number; currency: string },
      void
    >({
      query: () => ({
        url: `get-money?key=${API_KEY}`,
        method: "GET",
      }),
    }),
    getTokenWS: builder.query<any, void>({
      query: () => ({
        url: `get-ws-auth?key=${API_KEY}`,
        method: "GET",
      }),
    }),
    getPricesWithBuyOrders: builder.query<
      { success: Boolean; time: number; currency: String; items: MarketItem[] },
      any
    >({
      query: currency => ({
        url: `prices/${currency}.json`,
        method: "GET",
      }),
    }),
    getSkinsAllowedForSale: builder.query<
      { success: Boolean; items: AllowedToSaleItem[] },
      void
    >({
      query: () => ({
        url: `my-inventory/?key=${API_KEY}`,
        method: "GET",
      }),
    }),
    getSkinsOnSale: builder.query<{ success: Boolean; items: Skin[] }, void>({
      query: () => ({
        url: `items?key=${API_KEY}`,
        method: "GET",
      }),
    }),
    setNewPriceForItem: builder.mutation<setPriceResponse, SetPriceRequest>({
      query: ({ itemId, price }) => ({
        url: `set-price?key=${API_KEY}&item_id=${itemId}&price=${price}&cur=RUB`,
        method: "GET",
      }),
    }),
    setItemOnSellingById: builder.mutation<
      { succes: Boolean; item_id: String },
      SetPriceRequest
    >({
      query: ({ itemId, price }) => ({
        url: `add-to-sale?key=${API_KEY}&id=${itemId}&price=${price}&cur=RUB`,
        method: "GET",
      }),
    }),
    goOffline: builder.query<{ succes: Boolean }, void>({
      query: () => ({
        url: `go-offline?key=${API_KEY}`,
        method: "GET",
      }),
    }),
    removeAllItemsFromSale: builder.query<any, void>({
      query: () => ({
        url: `remove-all-from-sale?key=${API_KEY}`,
        method: "GET",
      }),
    }),
    pingSellingStatus: builder.mutation<
      { count: Number; success: Boolean },
      void
    >({
      query: () => {
        const requestBody = { access_token: `${token_ls}` }
        return {
          url: `ping-new?key=${API_KEY}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      },
    }),
  }),
})

export const {
  useGetBalanceQuery,
  useGetPricesWithBuyOrdersQuery,
  useLazyGetBalanceQuery,
  useGetSkinsAllowedForSaleQuery,
  useLazyGetSkinsAllowedForSaleQuery,
  useGetSkinsOnSaleQuery,
  useLazyGetSkinsOnSaleQuery,
  useSetNewPriceForItemMutation,
  useSetItemOnSellingByIdMutation,
  useGetTokenWSQuery,
  usePingSellingStatusMutation,
  useLazyGoOfflineQuery,
  useLazyRemoveAllItemsFromSaleQuery,
} = skinsApi
