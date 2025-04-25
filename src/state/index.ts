// import { ProductProps, UserProps } from "@/lib/types";
import { UserProps } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productName: string;
  price: string;
  qty: number;
  id: string;
  totalQty: number;
  sku: string;
}

export interface InitialStateTypes {
  token: "";
  email: "";
  loggedInUser: UserProps | null;
  previewProducts: any[];
  buyer: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
  } | null;
  bank: {
    id: string;
    bankName: string;
    acctNo: string;
    acctName: string;
  } | null;
  cartItems: CartItem[];
}

const initialState: InitialStateTypes = {
  token: "",
  email: "",
  loggedInUser: null,
  previewProducts: [],
  buyer: null,
  bank: null,
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
    SET_BANK: (state, action: PayloadAction<any>) => {
      state.bank = action.payload;
    },
    SET_CART: (state, action: PayloadAction<any>) => {
      if (action.payload && action.payload.id) {
        const exists = state.cartItems.some(
          (item) => item.id === action.payload.id
        );
        if (!exists) {
          state.cartItems = [...state.cartItems, action.payload];
        }
      }
    },
    DELETE_CART_ITEM: (state, action: PayloadAction<any>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
    },
    REMOVE_FROM_CART_QTY: (state, action: PayloadAction<{ id: string }>) => {
      state.cartItems = state.cartItems
        .map((item) => {
          if (item.id === action.payload.id) {
            const currentQty = item.qty;
            const unitPrice = parseFloat(item.price) / currentQty;
            const newQty = currentQty - 1;

            return {
              ...item,
              qty: newQty,
              price: (unitPrice * newQty).toFixed(2),
            };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    },
    ADD_TO_QUANTITY: (state, action: PayloadAction<{ id: string }>) => {
      state.cartItems = state.cartItems.map((item) => {
        if (item.id === action.payload.id) {
          const currentQty = item.qty;
          const unitPrice = parseFloat(item.price) / currentQty;
          const newQty = Math.min(currentQty + 1, item.totalQty);

          return {
            ...item,
            qty: newQty,
            price: (unitPrice * newQty).toFixed(2),
          };
        }
        return item;
      });
    },
    CLEAR_CART: (state) => {
      state.cartItems = [];
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
  ADD_TO_QUANTITY,
  DELETE_CART_ITEM,
  REMOVE_FROM_CART_QTY,
  CLEAR_CART,
  SET_BANK,
} = globalSlice.actions;

export default globalSlice.reducer;
