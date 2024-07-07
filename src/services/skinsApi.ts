import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ACCESS_TOKEN, BASE_URL } from '../constants';

const API_KEY = '99nP6l7m8tZY6K3qEj20qgr2FvwwTP1';

const token_ls = localStorage.getItem('access_token')
export const skinsApi = createApi({
  reducerPath: 'skinsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
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
    goOffline: builder.query<any, void>({
      query: () => ({
        url: `go-offline?key=${API_KEY}`,
        method: 'GET',
      }),
    }),
    removeAllItemsFromSale: builder.query<any, void>({
      query: () => ({
        url: `remove-all-from-sale?key=${API_KEY}`,
        method: 'GET',
      }),
    }),
    pingSellingStatus: builder.mutation<any, void>({
      query: () => {
        const requestBody = { access_token: `${token_ls}` };
    
        console.log('Request Body:', requestBody);
    
        return {
          url: `ping-new?key=${API_KEY}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        };
      },
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
  usePingSellingStatusMutation,
  useLazyGoOfflineQuery,
  useLazyRemoveAllItemsFromSaleQuery
} = skinsApi;
