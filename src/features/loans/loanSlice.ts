import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '@/types';

interface LoanState {
  items: Book[];
}

const initialState: LoanState = {
  items: [],
};

const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {
    addLoanItem: (state, action: PayloadAction<Book>) => {
      // Pastikan tidak ada duplikasi buku
      if (!state.items.find((item) => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeLoanItem: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearLoanItems: (state) => {
      state.items = [];
    },
  },
});

export const { addLoanItem, removeLoanItem, clearLoanItems } = loanSlice.actions;
export default loanSlice.reducer;