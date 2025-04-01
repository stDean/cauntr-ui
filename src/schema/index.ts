import { z } from "zod";

export const AuthSchema = z.object({
  company_email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters long." }),
  confirmPassword: z.optional(
    z
      .string()
      .min(8, { message: "password must be at least 8 characters long." })
  ),
  company_name: z.string().optional(),
  country: z.string().optional(),
});

export const ResetSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters long." }),
  confirmPassword: z
    .string()
    .min(8, { message: "password must be at least 8 characters long." }),
});

export const AccountSettingsSchema = z.object({
  businessName: z.optional(z.string()),
  category: z.optional(z.string()),
  email: z.string().email(),
  phone: z.optional(z.string()),
  address: z.optional(z.string()),
  tin: z.optional(z.string()),
});

export const ProfileSettingSchema = z.object({
  firstName : z.optional(z.string()),
  lastName : z.optional(z.string()),
  email: z.string().email(),
  role : z.optional(z.string()),
  password :z.optional(z.string()),
})
