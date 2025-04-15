"use server";

import { CACHE_TAGS, dbCache, getUserTag } from "@/lib/cache";
import axios from "axios";

export const GetTransactions = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetTransactionsInternals, {
    tags: [getUserTag(userId, CACHE_TAGS.transaction)],
  });

  return cachedFn({ token, userId });
};

const GetTransactionsInternals = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaction/products/sold`,
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

export const GetSingleTransaction = async ({
  token,
  userId,
  transactionId,
}: {
  token: string;
  userId: string;
  transactionId: string;
}) => {
  const cachedFn = dbCache(GetSingleTransactionInternals, {
    tags: [getUserTag(userId, CACHE_TAGS.singleTransaction)],
  });

  return cachedFn({ token, userId, transactionId });
};

const GetSingleTransactionInternals = async ({
  token,
  userId,
  transactionId,
}: {
  token: string;
  userId: string;
  transactionId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaction/products/${transactionId}/sold`,
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
