"use client";

import { CreateCustomer } from "@/actions/users.a";
import useAddCustomerModal from "@/hooks/useAddCustomerModal";
import { useReduxState } from "@/hooks/useRedux";
import { AddCustomerSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomInput } from "../form/ui/CustomInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Modal } from "./Modal";

export const AddCustomerModal = () => {
  const addCustomer = useAddCustomerModal();
  const [isPending, startTransition] = useTransition();
  const { token, loggedInUser } = useReduxState();

  const form = useForm<z.infer<typeof AddCustomerSchema>>({
    resolver: zodResolver(AddCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
  });

  const createCustomer = (values: z.infer<typeof AddCustomerSchema>) => {
    startTransition(async () => {
      const res = await CreateCustomer({
        token,
        userId: loggedInUser!.id!,
        userData: values,
      });

      if (res.error) {
        toast.error("Error", { description: res.error });
        addCustomer.onClose();
        return;
      }

      toast.success("Success", { description: res.success.msg });
      addCustomer.onClose();
    });
  };

  const headerContent = <p>Add New Customer</p>;

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createCustomer)}>
        <div className="p-4 space-y-4">
          <CustomInput
            control={form.control}
            label="First Name"
            name="firstName"
            placeholder="enter first name"
            withSpan
          />

          <CustomInput
            control={form.control}
            label="Last Name"
            name="lastName"
            placeholder="enter last name"
            withSpan
          />

          <CustomInput
            control={form.control}
            label="Phone Number"
            name="phone"
            placeholder="enter phone number"
            withSpan
          />

          <CustomInput
            control={form.control}
            label="Email (Optional)"
            name="email"
            placeholder="enter email"
          />
        </div>

        <div className="px-4 pb-4 flex justify-end">
          <Button
            variant={"cauntr_blue"}
            size={"sm"}
            className="cursor-pointer"
            disabled={isPending}
            loadingText="creating"
            isLoading={isPending}
          >
            Add Customer
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <Modal
      isOpen={addCustomer.isOpen}
      onClose={addCustomer.onClose}
      headerContent={headerContent}
      body={bodyContent}
    />
  );
};
