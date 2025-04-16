"use server";

import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { AddCustomerSchema } from "@/schema";
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
