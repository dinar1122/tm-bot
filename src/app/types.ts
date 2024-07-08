export type Skin = {
    item_id: string;
    assetid: string;
    classid: string;
    instanceid: string;
    real_instance: string;
    market_hash_name: string;
    position: number;
    price: number;
    currency: string;
    status: string;
    live_time: number;
    left: number | null;
    botid: string;
    recommendedPrice: number | null ;
  }

  export type SkinItem = {
    i_quality: string;
    i_name_color: string;
    i_classid: string;
    i_instanceid: string;
    i_market_hash_name: string;
    i_market_name: string;
    ui_price: number;
    ui_currency: string;
    ui_id: string;
    ui_phase: string;
    ui_float: string;
    ui_paintseed: string;
    ui_paintindex: string;
    app: string;
  }
  export type AllowedToSaleItem = {
    id: string;
    classid: string;
    instanceid: string;
    market_hash_name: string;
    market_price: number;
    tradable: number;
  };
  export type MarketItem = {
    market_hash_name: string;
    volume: string;
    price: string;
  };
  export type setPriceResponse = {
    success: boolean;
    error?: string;
  };
  export type SetPriceRequest = {
    itemId: string;
    price: number;
  };