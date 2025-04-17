"use server";

import { clearFullCache } from "@/lib/cache";
import { AuthSchema, ResetSchema } from "@/schema";
import axios from "axios";
import { cookies } from "next/headers";
import { z } from "zod";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const Register = async ({
  values,
}: {
  values?: z.infer<typeof AuthSchema>;
}) => {
  const validatedFields = AuthSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const { company_email, password, company_name, country } =
      validatedFields.data;
    const res = await api.post(`/auth/registerCompany`, {
      company_email,
      password,
      company_name,
      country,
    });

    return { success: res.data };
  } catch (e: any) {
    if (e.response) {
      const data = e.response.data;
      // If there is an errors object, pass it along.
      if (data.errors && typeof data.errors === "object") {
        return { error: Object.values(data.errors) };
      }
      const message = data?.message || "An error occurred";
      return { error: message };
    }

    // Handle any other errors
    return { error: "Something went wrong." };
  }
};

export const VerifyOTP = async ({
  company_email,
  otp,
}: {
  company_email: string;
  otp: string;
}) => {
  try {
    const res = await api.post(`/auth/verifyOtp`, { company_email, otp });

    if (res.status === 200) {
      const cookieStore = await cookies();
      cookieStore.set("token", JSON.stringify(res.data.token), {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      });

      cookieStore.set("role", res.data.role, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      });

      cookieStore.set("userId", res.data.user.id, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      });
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

export const ResendOTP = async ({
  company_email,
}: {
  company_email: string;
}) => {
  try {
    const res = await api.post(`/auth/resendRegistrationOTP`, {
      company_email,
    });
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

export const Login = async ({
  values,
}: {
  values?: z.infer<typeof AuthSchema>;
}) => {
  const validatedFields = AuthSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const { company_email, password } = validatedFields.data;
    const res = await api.post(`/auth/login`, {
      email: company_email,
      password,
    });

    if (res.status === 200) {
      const cookieStore = await cookies();
      cookieStore.set("token", JSON.stringify(res.data.token), {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      });

      cookieStore.set("role", res.data.role, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      });

      cookieStore.set("userId", res.data.user.id, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      });
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

export const Logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("role");
  clearFullCache()
};

export const ForgetPassword = async ({
  values,
}: {
  values?: z.infer<typeof ResetSchema>;
}) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  try {
    const { email, password } = validatedFields.data;
    const res = await api.post("/auth/forgotPassword", { email, password });
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

export const VerifyOtpAndUpdatePassword = async ({
  email,
  password,
  otp,
}: {
  email: string;
  password: string;
  otp: string;
}) => {
  try {
    const res = await api.post("/auth/resetPassword", { email, password, otp });
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

export const ResendUserOTP = async ({ email }: { email: string }) => {
  try {
    const res = await api.post(`/auth/resendOtp`, {
      email,
    });
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