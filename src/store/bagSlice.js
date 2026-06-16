import { createSlice } from '@reduxjs/toolkit';

const bagSlice = createSlice({
  name: 'bag',
  initialState: {
    items: [],
  },
  reducers: {
    addToBag: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromBag: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter(i => i.id !== action.payload);
        } else {
          item.quantity -= 1;
        }
      }
    },
    clearBag: (state) => {
      state.items = [];
    },
  },
});

export const { addToBag, removeFromBag, increaseQuantity, decreaseQuantity, clearBag } = bagSlice.actions;

// Selectors
export const selectBagItems = (state) => state.bag.items;
export const selectBagCount = (state) =>
  state.bag.items.reduce((total, item) => total + item.quantity, 0);
export const selectBagTotal = (state) =>
  state.bag.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default bagSlice.reducer;
