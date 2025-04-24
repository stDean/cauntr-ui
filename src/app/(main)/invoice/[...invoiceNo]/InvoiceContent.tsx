"use client";

import { ResendInvoice } from "@/actions/invoice.a";
import { Button } from "@/components/ui/button";
import { useReduxState } from "@/hooks/useRedux";
import { SingleInvoiceProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, Download, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useTransition } from "react";
import { toast } from "sonner";

export const InvoiceContent = ({
  invoiceData,
  balanceDue,
  billTo,
  companyData,
  payments,
  products,
  bankPaidTo,
}: SingleInvoiceProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { token } = useReduxState();
  const status =
    invoiceData.status === "PART_PAID"
      ? "Part Payment"
      : invoiceData.status === "OVERDUE"
      ? "Overdue"
      : invoiceData.status === "DRAFT"
      ? "Pending"
      : "Paid";

  const handleResend = () => {
    startTransition(async () => {
      const res = await ResendInvoice({
        token,
        invoiceNo: invoiceData.invoiceNo,
      });

      if (res.error) {
        toast.error("Error", { description: res.error });
        return;
      }

      toast.success("Success", { description: res.success.msg });
    });
  };

  console.log({ bankPaidTo });

  return (
    <div className="px-4 mb-18 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Button
            variant={"outline_blue"}
            size={"sm"}
            className="cursor-pointer flex items-center"
            onClick={() => router.back()}
          >
            <ChevronLeft className="size-4 text-[#0C049B] mr-2" />
            Go Back
          </Button>
        </div>

        <div className="flex justify-between items-center gap-4">
          <Button
            variant={"outline"}
            size={"sm"}
            className="cursor-pointer flex items-center"
            onClick={() => console.log("Download Invoice")}
            disabled={isPending}
          >
            <Download className="size-[14px] mr-2" />
            Download Invoice
          </Button>

          <Button
            variant={"cauntr_blue"}
            size={"sm"}
            className="cursor-pointer flex items-center"
            onClick={handleResend}
            disabled={isPending}
          >
            <Send className="size-[14px] mr-2" />
            Resend Invoice
          </Button>
        </div>
      </div>

      <div className="space-y-4 flex md:gap-4 flex-col md:flex-row">
        <div className="md:flex-1 p-4 border rounded-lg space-y-4">
          <div>
            <h1 className="md:text-xl font-semibold">
              {invoiceData.invoiceNo}
            </h1>
            <p className="text-xs md:text-sm text-[#A3A3A3]">Invoice No</p>
          </div>

          <hr />

          <div>
            <p className="font-semibold text-sm">
              Invoice Date:{" "}
              <span>
                {new Date(invoiceData.invoiceDate).toLocaleDateString()}
              </span>
            </p>
            <p className="font-semibold text-sm">
              Payment Date:{" "}
              <span>
                {new Date(invoiceData.paymentDate).toLocaleDateString()}
              </span>
            </p>
          </div>

          <hr />

          <div className="flex flex-col gap-2 sm:flex-row justify-between">
            <div className="text-[#636363] text-xs flex-1 space-y-1">
              <p className="font-semibold !text-sm">{companyData.name}</p>
              <p>{companyData.address}</p>
              <p>{companyData.phone}</p>
              <p>{companyData.email}</p>
            </div>
            <div className="text-[#636363] text-xs flex-1 space-y-1">
              <p className="font-semibold !text-sm">Bill To</p>
              <p>{billTo.name}</p>
              <p>{billTo.address}</p>
              <p>{billTo.phone}</p>
              <p>{billTo.email}</p>
            </div>
            <div></div>
          </div>

          {balanceDue.amount && (
            <>
              <hr />

              <div className="font-semibold">
                ₦{balanceDue.amount} due on{" "}
                {new Date(balanceDue.dueDate).toLocaleDateString()}
              </div>
            </>
          )}

          <hr />

          <div className="">
            {products.map((p, i) => (
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

          <div className="text-[#121212] font-semibold flex items-center justify-between">
            <p>Subtotal</p>
            <p>₦{payments.subTotal}</p>
          </div>

          <div className="text-[#121212] font-semibold text-xl flex items-center justify-between">
            <p>Total Paid</p>
            <p>₦{payments.totalPaid}</p>
          </div>

          <hr />

          {bankPaidTo && bankPaidTo.acctName?.trim() !== undefined ? (
            <div className="space-y-1">
              <p className="font-semibold">Last Payment to:</p>
              <p className="text[#A3A3A3] text-sm">
                Account Name: {bankPaidTo.acctName}
              </p>
              <p className="text[#A3A3A3] text-sm">
                Bank name: {bankPaidTo.bankName}
              </p>
              <p className="text[#A3A3A3] text-sm">
                Account Number: {bankPaidTo.acctNo}
              </p>
            </div>
          ) : (
            <p className="font-semibold text-blue-400">
              Last payment made by Cash.
            </p>
          )}
        </div>

        <div className="w-[350px] p-4 border rounded-lg h-fit space-y-4 bg-white">
          <h1 className="text-xl font-semibold">Invoice Summary</h1>

          <div className="flex justify-between text-sm">
            <p>Status</p>
            <p
              className={cn(
                "text-[#5f5609] bg-[#FEFCEC] !text-xs py-2 px-3 rounded-full border border-[#5f5609]",
                {
                  "!text-[#034A12] !bg-[#ECFEF0] !py-1 !border-[#034A12]":
                    invoiceData.status === "PAID",
                  "!text-[#A00F0F] !bg-[#FEECEC] !py-1 !border-[#A00F0F]":
                    invoiceData.status === "OVERDUE",
                }
              )}
            >
              {status}
            </p>
          </div>

          <div className="flex justify-between text-sm">
            <p>Invoice Date:</p>
            <p>{new Date(invoiceData.invoiceDate).toLocaleDateString()}</p>
          </div>

          <div className="flex justify-between text-sm">
            <p>Payment Date:</p>
            <p>{new Date(invoiceData.paymentDate).toLocaleDateString()}</p>
          </div>

          <div className="flex justify-between bg-[#F8F8F8] p-4 md:p-4 text-sm font-semibold">
            <p>Total Amount Due:</p>
            <p>₦{balanceDue.amount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
