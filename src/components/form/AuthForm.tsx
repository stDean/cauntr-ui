"use client";

import { Form } from "@/components/ui/form";
import { AuthSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { CustomInput } from "./ui/CustomInput";
import { Login, Register } from "@/actions/auth.a";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux";
import { SET_EMAIL, SET_TOKEN } from "@/state";

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
