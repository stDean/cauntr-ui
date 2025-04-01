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

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .optional(),
  lastName: z.string().min(1, { message: "Last name is required" }).optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional().optional(),
  role: z.enum(["EMPLOYEE", "ADMIN"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, {
      message: "Password must contain at least one special character",
    }),
});
