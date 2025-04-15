"use client";

import { CreateCustomer } from "@/actions/users.a";
import useAddCustomerModal from "@/hooks/useAddCustomerModal";
import { useReduxState } from "@/hooks/useRedux";
import { AddCustomerSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomInput } from "../form/ui/CustomInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Modal } from "./Modal";
import { BankInput } from "./AddBankModal";
import { CreateBank } from "@/actions/inventory.a";

export const AddCustomerModal = () => {
  const addCustomer = useAddCustomerModal();
  const [isPending, startTransition] = useTransition();
  const { token, loggedInUser } = useReduxState();
  const [bank, setBank] = useState<{
    bankName: string;
    acctNo: string;
    acctName?: "";
  }>({
    bankName: "",
    acctNo: "",
    acctName: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setBank((prevBank) => ({
      ...prevBank,
      [name]: value,
    }));
  };

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

  const createBank = () => {
    startTransition(async () => {
      const res = await CreateBank({
        token,
        userId: loggedInUser!.id,
        bank: {
          acctNo: bank.acctNo,
          bankName: bank.bankName,
          acctName: bank.acctName,
        },
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

  const headerContent = (
    <p className="text-xl">
      {addCustomer.type === "customer" ? "Add New Customer" : "Add New Bank"}
    </p>
  );

  const bodyContent =
    addCustomer.type === "customer" ? (
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
    ) : (
      <div className="space-y-4 p-4">
        <BankInput
          title="Bank Name"
          placeholder="enter bank name."
          handleChange={handleChange}
          name="bankName"
          value={bank.bankName}
        />
        <BankInput
          title="Account Number"
          placeholder="enter account number."
          handleChange={handleChange}
          name="acctNo"
          value={bank.acctNo}
        />
        <BankInput
          title="Account Name"
          placeholder="enter account name."
          handleChange={handleChange}
          name="acctName"
          value={bank.acctName || ""}
        />

        <div className="pt-2 flex justify-end gap-4">
          <Button
            className="cursor-pointer"
            onClick={createBank}
            variant={"cauntr_blue"}
            size={"sm"}
            disabled={isPending}
            loadingText="creating"
            isLoading={isPending}
          >
            Add Bank
          </Button>
        </div>
      </div>
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
