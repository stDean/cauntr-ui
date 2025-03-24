// import { ProductProps, UserProps } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  token: "";
  email: "";
  // previewProducts: [];
  // singleData: ProductProps | null;
  // user: UserProps | null;
}

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  token: "",
  email: "",
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
    // setPreviewProducts: (state, action: PayloadAction<any>) => {
    //   state.previewProducts = action.payload;
    // },
    // setSingleData: (state, action: PayloadAction<any>) => {
    //   state.singleData = action.payload;
    // },
    // setUser: (state, action: PayloadAction<any>) => {
    //   state.user = action.payload;
    // },
  },
});

export const {
  SET_IS_SIDEBAR_COLLAPSE,
  // setLoggedInUser,
  SET_TOKEN,
  SET_EMAIL,
  // setPreviewProducts,
  // setSingleData,
  // setUser,
} = globalSlice.actions;

export default globalSlice.reducer;
