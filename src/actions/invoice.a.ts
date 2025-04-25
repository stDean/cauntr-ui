"use server";

import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import axios from "axios";

export const GetInvoices = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetInvoicesInternals, {
    tags: [getUserTag(userId, CACHE_TAGS.invoices)],
  });

  return cachedFn({ token, userId });
};

const GetInvoicesInternals = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice/all`,
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

export const GetInvoice = async ({
  token,
  userId,
  invoiceNo,
}: {
  token: string;
  userId: string;
  invoiceNo: string;
}) => {
  const cachedFn = dbCache(GetInvoicesInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.invoice)],
  });

  return cachedFn({ token, userId, invoiceNo });
};

const GetInvoicesInternal = async ({
  token,
  userId,
  invoiceNo,
}: {
  token: string;
  userId: string;
  invoiceNo: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice/${invoiceNo}`,
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

export const MarkAsPaid = async ({
  token,
  userId,
  invoiceNo,
  planId,
  paymentId,
}: {
  token: string;
  userId: string;
  invoiceNo: string;
  planId: string;
  paymentId: string;
}) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice/${invoiceNo}/${planId}/${paymentId}/markPaid`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.customers, userId });
      revalidateDbCache({ tag: CACHE_TAGS.debtors, userId });
      revalidateDbCache({ tag: CACHE_TAGS.suppliers, userId });
      revalidateDbCache({ tag: CACHE_TAGS.singleTransaction, userId });
      revalidateDbCache({ tag: CACHE_TAGS.transaction, userId });
      revalidateDbCache({ tag: CACHE_TAGS.categories, userId });
      revalidateDbCache({ tag: CACHE_TAGS.allProducts, userId });
      revalidateDbCache({ tag: CACHE_TAGS.inventoryStats });
      revalidateDbCache({ tag: CACHE_TAGS.inventoryProducts });
      revalidateDbCache({ tag: CACHE_TAGS.customer, userId });
      revalidateDbCache({ tag: CACHE_TAGS.debtor, userId });
      revalidateDbCache({ tag: CACHE_TAGS.invoices, userId });
    }

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

export const RecordPayment = async ({
  token,
  userId,
  invoiceNo,
  planId,
  data,
}: {
  token: string;
  userId: string;
  invoiceNo: string;
  planId: string;
  data: {
    amount: string;
    method: string;
    paymentMethod?: {
      acctNo: string;
      acctName: string;
      bankName: string;
      userBankId: string;
    };
  };
}) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice/${invoiceNo}/${planId}/recordPay`,
      { ...data },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.customers, userId });
      revalidateDbCache({ tag: CACHE_TAGS.debtors, userId });
      revalidateDbCache({ tag: CACHE_TAGS.suppliers, userId });
      revalidateDbCache({ tag: CACHE_TAGS.singleTransaction, userId });
      revalidateDbCache({ tag: CACHE_TAGS.transaction, userId });
      revalidateDbCache({ tag: CACHE_TAGS.categories, userId });
      revalidateDbCache({ tag: CACHE_TAGS.allProducts, userId });
      revalidateDbCache({ tag: CACHE_TAGS.inventoryStats });
      revalidateDbCache({ tag: CACHE_TAGS.inventoryProducts });
      revalidateDbCache({ tag: CACHE_TAGS.customer, userId });
      revalidateDbCache({ tag: CACHE_TAGS.debtor, userId });
      revalidateDbCache({ tag: CACHE_TAGS.invoices, userId });
    }

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

export const ResendInvoice = async ({
  token,
  invoiceNo,
}: {
  token: string;
  invoiceNo: string;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice/${invoiceNo}/resend`,
      {},
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

export const CreateInvoice = async ({
  token,
  userId,
  data,
}: {
  token: string;
  userId: string;
  data: any;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice/create`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.customers, userId });
      revalidateDbCache({ tag: CACHE_TAGS.debtors, userId });
      revalidateDbCache({ tag: CACHE_TAGS.suppliers, userId });
      revalidateDbCache({ tag: CACHE_TAGS.singleTransaction, userId });
      revalidateDbCache({ tag: CACHE_TAGS.transaction, userId });
      revalidateDbCache({ tag: CACHE_TAGS.categories, userId });
      revalidateDbCache({ tag: CACHE_TAGS.allProducts, userId });
      revalidateDbCache({ tag: CACHE_TAGS.inventoryStats });
      revalidateDbCache({ tag: CACHE_TAGS.inventoryProducts });
      revalidateDbCache({ tag: CACHE_TAGS.customer, userId });
      revalidateDbCache({ tag: CACHE_TAGS.debtor, userId });
      revalidateDbCache({ tag: CACHE_TAGS.invoices, userId });
    }

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
