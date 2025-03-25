"use client";

import { ForgetPassword } from "@/actions/auth.a";
import { ResetSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { CustomInput } from "./ui/CustomInput";

/**
 * ResetPasswordForm Component
 *
 * This component renders a form for resetting a user's password. It includes fields for email, 
 * new password, and confirmation of the new password. The form uses `react-hook-form` for 
 * form state management and validation, and `zod` for schema validation.
 *
 * Features:
 * - Validates that the new password and confirmation password match.
 * - Displays error or success messages using a toast notification system.
 * - Stores user credentials in localStorage upon successful submission.
 * - Redirects the user to the `/update_password` page after a successful password reset.
 *
 * @returns {JSX.Element} The ResetPasswordForm component.
 *
 * @dependencies
 * - `useRouter` from `next/router` for navigation.
 * - `useTransition` from React for managing asynchronous state transitions.
 * - `useForm` from `react-hook-form` for form handling.
 * - `zod` and `zodResolver` for schema-based form validation.
 * - `CustomInput` for rendering input fields with optional password visibility toggles.
 * - `Button` for rendering a submit button with loading state.
 * - `toast` for displaying notifications.
 *
 * @example
 * ```tsx
 * import { ResetPasswordForm } from './ResetPasswordForm';
 *
 * const App = () => {
 *   return <ResetPasswordForm />;
 * };
 * ```
 */
export const ResetPasswordForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [show, setShow] = useState<{ password: boolean; cfPassword: boolean }>({
    password: false,
    cfPassword: false,
  });

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof ResetSchema>) => {
    startTransition(async () => {
      if (values.password !== values.confirmPassword) {
        toast.error("Error", {
          description:
            "Passwords do not match. Please ensure both fields are identical.",
        });
      }

      const { success, error } = await ForgetPassword({ values });
      if (error) {
        toast.error("Error", {
          description: error,
        });

        form.reset();
        return;
      }

      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: values.email,
            password: values.password,
          })
        );
      }
      toast.success("Success", { description: success.message });
      router.push("/update_password");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4 w-[300px] md:w-[450px]">
          <p className="text-2xl font-semibold text-center">Reset Password</p>

          <CustomInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
          />

          <CustomInput
            control={form.control}
            name="password"
            label="New Password"
            placeholder="Enter new password"
            show={show.password}
            handleShow={() => setShow({ ...show, password: !show.password })}
          />

          <CustomInput
            control={form.control}
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Retype new password"
            show={show.cfPassword}
            handleShow={() =>
              setShow({ ...show, cfPassword: !show.cfPassword })
            }
          />

          <hr />

          <div className="text-end ml-auto">
            <Button
              disabled={isPending}
              isLoading={isPending}
              loadingText="please wait"
              className="cursor-pointer"
            >
              Continue
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
