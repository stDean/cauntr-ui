"use client";

import useChangePasswordModal from "@/hooks/useChangePassModal";
import { useState } from "react";
import { Modal } from "./Modal";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const ChangePasswordModal = () => {
  const changePasswordModal = useChangePasswordModal();
  const [data, setData] = useState<{ password: string; cfPassword: string }>({
    password: "",
    cfPassword: "",
  });
  const [show, setShow] = useState<{ password: boolean; cfPassword: boolean }>({
    password: false,
    cfPassword: false,
  });

  const headerContent = (
    <h1 className="text-xl md:text-2xl font-semibold">Change Password</h1>
  );

  const bodyContent = (
    <div className="p-6 space-y-4">
      <div className={cn("flex justify-between items-center relative")}>
        <Input
          name="password"
          placeholder="enter password"
          className={cn(
            "input-text-16 placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 pr-[44px] py-5"
          )}
          type={show.password ? "text" : "password"}
          // disabled={disabled}
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <div
          className="w-[18px] h-[18px] absolute right-1 top-3 md:top-3 md:right-3"
          onClick={() => setShow({ ...show, password: !show.password })}
        >
          {show.password ? (
            <Eye
              className={cn(
                "w-[14px] h-[14px] md:w-[18px] md:h-[18px] cursor-pointer"
                // {
                //   "opacity-50 cursor-not-allowed": disabled,
                // }
              )}
            />
          ) : (
            <EyeOff
              className={cn(
                "w-[14px] h-[14px] md:w-[18px] md:h-[18px] cursor-pointer"
                // {
                //   "opacity-50 cursor-not-allowed": disabled,
                // }
              )}
            />
          )}
        </div>
      </div>

      <div className={cn("flex justify-between items-center relative")}>
        <Input
          name="cfPassword"
          placeholder="retype password"
          className={cn(
            "input-text-16 placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 pr-[44px] py-5"
          )}
          type={show.cfPassword ? "text" : "password"}
          // disabled={disabled}
          value={data.cfPassword}
          onChange={(e) => setData({ ...data, cfPassword: e.target.value })}
        />

        <div
          className="w-[18px] h-[18px] absolute right-1 top-3 md:top-3 md:right-3"
          onClick={() => setShow({ ...show, cfPassword: !show.cfPassword })}
        >
          {show.cfPassword ? (
            <Eye
              className={cn(
                "w-[14px] h-[14px] md:w-[18px] md:h-[18px] cursor-pointer"
                // {
                //   "opacity-50 cursor-not-allowed": disabled,
                // }
              )}
            />
          ) : (
            <EyeOff
              className={cn(
                "w-[14px] h-[14px] md:w-[18px] md:h-[18px] cursor-pointer"
                // {
                //   "opacity-50 cursor-not-allowed": disabled,
                // }
              )}
            />
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => {
            changePasswordModal.onClose(data);
            setData({ password: "", cfPassword: "" });
            setShow({ password: false, cfPassword: false });
          }}
        >
          Change Password
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      headerContent={headerContent}
      body={bodyContent}
      isOpen={changePasswordModal.isOpen}
      onClose={() => {
        changePasswordModal.onClose({ password: "", cfPassword: "" });
      }}
    />
  );
};
