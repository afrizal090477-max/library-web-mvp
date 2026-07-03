import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import loanReducer from '@/features/loans/loanSlice';
import cartReducer from '@/features/cart/cartSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loan: loanReducer,
    cart: cartReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;