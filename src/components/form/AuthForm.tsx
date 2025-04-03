"use client";

import { Login, Register } from "@/actions/auth.a";
import { useAppDispatch } from "@/app/redux";
import { Form } from "@/components/ui/form";
import { AuthSchema } from "@/schema";
import { SET_EMAIL, SET_LOGGED_IN_USER, SET_TOKEN } from "@/state";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { CustomInput } from "./ui/CustomInput";

const LinkText = ({
  href,
  text,
  mainText,
}: {
  href: string;
  text: string;
  mainText: string;
}) => {
  return (
    <p className="text-center text-sm">
      {mainText}{" "}
      <Link
        href={href}
        className="font-semibold text-blue-500 hover:text-blue-400 hover:underline hover:underline-offset-4 cursor-pointer"
      >
        {text}
      </Link>
    </p>
  );
};

/**
 * AuthForm Component
 *
 * This component renders an authentication form that supports both login and registration flows.
 * The form dynamically adjusts its fields and behavior based on the `type` prop.
 *
 * @param {Object} props - Component props.
 * @param {string} props.type - The type of the form, either "login" or "register".
 *
 * @returns {JSX.Element} The rendered authentication form.
 *
 * @remarks
 * - For "login", the form includes fields for email and password.
 * - For "register", the form includes additional fields for company name, country, and password confirmation.
 * - The form uses `react-hook-form` for form state management and validation.
 * - The `zod` library is used for schema validation.
 *
 * @example
 * ```tsx
 * <AuthForm type="login" />
 * <AuthForm type="register" />
 * ```
 *
 * @dependencies
 * - `useRouter` from `next/router` for navigation.
 * - `useAppDispatch` for dispatching Redux actions.
 * - `useForm` from `react-hook-form` for form handling.
 * - `zod` and `zodResolver` for schema validation.
 * - `CustomInput`, `Button`, and `LinkText` components for UI elements.
 * - `toast` for displaying success and error messages.
 *
 * @features
 * - Password visibility toggle for password fields.
 * - Displays error messages for validation and API errors.
 * - Redirects users to appropriate pages upon successful login or registration.
 */
export const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [show, setShow] = useState<{ password: boolean; cfPassword: boolean }>({
    password: false,
    cfPassword: false,
  });
  const [isPending, startTransition] = useTransition();

  const defaultValues =
    type === "register"
      ? {
          company_email: "",
          password: "",
          confirmPassword: "",
          company_name: "",
          country: "",
        }
      : {
          company_email: "",
          password: "",
        };

  const form = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
    defaultValues: defaultValues,
  });

  const handAuthentication = (values: z.infer<typeof AuthSchema>) => {
    startTransition(async () => {
      if (type === "login") {
        const { success, error } = await Login({ values });
        if (error) {
          toast.error("Error", { description: error });
          return;
        }

        // set the token into the context.
        dispatch(SET_TOKEN(success.token));
        dispatch(SET_LOGGED_IN_USER(success.user))
        toast.success("Success", { description: success.message });
        router.push("/dashboard");
        return;
      }

      // if (!agree) {
      //   toast.error("Error", {
      //     description: "Agree to terms and conditions to continue.",
      //   });

      //   return;
      // }

      if (values.password !== values.confirmPassword) {
        toast.error("Error", {
          description:
            "Passwords do not match. Please ensure both fields are identical.",
        });

        return;
      }
      const { error, success } = await Register({ values });
      if (error) {
        if (Array.isArray(error)) {
          error.forEach((e) => {
            if (typeof e === "string") {
              toast.error("Error", { description: e });
            }
          });
        } else {
          toast.error("Error", { description: error });
        }

        form.reset();
        return;
      }

      dispatch(SET_EMAIL(values.company_email));
      toast.success("Success", { description: success.message });
      router.push("/code");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handAuthentication)}>
        <div className="flex flex-col gap-3 w-[300px] md:w-[450px]">
          <CustomInput
            control={form.control}
            name="company_email"
            label={type !== "register" ? "Email" : "Company Email"}
            placeholder={
              type !== "register" ? "Enter email" : "Enter company email"
            }
          />

          {type === "register" && (
            <>
              <CustomInput
                control={form.control}
                name="company_name"
                label="Company Name"
                placeholder="Enter company name"
              />

              <CustomInput
                control={form.control}
                name="country"
                label="Country"
                placeholder="Enter country"
              />
            </>
          )}

          <CustomInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="password"
            show={show.password}
            handleShow={() => setShow({ ...show, password: !show.password })}
          />

          {type === "register" && (
            <>
              <CustomInput
                control={form.control}
                name="confirmPassword"
                label="Retype Password"
                placeholder="Retype password"
                show={show.cfPassword}
                handleShow={() =>
                  setShow({ ...show, cfPassword: !show.cfPassword })
                }
              />
            </>
          )}

          {type === "login" && (
            <p className="-mt-1 text-xs">
              Forgot password?{" "}
              <Link
                href="/reset"
                className="font-semibold text-blue-500 hover:text-blue-400 hover:underline hover:underline-offset-4 cursor-pointer"
              >
                Reset
              </Link>
            </p>
          )}

          {type === "register" ? (
            <LinkText
              text="Login Now!"
              href="/login"
              mainText="Have an account?"
            />
          ) : (
            <LinkText
              text="Register Now!"
              href="/signup"
              mainText=" Don't have an account?"
            />
          )}

          <hr />

          <div className="text-end ml-auto">
            <Button
              isLoading={isPending}
              loadingText={"please wait"}
              className="cursor-pointer"
              disabled={isPending}
            >
              {type === "register" ? "Continue" : "Log In"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
