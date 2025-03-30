import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { z } from "zod";
import { AccountSettingsSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { CustomInput } from "./ui/CustomInput";
import { Button } from "../ui/button";
import { Pencil, Plus, X } from "lucide-react";
import useAddBankModal from "@/hooks/useAddBankModal";
import { Input } from "../ui/input";

export const AccountSettingsForm = () => {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const addBankModal = useAddBankModal();

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

  interface Bank {
    bankName: string;
    acctNo: string;
  }

  const banksFromBackEnd: Bank[] = [{ bankName: "Hello", acctNo: "4444" }];
  /**
   * Merges two arrays of banks (`banksFromBackEnd` and `addBankModal.banks`) into a single array
   * while ensuring that there are no duplicate entries based on the `acctNo` property.
   * 
   * The merging process involves:
   * - Combining both arrays into a single array.
   * - Using a `Map` to store each bank object with its `acctNo` as the key.
   *   This ensures that only the last occurrence of a bank with a given `acctNo` is retained.
   * - Extracting the unique bank objects from the `Map` using its `values()` method.
   * 
   * @constant
   * @type {Bank[]}
   * @returns {Bank[]} An array of unique bank objects, where duplicates are removed based on `acctNo`.
   */
  const banks: Bank[] = [
    ...new Map(
      [...banksFromBackEnd, ...addBankModal.banks].map((bank) => [
        bank.acctNo,
        bank,
      ])
    ).values(),
  ];

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
            <div className="flex gap-1 flex-col max-h-[150px] overflow-y-scroll">
              <p className="text-xs text-gray-700">Banks</p>
              <div className="grid grid-cols-12 gap-2">
                {banks.map((bank) => (
                  <div
                    key={`${bank.bankName} - ${bank.acctNo}`}
                    className="relative flex items-center w-full px-3 border rounded-lg col-span-6"
                  >
                    <Input
                      disabled
                      value={`${bank.acctNo} - ${bank.bankName}`}
                      className="w-full border-hidden"
                    />

                    {addBankModal.banks.some(
                      (b) =>
                        b.bankName === bank.bankName && b.acctNo === bank.acctNo
                    ) && (
                      <X
                        className="size-4 cursor-pointer justify-end"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the click event from propagating
                          addBankModal.removeBank(bank);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {canEdit && (
            <div
              className="bg-[#f4f4f4] py-3 w-full flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-200"
              onClick={addBankModal.onOpen}
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
