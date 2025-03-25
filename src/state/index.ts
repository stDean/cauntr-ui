// import { ProductProps, UserProps } from "@/lib/types";
import { UserProps } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  token: "";
  email: "";
  loggedInUser: UserProps | null;
  // previewProducts: [];
  // singleData: ProductProps | null;
}

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  token: "",
  email: "",
  loggedInUser: null,
  // previewProducts: [],
  // singleData: null,
  // user: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    SET_IS_SIDEBAR_COLLAPSE: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    SET_TOKEN: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
    },
    SET_EMAIL: (state, action: PayloadAction<any>) => {
      state.email = action.payload;
    },
    SET_LOGGED_IN_USER: (state, action: PayloadAction<any>) => {
      state.loggedInUser = action.payload;
    },
    // setPreviewProducts: (state, action: PayloadAction<any>) => {
    //   state.previewProducts = action.payload;
    // },
    // setSingleData: (state, action: PayloadAction<any>) => {
    //   state.singleData = action.payload;
    // },
  },
});

export const {
  SET_IS_SIDEBAR_COLLAPSE,
  SET_LOGGED_IN_USER,
  SET_TOKEN,
  SET_EMAIL,
  // setPreviewProducts,
  // setSingleData,
} = globalSlice.actions;

export default globalSlice.reducer;
