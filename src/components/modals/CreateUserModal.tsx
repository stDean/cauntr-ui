"use client";

import { CreateUser, UpdateUserRole } from "@/actions/settings.a";
import useCreateUserModal from "@/hooks/useCreateUserModal";
import { useReduxState } from "@/hooks/useRedux";
import { createUserSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomInput } from "../form/ui/CustomInput";
import { CustomSelect } from "../form/ui/CustomSelect";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";
import { Modal } from "./Modal";

export const CreateUserModal = () => {
  const createUserModal = useCreateUserModal();
  const [show, setShow] = useState<{ password: boolean }>({ password: false });
  const [isPending, startTransition] = useTransition();
  const { token } = useReduxState();

  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "EMPLOYEE" as "EMPLOYEE" | "ADMIN",
      password: "",
    },
  });

  // Reset form when createUserModal.user changes
  useEffect(() => {
    if (createUserModal.user) {
      const userRole = createUserModal.user.role?.toUpperCase();
      const validatedRole = userRole === "ADMIN" ? "ADMIN" : "EMPLOYEE";

      form.reset({
        email: createUserModal.user.email,
        firstName: createUserModal.user.firstName || "",
        lastName: createUserModal.user.lastName || "",
        phone: createUserModal.user.phone || "",
        role: validatedRole,
        password: "Password1#",
      });
    } else {
      // Reset to default values when creating a new user
      form.reset({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "EMPLOYEE",
        password: "",
      });
    }
  }, [createUserModal.user, form]);

  const handleUserAction = (values: z.infer<typeof createUserSchema>) => {
    startTransition(async () => {
      if (createUserModal.type === "create") {
        const res = await CreateUser({
          token,
          values,
        });
        if (res.error) {
          toast.error("Error", { description: res.error });
          return;
        }

        toast.success("Success", { description: res.success.msg });
        createUserModal.onClose();
        form.reset();
        return;
      } else {
        const res = await UpdateUserRole({
          token,
          userId: createUserModal.user?.id!,
          role: values.role,
        });

        if (res.error) {
          toast.error("Error", { description: res.error });
          return;
        }

        toast.success("Success", { description: res.success.msg });
        createUserModal.onClose();
        form.reset();
      }
    });
  };

  const headerContent = (
    <h1 className="text-xl">
      {createUserModal.type === "create" ? "Add User" : "Edit User"}
    </h1>
  );

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUserAction)}>
        <div className="space-y-4 p-4">
          <CustomInput
            control={form.control}
            label="First Name"
            name="firstName"
            placeholder="enter users first name."
            disabled={!!createUserModal.user}
          />

          <CustomInput
            control={form.control}
            label="Last Name"
            name="lastName"
            placeholder="enter users last name."
            disabled={!!createUserModal.user}
          />

          <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-center">
            <CustomInput
              control={form.control}
              label="Email"
              name="email"
              placeholder="enter users email."
              disabled={!!createUserModal.user}
            />

            <CustomInput
              control={form.control}
              label="Phone"
              name="phone"
              placeholder="enter users phone number."
              disabled={!!createUserModal.user}
            />
          </div>

          <CustomInput
            control={form.control}
            name="password"
            label="Password"
            placeholder={
              createUserModal.user ? "**********" : "enter user password"
            }
            show={!createUserModal.user ? show.password : false}
            handleShow={
              !createUserModal.user
                ? () => setShow({ password: !show.password })
                : undefined
            }
            disabled={!!createUserModal.user}
          />

          <CustomSelect
            label="Role"
            control={form.control}
            placeholder={
              createUserModal.user ? createUserModal.user.role : "EMPLOYEE"
            }
            name="role"
            items={
              <>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </>
            }
          />

          <div className="flex justify-end">
            <Button
              className="cursor-pointer text-xs"
              type="submit"
              isLoading={isPending}
              loadingText="creating"
              disabled={isPending}
              size={"sm"}
            >
              {createUserModal.type === "create"
                ? "Create User"
                : "Update User"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );

  return (
    <Modal
      headerContent={headerContent}
      body={bodyContent}
      isOpen={createUserModal.isOpen}
      onClose={createUserModal.onClose}
    />
  );
};
