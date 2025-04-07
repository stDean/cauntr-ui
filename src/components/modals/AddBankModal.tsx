"use client";

import useAddBankModal from "@/hooks/useAddBankModal";
import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Modal } from "./Modal";

const BankInput = ({
  title,
  placeholder,
  handleChange,
  name,
  value,
}: {
  title: string;
  placeholder: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
}) => {
  return (
    <div>
      <p className="text-sm">{title}</p>
      <Input
        placeholder={placeholder}
        className="h-10"
        name={name}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};
export const AddBankModal = () => {
  const [bank, setBank] = useState<{
    bankName: string;
    acctNo: string;
    acctName?: "";
  }>({
    bankName: "",
    acctNo: "",
    acctName: "",
  });
  const addBankModal = useAddBankModal();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setBank((prevBank) => ({
      ...prevBank,
      [name]: value,
    }));
  };

  const headerContent = (
    <h1 className="text-xl font-semibold">Add Bank</h1>
  );

  const bodyContent = (
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
          onClick={() => {
            addBankModal.addBank(bank!);
            setBank({ bankName: "", acctNo: "", acctName: "" });
            addBankModal.onClose();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
  return (
    <Modal
      body={bodyContent}
      headerContent={headerContent}
      isOpen={addBankModal.isOpen}
      onClose={addBankModal.onClose}
    />
  );
};
