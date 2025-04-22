"use server";

import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { AddCustomerSchema, AddSupplierSchema } from "@/schema";
import axios from "axios";
import { z } from "zod";

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

export const CreateCustomer = async ({
  token,
  userId,
  userData,
}: {
  token: string;
  userId: string;
  userData: z.infer<typeof AddCustomerSchema>;
}) => {
  const validatedFields = AddCustomerSchema.safeParse(userData);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  try {
    const { firstName, lastName, phone, email } = validatedFields.data;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/customers/create`,
      {
        name: `${firstName} ${lastName}`,
        phone,
        email: email === "" ? null : email,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 201) {
      revalidateDbCache({ tag: CACHE_TAGS.customers, userId });
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

export const GetCustomers = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetCustomersInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.customers)],
  });

  return cachedFn({ token, userId });
};

const GetCustomersInternal = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/customers/all`,
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

export const GetDebtors = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetDebtorsInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.debtors)],
  });

  return cachedFn({ token, userId });
};

const GetDebtorsInternal = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/debtors/all`,
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

export const CreateSupplier = async ({
  token,
  userId,
  userData,
}: {
  token: string;
  userId: string;
  userData: z.infer<typeof AddSupplierSchema>;
}) => {
  const validatedFields = AddSupplierSchema.safeParse(userData);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  try {
    const { supplierName, address, phone, email } = validatedFields.data;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/suppliers/create`,
      {
        name: supplierName,
        contact: phone,
        email: email === "" ? null : email,
        warehouseAddress: address,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 201) {
      revalidateDbCache({ tag: CACHE_TAGS.suppliers, userId });
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

export const GetSupplier = async ({
  token,
  userId,
  id,
}: {
  token: string;
  userId: string;
  id: string;
}) => {
  const cachedFn = dbCache(getSupplierInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.supplier)],
  });

  return cachedFn({ token, userId, id });
};

const getSupplierInternal = async ({
  token,
  userId,
  id,
}: {
  token: string;
  userId: string;
  id: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/suppliers/${id}`,
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

export const GetCustomer = async ({
  token,
  userId,
  id,
}: {
  token: string;
  userId: string;
  id: string;
}) => {
  const cachedFn = dbCache(getCustomerInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.customer)],
  });

  return cachedFn({ token, userId, id });
};

const getCustomerInternal = async ({
  token,
  userId,
  id,
}: {
  token: string;
  userId: string;
  id: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/customers/${id}`,
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

export const GetDebtor = async ({
  token,
  userId,
  id,
}: {
  token: string;
  userId: string;
  id: string;
}) => {
  const cachedFn = dbCache(getDebtorInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.debtor)],
  });

  return cachedFn({ token, userId, id });
};

const getDebtorInternal = async ({
  token,
  userId,
  id,
}: {
  token: string;
  userId: string;
  id: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/debtors/${id}`,
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

export const GetTransactionItem = async ({
  token,
  userId,
  id,
}: {
  token: string;
  userId: string;
  id: string;
}) => {
  const cachedFn = dbCache(getTransactionItemInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.item)],
  });

  return cachedFn({ token, userId, id });
};

const getTransactionItemInternal = async ({
  token,
  userId,
  id,
}: {
  token: string;
  userId: string;
  id: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaction/products/${id}/item`,
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

export const PayBalance = async ({
  token,
  userId,
  payData,
  itemId,
  acctPaidTo,
}: {
  token: string;
  userId: string;
  itemId: string;
  payData: { amount: number; method: string };
  acctPaidTo?: {
    bankName: string;
    acctNo: string;
    acctName: string;
    userBankId: string;
  };
}) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaction/products/${itemId}/updatePrice`,
      { ...payData, acctPaidTo },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.item, userId });
      revalidateDbCache({ tag: CACHE_TAGS.customer, userId });
      revalidateDbCache({ tag: CACHE_TAGS.customers, userId });
      revalidateDbCache({ tag: CACHE_TAGS.debtor, userId });
      revalidateDbCache({ tag: CACHE_TAGS.debtors, userId });
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
