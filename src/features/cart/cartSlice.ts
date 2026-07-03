import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definisikan tipe data buku yang masuk keranjang
export interface CartItem {
  id: string | number;
  title: string;
  coverImage?: string;
  author?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [], // Default keranjang kosong
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Mencegah duplikasi buku yang sama di keranjang
      const isExist = state.items.some((item) => item.id === action.payload.id);
      if (!isExist) {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;