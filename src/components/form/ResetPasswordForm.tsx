"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CustomInput } from "./ui/CustomInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { ResetSchema } from "@/schema";
import { toast } from "sonner";
import { ForgetPassword } from "@/actions/auth.a";

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
