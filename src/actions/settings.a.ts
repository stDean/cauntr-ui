"use server";

import { BankProps } from "@/hooks/useAddBankModal";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  revalidateDbCache,
} from "@/lib/cache";
import { createUserSchema, ProfileSettingSchema } from "@/schema";
import axios from "axios";
import { z } from "zod";

export interface AcctDetailsProps {
  businessName?: string;
  businessEmail: string;
  phoneNumber?: string;
  category?: string;
  businessAddress?: string;
  taxID?: string;
  banks: BankProps[];
}

export const GetCompanyAccount = async ({ token }: { token: string }) => {
  const cachedFn = dbCache(getCompanyAccountInternals, {
    tags: [getGlobalTag(CACHE_TAGS.companyAccount)],
  });

  return cachedFn({ token });
};

const getCompanyAccountInternals = async ({ token }: { token: string }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/getAcct`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: res.data };
  } catch (e: any) {
    if (e.response) {
      const status = e.response.status;
      const message = e.response.data?.message || "An error occurred";

      if (status === 400 || status === 429 || status === 500) {
        return { error: message };
      }
    }

    return { error: "Something went wrong." };
  }
};

export const UpdateAccount = async ({
  acctDetails,
  token,
  userId,
}: {
  acctDetails: AcctDetailsProps;
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/updateAcct`,
      {
        businessEmail: acctDetails.businessEmail,
        businessName: acctDetails.businessName,
        businessAddress: acctDetails.businessAddress,
        taxID: acctDetails.taxID,
        phoneNumber: acctDetails.phoneNumber,
        category: acctDetails.category,
        bankDetails: [...acctDetails.banks],
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.companyAccount });
      revalidateDbCache({ tag: CACHE_TAGS.banks, userId });
    }

    return { success: res.data };
  } catch (e: any) {
    if (e.response) {
      const status = e.response.status;
      const message = e.response.data?.message || "An error occurred";

      if (status === 400 || status === 429 || status === 500) {
        return { error: message };
      }
    }

    return { error: "Something went wrong." };
  }
};

export const RemoveBank = async ({
  token,
  bankId,
}: {
  token: string;
  bankId: string;
}) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/removeBank/${bankId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.companyAccount });
    }

    return { success: res.data };
  } catch (e: any) {
    if (e.response) {
      const status = e.response.status;
      const message = e.response.data?.message || "An error occurred";

      if (status === 400 || status === 429 || status === 500) {
        return { error: message };
      }
    }

    return { error: "Something went wrong." };
  }
};

export const UpdateUserProfile = async ({
  id,
  token,
  values,
  userId,
}: {
  id: string;
  token: string;
  values: z.infer<typeof ProfileSettingSchema>;
  userId: string;
}) => {
  const validatedFields = ProfileSettingSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const { email, role, firstName, lastName, password } = validatedFields.data;
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`,
      { first_name: firstName, last_name: lastName, role, email, password },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.user });
      revalidateDbCache({ tag: CACHE_TAGS.users });
      revalidateDbCache({ tag: CACHE_TAGS.singleTransaction, userId });
      revalidateDbCache({ tag: CACHE_TAGS.transaction, userId });
    }

    return { success: res.data };
  } catch (e: any) {
    if (e.response) {
      const status = e.response.status;
      const message = e.response.data?.message || "An error occurred";

      if (status === 400 || status === 429 || status === 500) {
        return { error: message };
      }
    }

    return { error: "Something went wrong." };
  }
};

export const GetUsers = async ({ token }: { token: string }) => {
  const cachedFn = dbCache(getUsersInternals, {
    tags: [getGlobalTag(CACHE_TAGS.users)],
  });

  return cachedFn({ token });
};

const getUsersInternals = async ({ token }: { token: string }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/all`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: res.data };
  } catch (e: any) {
    if (e.response) {
      const status = e.response.status;
      const message = e.response.data?.message || "An error occurred";

      if (status === 400 || status === 429 || status === 500) {
        return { error: message };
      }
    }

    return { error: "Something went wrong." };
  }
};

export const CreateUser = async ({
  token,
  values,
}: {
  token: string;
  values: z.infer<typeof createUserSchema>;
}) => {
  const validatedFields = createUserSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const { email, firstName, lastName, phone, role, password } =
      validatedFields.data;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/create`,
      {
        email,
        first_name: firstName!.trim() !== "" ? firstName : null,
        last_name: lastName!.trim() !== "" ? lastName : null,
        phone: phone!.trim() !== "" ? phone : null,
        role,
        password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 201) {
      revalidateDbCache({ tag: CACHE_TAGS.users });
    }

    return { success: res.data };
  } catch (e: any) {
    if (e.response) {
      const status = e.response.status;
      const message = e.response.data?.message || "An error occurred";

      if (status === 400 || status === 429 || status === 500) {
        return { error: message };
      }
    }

    return { error: "Something went wrong." };
  }
};

export const UpdateUserRole = async ({
  token,
  userId,
  role,
}: {
  token: string;
  userId: string;
  role: string;
}) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/updateRole`,
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.user });
      revalidateDbCache({ tag: CACHE_TAGS.users });
    }
    return { success: res.data };
  } catch (e: any) {
    if (e.response) {
      const status = e.response.status;
      const message = e.response.data?.message || "An error occurred";

      if (status === 400 || status === 429 || status === 500) {
        return { error: message };
      }
    }

    return { error: "Something went wrong." };
  }
};

export const GetUser = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(GetUserInternal, {
    tags: [getGlobalTag(CACHE_TAGS.user)],
  });

  return cachedFn({ token, userId });
};

export const GetUserInternal = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
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

export const DeleteUser = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.users });
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

export const GetSubHistory = async ({ token }: { token: string }) => {
  const cachedFn = dbCache(GetSubscriptionHistoryInternals, {
    tags: [getGlobalTag(CACHE_TAGS.subscriptionHistory)],
  });

  return cachedFn({ token });
};

const GetSubscriptionHistoryInternals = async ({
  token,
}: {
  token: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sub/history`,
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

export const ManageSubscription = async ({ token }: { token: string }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sub/manage`,
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

export const CancelSubscription = async ({ token }: { token: string }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sub/cancel/stripe`,
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

export const CreateSubscription = async ({
  token,
  tier,
  tierType,
}: {
  token: string;
  tier: string;
  tierType: string;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sub/create`,
      { tier, tierType },
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
