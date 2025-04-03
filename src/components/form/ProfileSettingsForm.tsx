"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { CustomInput } from "./ui/CustomInput";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ProfileSettingSchema } from "@/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProps } from "@/lib/types";
import useChangePasswordModal from "@/hooks/useChangePassModal";
import { toast } from "sonner";
import { UpdateUserProfile } from "@/actions/settings.a";
import { useReduxState } from "@/hooks/useRedux";
import { SET_LOGGED_IN_USER } from "@/state";
import { useAppDispatch } from "@/app/redux";

export const ProfileSettingsForm = ({ user }: { user: UserProps }) => {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const changePasswordModal = useChangePasswordModal();
  const { token, loggedInUser } = useReduxState();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof ProfileSettingSchema>>({
    resolver: zodResolver(ProfileSettingSchema),
    defaultValues: {
      firstName: user!.firstName! || "",
      lastName: user!.lastName! || "",
      email: user!.email,
      role: user.role,
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof ProfileSettingSchema>) => {
    startTransition(async () => {
      if (changePasswordModal.error) {
        toast.error("Error", { description: changePasswordModal.error });
        return;
      }

      const values = { ...data, password: changePasswordModal.password };

      const res = await UpdateUserProfile({
        token,
        id: loggedInUser!.id,
        values,
      });
      if (res.error) {
        toast.error("Error", { description: res.error });
        return;
      }

      dispatch(SET_LOGGED_IN_USER(res.success.data));
      toast.success("Success", { description: res.success.msg });
      setCanEdit(false);
    });
  };

  const handleCancel = () => {
    form.reset();
    setCanEdit(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border rounded-lg px-6 py-8 w-full md:w-2xl space-y-5 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-2xl">Profile</h1>

            {!canEdit && (
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setCanEdit(true);
                }}
                variant={"cauntr_blue"}
              >
                <Pencil className="mr-2" /> Edit
              </Button>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <CustomInput
              control={form.control}
              label="First Name"
              name="firstName"
              placeholder="First Name"
              disabled={!canEdit}
            />
            <CustomInput
              control={form.control}
              label="Last Name"
              name="lastName"
              placeholder="Last Name"
              disabled={!canEdit}
            />
          </div>
          <CustomInput
            control={form.control}
            label="Email"
            name="email"
            placeholder="johndoe@gmail.com"
            disabled={!canEdit}
          />
          <CustomInput
            control={form.control}
            label="Role"
            name="role"
            placeholder="Admin"
            disabled
          />
          {!canEdit && (
            <CustomInput
              control={form.control}
              label="Password"
              name="password"
              placeholder="********"
              disabled={!canEdit}
            />
          )}
          {canEdit && (
            <div className="space-y-2">
              <p className="text-[12px]">Password</p>
              <Button
                type="button"
                className="cursor-pointer border-blue-500 text-blue-500 hover:text-blue-400 hover:bg-white hover:border-blue-400"
                variant={"outline"}
                onClick={changePasswordModal.onOpen}
              >
                Change Password
              </Button>
            </div>
          )}

          {canEdit && (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={handleCancel}
                className="cursor-pointer"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant={"cauntr_blue"}
                type="submit"
                className="cursor-pointer"
                loadingText="updating"
                isLoading={isPending}
                disabled={isPending}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};
