// import { ProductProps, UserProps } from "@/lib/types";
import { UserProps } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  token: "";
  email: "";
  loggedInUser: UserProps | null;
  previewProducts: any[] | []
  // previewProducts: [];
  // singleData: ProductProps | null;
}

const initialState: InitialStateTypes = {
  token: "",
  email: "",
  loggedInUser: null,
  previewProducts: []
  // previewProducts: [],
  // singleData: null,
  // user: null,
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
    SET_PREVIEW_DATA: (state, action: PayloadAction<any> ) => {
      state.previewProducts = action.payload
    }
    // setPreviewProducts: (state, action: PayloadAction<any>) => {
    //   state.previewProducts = action.payload;
    // },
    // setSingleData: (state, action: PayloadAction<any>) => {
    //   state.singleData = action.payload;
    // },
  },
});

export const {
  SET_LOGGED_IN_USER,
  SET_TOKEN,
  SET_EMAIL,
  SET_PREVIEW_DATA
  // setPreviewProducts,
  // setSingleData,
} = globalSlice.actions;

export default globalSlice.reducer;
