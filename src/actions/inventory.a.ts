"use server";

import { BankProps } from "@/hooks/useAddBankModal";
import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { AddProductSchema } from "@/schema";
import axios from "axios";
import { z } from "zod";

export const GetInventoryItemsByType = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetInventoryItemsByTypeInternals, {
    tags: [getUserTag(userId, CACHE_TAGS.inventoryProducts)],
  });

  return cachedFn({ token, userId });
};

const GetInventoryItemsByTypeInternals = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
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

export const GetInventoryStats = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetInventoryStatsInternals, {
    tags: [getUserTag(userId, CACHE_TAGS.inventoryStats)],
  });

  return cachedFn({ token, userId });
};

const GetInventoryStatsInternals = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
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
      await Promise.all([
        revalidateDbCache({ tag: CACHE_TAGS.inventoryProducts, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.inventoryStats, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.suppliers, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.supplier, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.dashSummary, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.categories, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.allProducts, userId }),
      ]);
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
      await Promise.all([
        revalidateDbCache({ tag: CACHE_TAGS.inventoryProducts, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.inventoryStats, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.suppliers, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.supplier, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.dashSummary, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.categories, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.allProducts, userId }),
      ]);
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
      await Promise.all([
        revalidateDbCache({ tag: CACHE_TAGS.dashSummary, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.inventoryProducts, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.inventoryStats, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.allProducts, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.categories, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.customers, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.customer, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.debtors, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.debtor, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.suppliers, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.supplier, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.transaction, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.singleTransaction, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.invoiceSummary, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.invoices, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.invoice, userId }),
      ]);
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
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      await Promise.all([
        revalidateDbCache({ tag: CACHE_TAGS.dashSummary, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.inventoryProducts, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.inventoryStats, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.allProducts, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.categories, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.customers, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.customer, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.debtors, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.debtor, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.suppliers, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.supplier, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.transaction, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.singleTransaction, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.invoiceSummary, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.invoices, userId }),
        revalidateDbCache({ tag: CACHE_TAGS.invoice, userId }),
      ]);
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

export const GetBanks = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetBanksInternals, {
    tags: [getUserTag(userId, CACHE_TAGS.banks)],
  });

  return cachedFn({ token, userId });
};

const GetBanksInternals = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/banks`,
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

export const CreateBank = async ({
  token,
  userId,
  bank,
}: {
  token: string;
  userId: string;
  bank: BankProps;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/banks`,
      bank,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 201) {
      await Promise.all([
        revalidateDbCache({ tag: CACHE_TAGS.companyAccount }),
        revalidateDbCache({ tag: CACHE_TAGS.banks, userId }),
      ]);
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

export const GetDashSummary = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetDashSummaryIntervals, {
    tags: [getUserTag(userId, CACHE_TAGS.dashSummary)],
  });

  return cachedFn({ token, userId });
};

const GetDashSummaryIntervals = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/dashboard`,
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

export const ManageRestockLevel = async ({
  token,
  userId,
  restock,
  productName,
}: {
  token: string;
  userId: string;
  restock: { min: string; max: string };
  productName: string;
}) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/inventory/manageStock`,
      { restock, productName },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      await Promise.all([
        revalidateDbCache({ tag: CACHE_TAGS.dashSummary, userId }),
      ]);
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
