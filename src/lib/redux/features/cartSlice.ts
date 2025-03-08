import { CartItem, CartState } from "@/src/types/cart";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Get initial state from localStorage if available
const getInitialState = (): CartState => {
  if (typeof window !== "undefined") {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        return JSON.parse(storedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }
  return { items: [], loading: false };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state?.items?.find(
        (item) => item._id === newItem._id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state?.items?.push(newItem);
      }

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);

      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    clearCart: (state) => {
      state.items = [];

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setLoading,
} = cartSlice.actions;
export default cartSlice.reducer;
