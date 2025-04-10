"use server";

import { CACHE_TAGS, dbCache, getUserTag } from "@/lib/cache";
import axios from "axios";

export const GetSuppliers = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(getSuppliersInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.suppliers)],
  });

  return cachedFn({ token, userId });
};

const getSuppliersInternal = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/suppliers/all`,
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
