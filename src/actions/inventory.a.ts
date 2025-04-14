"use server";

import { CACHE_TAGS, dbCache, getGlobalTag, getUserTag } from "@/lib/cache";
import { AddProductSchema } from "@/schema";
import axios from "axios";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const GetInventoryItemsByType = async ({ token }: { token: string }) => {
  const cachedFn = dbCache(GetInventoryItemsByTypeInternals, {
    tags: [getGlobalTag(CACHE_TAGS.inventoryProducts)],
  });

  return cachedFn({ token });
};

const GetInventoryItemsByTypeInternals = async ({
  token,
}: {
  token: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/products/summary`,
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

export const GetInventoryStats = async ({ token }: { token: string }) => {
  const cachedFn = dbCache(GetInventoryStatsInternals, {
    tags: [getGlobalTag(CACHE_TAGS.inventoryStats)],
  });

  return cachedFn({ token });
};

const GetInventoryStatsInternals = async ({ token }: { token: string }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/summary`,
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

export const CreateProduct = async ({
  token,
  values,
  userId,
}: {
  token: string;
  values: z.infer<typeof AddProductSchema>;
  userId: string;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/create`,
      {
        productName: values.product_name,
        brand: values.brand,
        productType: values.type,
        description: values.description ? values.description : null,
        costPrice: values.costPrice ? parseFloat(values.costPrice) : null,
        sellingPrice: values.sellingPrice
          ? parseFloat(values.sellingPrice)
          : null,
        serialNo: values.serial_no ? values.serial_no : null,
        condition: values.status,
        supplierName: values.supplier_name ? values.supplier_name : null,
        supplierPhone: values.supplier_phone_no
          ? values.supplier_phone_no
          : null,
        quantity: values.quantity ? values.quantity : 1,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 201) {
      revalidateTag(getGlobalTag(CACHE_TAGS.inventoryProducts));
      revalidateTag(getGlobalTag(CACHE_TAGS.inventoryStats));
      revalidateTag(getUserTag(userId, CACHE_TAGS.categories));
      revalidateTag(getUserTag(userId, CACHE_TAGS.allProducts));
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

export const CreateProducts = async ({
  token,
  products,
  userId,
}: {
  token: string;
  products: Array<unknown>;
  userId: string;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/create/bulk`,
      products,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 201) {
      revalidateTag(getGlobalTag(CACHE_TAGS.inventoryProducts));
      revalidateTag(getGlobalTag(CACHE_TAGS.inventoryStats));
      revalidateTag(getUserTag(userId, CACHE_TAGS.categories));
      revalidateTag(getUserTag(userId, CACHE_TAGS.allProducts));
    }

    return { success: res.data.data.length > 0, error: res.data.errors };
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

export const GetProductByName = async ({
  token,
  userId,
  brand,
  type,
  name,
}: {
  token: string;
  userId: string;
  brand: string;
  type: string;
  name: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/related/${type}/${brand}/${name}`,
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

export const GetAllProducts = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetAllProductsInternals, {
    tags: [getUserTag(userId, CACHE_TAGS.allProducts)],
  });

  return cachedFn({ token, userId });
};

const GetAllProductsInternals = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/all`,
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

export const GetCategories = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetCategoriesIntervals, {
    tags: [getUserTag(userId, CACHE_TAGS.categories)],
  });

  return cachedFn({ token, userId });
};

const GetCategoriesIntervals = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/categories`,
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

export const SellProduct = async ({
  token,
  userId,
  sku,
  product,
}: {
  token: string;
  userId: string;
  sku: string;
  product: any;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaction/products/${sku}/sell`,
      product,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      revalidateTag(getUserTag(userId, CACHE_TAGS.allProducts));
      revalidateTag(getGlobalTag(CACHE_TAGS.inventoryProducts));
      revalidateTag(getGlobalTag(CACHE_TAGS.inventoryStats));
      revalidateTag(getUserTag(userId, CACHE_TAGS.categories));
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

export const SellProducts = async ({
  token,
  userId,
  products,
}: {
  token: string;
  userId: string;
  products: any;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaction/products/bulkSell`,
      products,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      revalidateTag(getUserTag(userId, CACHE_TAGS.allProducts));
      revalidateTag(getGlobalTag(CACHE_TAGS.inventoryProducts));
      revalidateTag(getGlobalTag(CACHE_TAGS.inventoryStats));
      revalidateTag(getUserTag(userId, CACHE_TAGS.categories));
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
