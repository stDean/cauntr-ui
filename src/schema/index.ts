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
  firstName: z.optional(z.string()),
  lastName: z.optional(z.string()),
  email: z.string().email(),
  role: z.string(),
  password: z.optional(z.string()),
});

export const createUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
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

function toISOLocal(date: Date) {
  const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  return new Date(date.getTime() - offset).toISOString().slice(0, -1);
}

export const AddProductSchema = z.object({
  product_name: z.string(),
  type: z.string(),
  brand: z.string(),
  status: z.string(),
  purchaseDate: z.date().transform((date) => toISOLocal(date)),
  quantity: z.string(),
  serial_no: z.string().optional(),
  description: z.string().optional(),
  costPrice: z.string(),
  sellingPrice: z.string(),
  supplier_name: z.string(),
  supplier_phone_no: z.string(),
  supplier_email: z.string().optional(),
});

export const AddCustomerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().optional(),
});

export const AddSupplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required"),
  email: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
});

export const AddDebtorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  amountOwed: z.string(),
});
