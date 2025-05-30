import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

type Product = 'BTC-USD' | 'ETH-USD' | 'XRP-USD' | 'LTC-USD';

interface Match {
  time: string;
  product_id: Product;
  side: 'buy' | 'sell';
  price: string;
  size: string;
}

interface WebSocketState {
  connected: boolean;
  subscriptions: Product[];
  prices: Record<Product, { bids: Record<string, string>; asks: Record<string, string> }>;
  matches: Record<Product, Match[]>;
  systemStatus: string[];
}

const initialState: WebSocketState = {
  connected: false,
  subscriptions: [],
  prices: {
    'BTC-USD': { bids: {}, asks: {} },
    'ETH-USD': { bids: {}, asks: {} },
    'XRP-USD': { bids: {}, asks: {} },
    'LTC-USD': { bids: {}, asks: {} }
  },
  matches: {
    'BTC-USD': [],
    'ETH-USD': [],
    'XRP-USD': [],
    'LTC-USD': []
  },

  systemStatus: []
};

const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    addSubscription(state, action: PayloadAction<Product>) {
      if (!state.subscriptions.includes(action.payload)) {
        state.subscriptions.push(action.payload);
      }
    },
    removeSubscription(state, action: PayloadAction<Product>) {
      state.subscriptions = state.subscriptions.filter((p) => p !== action.payload);
    },
    updatePrice(state, action: PayloadAction<{ product: Product; changes: [string, string, string][] }>) {
      const { product, changes } = action.payload;
      const book = state.prices[product] || { bids: {}, asks: {} };

      changes.forEach(([side, price, size]) => {
        if (side === 'buy') {
          if (size === '0') delete book.bids[price];
          else book.bids[price] = size;
        } else {
          if (size === '0') delete book.asks[price];
          else book.asks[price] = size;
        }
      });

      state.prices[product] = book;
    },
    addMatch(state, action: PayloadAction<{ product: Product; match: Match }>) {
      const existing = state.matches[action.payload.product] || [];
      state.matches[action.payload.product] = [action.payload.match, ...existing].slice(0, 50);
    },
    updateSystemStatus(
      state,
      action: PayloadAction<{ products: string[]; channels: string[] }>
    ) {
      const { products, channels } = action.payload;
      state.systemStatus = products
        .map((product) => channels.map((channel) => `${channel}: ${product}`))
        .flat();
    }
  }
});

export const {
  setConnected,
  addSubscription,
  removeSubscription,
  updatePrice,
  addMatch,
  updateSystemStatus
} = wsSlice.actions;

export default wsSlice.reducer;
