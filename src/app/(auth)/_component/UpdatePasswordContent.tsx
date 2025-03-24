"use client";

import { ResendUserOTP, VerifyOtpAndUpdatePassword } from "@/actions/auth.a";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { OtpInput } from "../_component/OtpInput";
import { ResendLink } from "./ResendLink";

export const UpdatePasswordContent = () => {
  const router = useRouter();
  const { email, password } =
    typeof localStorage !== "undefined"
      ? JSON.parse(localStorage.getItem("user") as string)
      : null;

  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("");

  const verifyOTP = () => {
    startTransition(async () => {
      // verifyOTP
      const { success, error } = await VerifyOtpAndUpdatePassword({
        email,
        password,
        otp: value,
      });
      if (success) {
        router.push("/login");
        toast.success("Success", {
          description: success.message,
        });

        typeof localStorage !== "undefined" && localStorage.removeItem("user");
      }

      if (error) {
        toast.error("Error", { description: error });
        return;
      }
    });
  };

  const resendOTP = () => {
    startTransition(async () => {
      const { success, error } = await ResendUserOTP({  email });
      if (error) {
        toast.error("Error", { description: error });
        return;
      }

      toast.success("Success", { description: success.message });
    });
  };

  return (
    <div className="bg-white rounded-md shadow-md p-8 flex flex-col justify-center items-center gap-4">
      <img
        src="/logo.png"
        alt="logo"
        className="w-44 md:w-52 lg:w-56 cursor-pointer"
      />
      <p className="text-sm md:text-base">
        Enter the OTP sent to <span className="font-semibold">{email}</span>
      </p>

      <OtpInput value={value} handleChange={(value) => setValue(value)} />

      <ResendLink handleClick={resendOTP} />

      <hr />

      <Button
        onClick={verifyOTP}
        disabled={isPending}
        className="w-full cursor-pointer"
        isLoading={isPending}
        loadingText="please wait"
      >
        Verify OTP
      </Button>
    </div>
  );
};
