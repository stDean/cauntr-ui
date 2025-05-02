"use client";

import { GetInvoice, ResendInvoice } from "@/actions/invoice.a";
import { PaymentTable } from "@/components/table/PaymentTable";
import { Button } from "@/components/ui/button";
import useReceiptModal from "@/hooks/useReceiptModal";
import { useReduxState } from "@/hooks/useRedux";
import { SingleSalesProps } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import {
  ChevronDown,
  ChevronLeft,
  Download,
  Eye,
  SendHorizontal,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export const SingleSales = ({ saleData }: { saleData: SingleSalesProps }) => {
  const {
    customer,
    paymentHistory,
    salesSummary,
    soldBy,
    totalPay,
    invoiceNo,
  } = saleData;
  const [actions, setActions] = useState(false);
  const router = useRouter();
  const [receipt, setReceipt] = useState(null);
  const { token, loggedInUser } = useReduxState();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchReceipt = async () => {
      const res = await GetInvoice({
        token,
        userId: loggedInUser!.id,
        invoiceNo,
      });

      if (res.success) {
        setReceipt(res.success.data);
      }
    };

    fetchReceipt();
  }, [invoiceNo, loggedInUser, token]);

  const handleResend = () => {
    startTransition(async () => {
      const res = await ResendInvoice({ token, invoiceNo });

      if (res.error) {
        toast.error("Error", { description: res.error });
        return;
      }

      toast.success("Success", { description: res.success.msg });
    });
  };

  const receiptModal = useReceiptModal();

  const nameSplit = customer.name && customer.name.split(" ");
  const first = nameSplit && nameSplit[0][0];
  const second = nameSplit && nameSplit.length === 2 && nameSplit[1][0];

  return (
    <div className="px-4 mb-18 space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant={"outline_blue"}
          size={"sm"}
          className="cursor-pointer flex items-center"
          onClick={() => router.push("/sales")}
        >
          <ChevronLeft className="size-4 text-[#0C049B] mr-2" />
          Go Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant={"outline_blue"}
            size={"sm"}
            className="cursor-pointer  items-center space-x-2 hidden md:flex"
            onClick={() => receiptModal.onOpen(receipt)}
          >
            <Eye className="size-4 mr-2" />
            View Receipts
          </Button>
          <Button
            variant={"cauntr_blue"}
            size={"sm"}
            className="cursor-pointer items-center hidden md:flex space-x-2"
            onClick={handleResend}
            disabled={isPending}
            isLoading={isPending}
            loadingText="Sending"
          >
            {!isPending && <ShoppingCart className="size-4 mr-2" />}
            Re-send Receipts
          </Button>
          {/*Mobile Button */}
          <div className="relative">
            <Button
              variant={"cauntr_blue"}
              size={"sm"}
              className="cursor-pointer items-center flex md:hidden space-x-2"
              onClick={() => {
                setActions(!actions);
              }}
            >
              <ChevronDown className="size-4 mr-2" />
              <p className="text-sm">Actions</p>
            </Button>

            {/* Mobile button */}
            <div
              className={`absolute bg-white rounded-lg border shadow-lg p-4 mt-2 right-0 space-y-5 w-[200px] md:hidden
      transition-all duration-300 ease-in-out transform origin-top-right
      ${
        actions
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
            >
              <div
                className="flex gap-3 cursor-pointer items-center hover:bg-gray-50 rounded p-1"
                onClick={() => {
                  receiptModal.onOpen(receipt);
                  setActions(false);
                }}
              >
                <p className="text-[#3F3B3B] font-medium text-sm">
                  View Receipts
                </p>
                <Eye size={15} />
              </div>
              <div className="flex gap-3 cursor-pointer items-center hover:bg-gray-50 rounded p-1">
                <p className="text-[#3F3B3B] font-medium text-sm">
                  Download Receipt
                </p>
                <Download size={15} />
              </div>
              <div
                className="flex gap-3 cursor-pointer items-center hover:bg-gray-50 rounded p-1"
                onClick={() => {
                  handleResend();
                  setActions(false);
                }}
              >
                <p className="text-[#3F3B3B] font-medium text-sm">
                  Re-send Receipt
                </p>
                <SendHorizontal size={15} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-5 border  border-[#EEEEEE] space-y-3">
        <p className="font-medium text-sm">
          Sold By: <span className="font-bold">{soldBy.name}</span>
        </p>
        <p className="text-sm font-medium text-[#636363]">
          Sale Type: {soldBy.type === "BULK_SALE" ? "Bulk Sale" : "Sale"}
        </p>

        {customer.name && (
          <div className=" bg-[#f8f8f8] rounded-lg p-4 border  space-y-4">
            <p>To:</p>
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-[#eeeeee]">
                <p className="font-bold">
                  {first}
                  {second}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold md:text-sm text-xs">{customer.name}</p>
                <p className="text-[#A3A3A3] text-sm">
                  {customer.email || "No Customer Email"} | {customer.phone}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg p-5 border  border-[#EEEEEE] space-y-5">
        <p className="font-bold text-sm md:text-md">Sale summary</p>

        {salesSummary.map((sales, idx) => (
          <Fragment key={`${sales.price} - ${idx}`}>
            <div className="grid grid-cols-12">
              <p className="col-span-8 text-[#121212] font-medium md:text-base text-sm">
                {sales.productName}{" "}
                <span className="text-[#808080]  text-xs text-medium">
                  x{sales.qty}
                </span>
              </p>
              <div className="flex justify-between col-span-4">
                <p className="font-medium md:text-sm text-xs">x{sales.qty}</p>
                <p className="font-medium md:text-sm text-xs">
                  {formatNaira(Number(sales.price))}
                </p>
              </div>
            </div>

            <hr />
          </Fragment>
        ))}

        <div className="text-[#121212] font-semibold text-xl flex items-center justify-between">
          <p>Total</p>
          <p>{formatNaira(Number(totalPay))}</p>
        </div>
      </div>

      <PaymentTable data={paymentHistory} />
    </div>
  );
};
