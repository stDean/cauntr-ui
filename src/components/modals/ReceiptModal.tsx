"use client";

import useReceiptModal from "@/hooks/useReceiptModal";
import { X } from "lucide-react";
import Image from "next/image";
import { Modal } from "./Modal";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export const ReceiptModal = () => {
  const receiptModal = useReceiptModal();

  const status =
    receiptModal.receipt?.invoiceData.status === "PART_PAID"
      ? "Part Payment"
      : receiptModal.receipt?.invoiceData.status === "OVERDUE"
      ? "Overdue"
      : receiptModal.receipt?.invoiceData.status === "DRAFT"
      ? "Pending"
      : "Paid";

  const bodyContent = (
    <div className="flex flex-col gap-5 p-4 w-full ">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md md:text-xl font-semibold">
            Receipt {receiptModal.receipt?.invoiceData.invoiceNo}
          </p>

          <p
            className={cn(
              "text-[#5f5609] bg-[#FEFCEC] !text-xs py-2 px-3 rounded-full border border-[#5f5609] w-fit",
              {
                "!text-[#034A12] !bg-[#ECFEF0] !py-1 !border-[#034A12]":
                  receiptModal.receipt?.invoiceData.status === "PAID",
                "!text-[#A00F0F] !bg-[#FEECEC] !py-1 !border-[#A00F0F]":
                  receiptModal.receipt?.invoiceData.status === "OVERDUE",
              }
            )}
          >
            {status}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <X className="size-4 cursor-pointer" onClick={receiptModal.onClose} />
          <Image
            width={70}
            height={70}
            priority
            src={"/logo.png"}
            alt=""
            className=""
          />
        </div>
      </div>

      <p className="text-xs md:text-sm font-medium">
        Payment Date:{" "}
        <span>
          {new Date(
            receiptModal.receipt?.invoiceData.paymentDate
          ).toLocaleDateString()}
        </span>
      </p>

      <div className="flex flex-col gap-2 sm:flex-row justify-between">
        <div className="text-[#636363] text-xs flex-1 space-y-1">
          <p className="font-semibold !text-sm">
            {receiptModal.receipt?.companyData.name}
          </p>
          <p>{receiptModal.receipt?.companyData.address}</p>
          <p>{receiptModal.receipt?.companyData.phone}</p>
          <p>{receiptModal.receipt?.companyData.email}</p>
        </div>
        <div className="text-[#636363] text-xs flex-1 space-y-1">
          <p className="font-semibold !text-sm">Bill To</p>
          <p>{receiptModal.receipt?.billTo.name}</p>
          <p>{receiptModal.receipt?.billTo.address}</p>
          <p>{receiptModal.receipt?.billTo.phone}</p>
          <p>{receiptModal.receipt?.billTo.email}</p>
        </div>
      </div>

      <div className="">
        {receiptModal.receipt?.products.map((p: any, i: number) => (
          <Fragment key={`${p.totalPrice} - ${i}`}>
            <div className="grid grid-cols-12 py-4">
              <p className="col-span-8 text-[#121212] font-medium md:text-base text-sm">
                {p.name}{" "}
                <span className="text-[#808080]  text-xs text-medium">
                  x{p.qty}
                </span>
              </p>
              <div className="flex justify-between col-span-4">
                <p className="font-medium md:text-sm text-xs">x{p.qty}</p>
                <p className="font-medium md:text-sm text-xs">
                  ₦{p.totalPrice}
                </p>
              </div>
            </div>

            <hr />
          </Fragment>
        ))}
      </div>

      {receiptModal.receipt?.balanceDue.amount && (
        <div className="border-b border-[#eeeeee] py-4">
          <p className="font-bold text-sm md:text-md text-[#121212] ">
            <span className="font-medium text-xs md:text-sm ">balance - </span>$
            {receiptModal.receipt?.balanceDue.amount}
          </p>
        </div>
      )}

      {receiptModal.receipt?.bankPaidTo &&
      receiptModal.receipt?.bankPaidTo.acctName?.trim() !== undefined ? (
        <div className="space-y-1">
          <p className="font-semibold">Last Payment to:</p>
          <p className="text[#A3A3A3] text-sm">
            Account Name: {receiptModal.receipt?.bankPaidTo.acctName}
          </p>
          <p className="text[#A3A3A3] text-sm">
            Bank name: {receiptModal.receipt?.bankPaidTo.bankName}
          </p>
          <p className="text[#A3A3A3] text-sm">
            Account Number: {receiptModal.receipt?.bankPaidTo.acctNo}
          </p>
        </div>
      ) : (
        <p className="font-semibold text-blue-400">
          Last payment made by Cash.
        </p>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={receiptModal.isOpen}
      onClose={receiptModal.onClose}
      body={bodyContent}
      addStyle2
    />
  );
};
