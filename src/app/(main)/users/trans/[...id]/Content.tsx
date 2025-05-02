"use client";

import { Button } from "@/components/ui/button";
import usePayBalanceModal from "@/hooks/usePayBalanceModal";
import { SingleSalesProps } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

export const Content = ({
  saleData,
  itemId,
}: {
  saleData: SingleSalesProps;
  itemId: string;
}) => {
  const { customer, paymentHistory, salesSummary, soldBy, totalPay } = saleData;
  const router = useRouter();
  const payBalance = usePayBalanceModal();

  const nameSplit = customer.name && customer.name.split(" ");
  const first = nameSplit && nameSplit[0][0];
  const second = nameSplit && nameSplit.length === 2 && nameSplit[1][0];

  return (
    <div className="px-4 mb-18 space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant={"outline_blue"}
          size={"sm"}
          className="cursor-pointer flex items-center text-xs"
          onClick={() => router.back()}
        >
          <ChevronLeft className="size-4 text-[#0C049B]" />
          Go Back
        </Button>
        {paymentHistory[0].balanceOwed !== "0" && (
          <div className="">
            <Button
              variant={"cauntr_blue"}
              size={"sm"}
              className="cursor-pointer items-center text-xs"
              onClick={() => payBalance.onOpen(itemId)}
            >
              Pay Balance
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg p-5 border  border-[#EEEEEE] space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="font-medium text-sm">
              Sold By: <span className="font-bold">{soldBy.name}</span>
            </p>
            <p className="text-sm font-medium text-[#636363]">
              Sale Type: {soldBy.type === "BULK_SALE" ? "Bulk Sale" : "Sale"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-medium text-sm">
              Amount Paid:{" "}
              <span className="font-bold text-base">
                {formatNaira(Number(paymentHistory[0].amountPaid))}
              </span>
            </p>
            <p className="font-medium text-sm">
              Balance Owed:{" "}
              <span className="font-bold text-base">
                {formatNaira(Number(paymentHistory[0].balanceOwed))}
              </span>
            </p>
          </div>
        </div>

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
                  {formatNaira(sales.price)}
                </p>
              </div>
            </div>

            <hr />
          </Fragment>
        ))}

        <div className="text-[#121212] font-semibold text-xl flex items-center justify-between">
          <p>Total</p>
          <p>{formatNaira(totalPay)}</p>
        </div>
      </div>
    </div>
  );
};
