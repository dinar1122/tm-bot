import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { skinsApi } from "../../services/skinsApi";

export type Skin = {
  item_id: string;
  market_hash_name: string;
  price: number;
  currency: string;
  status: string;
  recommendedPrice: number | null;
}

export type SkinsSliceState = {
  items: Skin[];
  status: "success" | "loading" | "failed";
}

const initialState: SkinsSliceState = {
  items: [],
  status: "success",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
//устранить проблему перехвата своей же цены
export const setRecommendedPriceAndUpdate  = createAsyncThunk<
  void,
  { hashName: string; recommendedPrice: number; signal: AbortSignal },
  { state: RootState }
>(
  "skinsOnSale/setRecommendedPriceAndUpdate",
  async ({ hashName, recommendedPrice, signal }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const skin = state.skinsOnSale.items.find(
      (skin) => skin.market_hash_name === hashName
    );

    if (skin && (skin.recommendedPrice === null || skin.recommendedPrice > recommendedPrice)) {
      if (skin.price > recommendedPrice) {
        dispatch(setRecommendedPrice({ hashName, recommendedPrice }));

        let success = false;
        while (!success) {
          console.log(signal.aborted)
          if (signal.aborted) {
            console.log('signal is aborted, exit the loop', recommendedPrice)
            success = true;
            break;
          }

          const response = await dispatch(
            skinsApi.endpoints.setNewPriceForItem.initiate({
              itemId: skin.item_id,
              price: recommendedPrice * 100,
            })
          );

          const { data } = response;
          if (data && data.success) {
            success = true;
          } else if (data && data.error === "too_often") {
            await delay(8000); 
          } else {
            success = true;
          }
        }
      }
    }
  }
);
export const skinsSlice = createSlice({
  name: "skins",
  initialState,
  reducers: {
    addSkin: (state, action: PayloadAction<Skin>) => {
      state.items.push(action.payload)
    },
    removeSkin: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(skin => skin.item_id !== action.payload)
    },
    setRecommendedPrice: (
      state,
      action: PayloadAction<{ hashName: string; recommendedPrice: number }>,
    ) => {
      const { hashName, recommendedPrice } = action.payload
      state.items.forEach(skin => {
        if (skin.market_hash_name === hashName) {
          if (
            skin.recommendedPrice === null ||
            skin.recommendedPrice > recommendedPrice 
          ) {
            if ((skin.price) > recommendedPrice) {skin.recommendedPrice = recommendedPrice}
            
          }
        }
      })
    },
    setSkins: (state, action: PayloadAction<Skin[]>) => {
      state.items = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        skinsApi.endpoints.getSkinsOnSale.matchFulfilled,
        (state, action: PayloadAction<{ items: Skin[] }>) => {
          state.status = "success"
          if (action.payload.items) {
            state.items = action.payload.items.map(skin => ({
              ...skin,
              recommendedPrice: null,
            }))
          }
        },
      )
      .addMatcher(
        skinsApi.endpoints.setNewPriceForItem.matchFulfilled,
        (state, action) => {
          const { originalArgs } = action.meta.arg
          if (originalArgs.price == 0) {
            state.items = state.items.filter(
              item => item.item_id !== originalArgs.itemId,
            )
          }
        },
      )
      
      .addMatcher(skinsApi.endpoints.removeAllItemsFromSale.matchFulfilled, state => {
        state.status = "success"
        state.items = []
      })
      .addMatcher(skinsApi.endpoints.getSkinsOnSale.matchPending, state => {
        state.status = "loading"
      })
      .addMatcher(skinsApi.endpoints.getSkinsOnSale.matchRejected, state => {
        state.status = "failed"
      })
  },
})

export const updatePriceThunk =
  ({ itemId, price }: { itemId: string; price: number }): AppThunk =>
  async (dispatch, getState) => {
    try {
      await dispatch(
        skinsApi.endpoints.setNewPriceForItem.initiate({ itemId, price }),
      )
    } catch (error) {
      console.error("Failed to update price: ", error)
    }
  }

export const { addSkin, removeSkin, setRecommendedPrice, setSkins } =
  skinsSlice.actions

export const selectSkins = (state: RootState) => state.skinsOnSale.items
export const selectSkinsStatus = (state: RootState) => state.skinsOnSale.status

export default skinsSlice.reducer
