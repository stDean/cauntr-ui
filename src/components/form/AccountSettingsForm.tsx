import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { z } from "zod";
import { AccountSettingsSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { CustomInput } from "./ui/CustomInput";
import { Button } from "../ui/button";
import { Pencil, Plus } from "lucide-react";

export const AccountSettingsForm = () => {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AccountSettingsSchema>>({
    resolver: zodResolver(AccountSettingsSchema),
    defaultValues: {
      businessName: "",
      address: "",
      category: "",
      email: "company@company.com",
      phone: "",
      tin: "",
    },
  });

  const banks: Array<any> = [];

  const handleSave = (values: z.infer<typeof AccountSettingsSchema>) => {
    startTransition(async () => {
      console.log({ values });
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <div className="border rounded-lg px-6 py-8 w-full md:w-2xl space-y-5 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-2xl">Account</h1>

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
          <CustomInput
            control={form.control}
            name="businessName"
            label="Business Name"
            placeholder="enter a business name"
            disabled={!canEdit}
          />

          <CustomInput
            control={form.control}
            name="category"
            label="Category"
            placeholder="enter a products category"
            disabled={!canEdit}
          />

          <CustomInput
            control={form.control}
            name="email"
            label="Contact Email"
            disabled={!canEdit}
          />

          <CustomInput
            control={form.control}
            name="phone"
            label="Contact Phone Number"
            placeholder="enter a business phone number"
            disabled={!canEdit}
          />

          <CustomInput
            control={form.control}
            name="address"
            label="Business Address"
            placeholder="enter a business address"
            disabled={!canEdit}
          />

          <CustomInput
            control={form.control}
            name="tin"
            label="Tax Identification Number"
            placeholder="enter a business TIN"
            disabled={!canEdit}
          />

          {banks.length > 0 && (
            <div className="flex gap-2">
              {banks.map((bank) => (
                <CustomInput
                  key={bank.name}
                  control={form.control}
                  name="tin"
                  label="Tax Identification Number"
                  placeholder="enter a business TIN"
                  disabled={!canEdit}
                />
              ))}
            </div>
          )}

          {canEdit && (
            <div
              className="bg-[#f4f4f4] py-3 w-full flex items-center justify-center gap-3 cursor-pointer"
              onClick={() => {
                console.log("Pop Up Modal");
              }}
            >
              <p className="text-sm">Add Bank</p> <Plus className="size-4" />
            </div>
          )}

          {canEdit && (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setCanEdit(false);
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant={"cauntr_blue"}
                type="submit"
                className="cursor-pointer"
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
