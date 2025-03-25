"use client";

import { ResendOTP, VerifyOTP } from "@/actions/auth.a";
import { useAppDispatch } from "@/app/redux";
import { Button } from "@/components/ui/button";
import { useReduxState } from "@/hooks/useRedux";
import { SET_TOKEN } from "@/state";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { OtpInput } from "../_component/OtpInput";
import { ResendLink } from "./ResendLink";

export const CodeContent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { email } = useReduxState();

  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("");

  const verifyOTP = () => {
    startTransition(async () => {
      // verifyOTP
      const { success, error } = await VerifyOTP({
        company_email: email,
        otp: value,
      });
      if (success) {
        dispatch(SET_TOKEN(success.jwtToken));

        router.push("/dashboard");
        toast.success("Success", {
          description: "OTP verified successfully",
        });
        return;
      }

      if (error) {
        toast.error("Error", { description: error });
        return;
      }
    });
  };

  const ResendOTPHandler = (email: string) => {
    startTransition(async () => {
      const { success, error } = await ResendOTP({ company_email: email });
      if (error) {
        toast.error("Error", { description: error });
        return;
      }

      toast.success("Success", { description: success.message });
    });
  };

  return (
    <div className="bg-white rounded-md shadow-md p-8 flex flex-col justify-center items-center gap-4">
      {/* <img
        src="/logo.png"
        alt="logo"
        className="w-44 md:w-52 lg:w-56 cursor-pointer"
      /> */}
      <p className="text-sm md:text-base">
        Enter the OTP sent to <span className="font-semibold">{email}</span>
      </p>

      <OtpInput value={value} handleChange={(value) => setValue(value)} />

      <ResendLink
        handleClick={() => {
          ResendOTPHandler(email);
        }}
      />

      <hr />

      <Button
        onClick={verifyOTP}
        isLoading={isPending}
        loadingText="please wait"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        Verify OTP
      </Button>
    </div>
  );
};
