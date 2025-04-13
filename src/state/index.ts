// import { ProductProps, UserProps } from "@/lib/types";
import { UserProps } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productName: string;
  price: string;
  qty: string;
}

export interface InitialStateTypes {
  token: "";
  email: "";
  loggedInUser: UserProps | null;
  previewProducts: any[];
  buyer: { name: string; email?: string; phone: string } | null;
  cartItems: CartItem[];
}

const initialState: InitialStateTypes = {
  token: "",
  email: "",
  loggedInUser: null,
  previewProducts: [],
  buyer: null,
  cartItems: [],
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    SET_TOKEN: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
    },
    SET_EMAIL: (state, action: PayloadAction<any>) => {
      state.email = action.payload;
    },
    SET_LOGGED_IN_USER: (state, action: PayloadAction<any>) => {
      state.loggedInUser = action.payload;
    },
    SET_PREVIEW_DATA: (state, action: PayloadAction<any>) => {
      state.previewProducts = action.payload;
    },
    SET_BUYER: (state, action: PayloadAction<any>) => {
      state.buyer = action.payload;
    },
    SET_CART: (state, action: PayloadAction<any>) => {
      console.log("Previous cartItems:", state.cartItems); // Debug log
      state.cartItems = Array.isArray(state.cartItems)
        ? [...state.cartItems, action.payload]
        : [action.payload];
    },
  },
});

export const {
  SET_LOGGED_IN_USER,
  SET_TOKEN,
  SET_EMAIL,
  SET_PREVIEW_DATA,
  SET_BUYER,
  SET_CART,
} = globalSlice.actions;

export default globalSlice.reducer;
