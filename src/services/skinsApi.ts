import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '99nP6l7m8tZY6K3qEj20qgr2FvwwTP1';

export const skinsApi = createApi({
  reducerPath: 'skinsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://market.csgo.com/api/v2/' }),
  endpoints: (builder) => ({
    getBalance: builder.query<any, void>({
      query: () => ({
        url: `get-money?key=${API_KEY}`,
        method: 'GET',
      }),
    }),
    getTokenWS: builder.query<any, void>({
      query: () => ({
        url: `get-ws-auth?key=${API_KEY}`,
        method: 'GET',
      }),
    }),
    getPricesWithBuyOrders: builder.query<any, any>({
      query: (currency) => ({
        url: `prices/${currency}.json`,
        method: 'GET',
      }),
    }),
    getSkinsAllowedForSale: builder.query<any, void>({
      query: () => ({
        url: `my-inventory/?key=${API_KEY}`,
        method: 'GET',
      }),
    }),
    getSkinsOnSale: builder.query<any, void>({
      query: () => ({
        url: `items?key=${API_KEY}`,
        method: 'GET',
      }),
    }),
    setNewPriceForItem: builder.mutation<any, any>({
      query: ({itemId, price}) => ({
        url: `set-price?key=${API_KEY}&item_id=${itemId}&price=${price}&cur=RUB`,
        method: 'GET',
      }),
    }),
    setItemOnSellingById: builder.mutation<any, any>({
      query: ({itemId, price}) => ({
        url: `add-to-sale?key=${API_KEY}&id=${itemId}&price=${price}&cur=RUB`,
        method: 'GET',
      }),
    }),
  }),
});

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
} = skinsApi;
