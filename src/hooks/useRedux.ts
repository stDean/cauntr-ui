"use client";

import { useAppSelector } from "@/app/redux";

/**
 * A custom hook to access specific parts of the Redux state.
 *
 * This hook extracts and returns selected properties from the global state
 * managed by Redux. It uses the `useAppSelector` hook to access the state.
 *
 * @returns An object containing:
 * - `email`: The email address from the global state.
 * - `token`: The authentication token from the global state.
 */
export const useReduxState = () => {
  const { email, loggedInUser, token, previewProducts, buyer, cartItems } =
    useAppSelector(({ global }) => global);

  return { email, token, loggedInUser, previewProducts, buyer, cartItems };
};
