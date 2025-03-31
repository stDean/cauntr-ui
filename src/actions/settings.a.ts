"use server";

import { BankProps } from "@/hooks/useAddBankModal";
import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import axios from "axios";

export interface AcctDetailsProps {
  businessName?: string;
  businessEmail: string;
  phoneNumber?: string;
  category?: string;
  businessAddress?: string;
  taxID?: string;
  banks: BankProps[];
}

export const GetCompanyAccount = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const cachedFn = dbCache(getCompanyAccountInternals, {
    tags: [getUserTag(userId, CACHE_TAGS.companyAccount)],
  });

  return cachedFn({ token, userId });
};

const getCompanyAccountInternals = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
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
      revalidateDbCache({ tag: CACHE_TAGS.companyAccount, userId });
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
  userId,
  bankId,
}: {
  token: string;
  userId: string;
  bankId: string;
}) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/removeBank/${bankId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 200) {
      revalidateDbCache({ tag: CACHE_TAGS.companyAccount, userId });
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
}
