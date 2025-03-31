"use server";

import { CACHE_TAGS, dbCache, getGlobalTag } from "@/lib/cache";
import axios from "axios";

// ===========================================================================================
// USERS
// ===========================================================================================
export const GetUser = async ({ token }: { token: string }) => {
  const cachedFn = dbCache(GetUserInternal, {
    tags: [getGlobalTag(CACHE_TAGS.user)],
  });

  return cachedFn({ token });
};

/// ===========================================================================================
// SUPPLIERS
// ===========================================================================================

/// ===========================================================================================
// CUSTOMERS
// ===========================================================================================

/// ===========================================================================================
// INTERNALS
// ===========================================================================================
export const GetUserInternal = async ({ token }: { token: string }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/user`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: res.data };
  } catch (e: any) {
    // Check if error response exists and handle different status codes
    if (e.response) {
      const status = e.response.status;
      const message = e.response.data?.message || "An error occurred";

      if (status === 400 || status === 429 || status === 500) {
        return { error: message };
      }
    }

    // Handle any other errors
    return { error: "Something went wrong." };
  }
};
