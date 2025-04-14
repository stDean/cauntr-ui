"use client";

import React, { use } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Eye,
  ShoppingCart,
  ChevronDown,
  Download,
  SendHorizontal,
} from "lucide-react";
import { SalesType } from "@/lib/types";
import { PaymentTable } from "@/components/table/PaymentTable";
import { PaymentHistoryData as data } from "../Data";
import useRecieptModal from "@/hooks/useRecieptModal";
interface DataType {
  name: string;
  sales: SalesType[];
}

export const SingleSalesByName = ({ name, sales }: DataType) => {
  const [Actions, setActions] = React.useState(false);
  const router = useRouter();

  const recieptModal = useRecieptModal();
  return (
    <div className="px-4 mb-18 space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant={"outline_blue"}
          size={"sm"}
          className="cursor-pointer flex items-center"
          onClick={() => router.push("/sales")}
        >
          <ChevronLeft className="size-4 text-[#0C049B]" />
          Go Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant={"outline_blue"}
            size={"sm"}
            className="cursor-pointer  items-center space-x-2 hidden md:flex"
            onClick={recieptModal.onOpen}
          >
            <Eye className="size-4 mr-2" />
            View Reciepts
          </Button>
          <Button
            variant={"cauntr_blue"}
            size={"sm"}
            className="cursor-pointer items-center hidden md:flex space-x-2"
          >
            <ShoppingCart className="size-4 mr-2" />
            Re-send Reciepts
          </Button>
          {/*Mobile Button */}
          <div className="relative">
            <Button
              variant={"cauntr_blue"}
              size={"sm"}
              className="cursor-pointer items-center flex md:hidden space-x-2"
              onClick={() => {
                setActions(!Actions);
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
        Actions
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
            >
              <div
                className="flex gap-3 cursor-pointer items-center hover:bg-gray-50 rounded p-1"
                onClick={() => {
                  recieptModal.onOpen();
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
                  Download Recipts
                </p>
                <Download size={15} />
              </div>
              <div className="flex gap-3 cursor-pointer items-center hover:bg-gray-50 rounded p-1">
                <p className="text-[#3F3B3B] font-medium text-sm">
                  Re-send Recipts
                </p>
                <SendHorizontal size={15} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-5 border  border-[#EEEEEE] space-y-3">
        <p className="md:text-md text-sm font-medium text-[#121212]">
          Employer Name - {name}
        </p>
        <p className="md:text-sm text-xs font-bold text-[#636363]">SKU-015</p>
        <p className="font-medium text-sm">
          {" "}
          Sold by: <span className="font-bold"> Ilori Gbenga</span>
        </p>
        <div className=" bg-[#f8f8f8] rounded-lg p-4 border  space-y-4">
          <p>To:</p>
          <div className="flex items-center gap-4">
            <div className="rounded-full p-5 bg-[#eeeeee]">
              <p className="font-bold text-md md:text-xl">TO</p>
            </div>
            <div>
              <p className="font-bold md:text-sm text-xs">Toba Ogundimu</p>
              <p className="text-[#A3A3A3] md:text-sm text-xs">tobaogundimu@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-5 border  border-[#EEEEEE] space-y-5">
        <p className="font-bold text-sm md:text-md">Sale summary</p>
        <div className="grid grid-cols-12">
          <p className="col-span-8 text-[#121212] font-medium md:text-sm text-xs">
            {" "}
            Apple M1 macbook pro 2020{" "}
            <span className="text-[#808080] md:text-sm text-xs text-medium"> x2</span>
          </p>
          <div className="flex justify-between col-span-4">
            <p className="font-medium md:text-sm text-xs">x2</p>
            <p className="font-medium md:text-sm text-xs">₦1,200,000</p>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-12">
          <p className="col-span-8 text-[#121212] font-medium md:text-sm text-xs">
            {" "}
            Apple Macbook pro 2019{" "}
            <span className="text-[#808080] md:text-sm text-xs text-medium"> x2</span>
          </p>
          <div className="flex justify-between col-span-4">
            <p className="font-medium md:text-sm text-xs">x2</p>
            <p className="font-medium md:text-sm text-xs">₦800,000</p>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-12">
          <p className="col-span-8 text-[#121212] font-medium md:text-sm text-xs">
            {" "}
            Google Pixel 8 pro{" "}
            <span className="text-[#808080] md:text-sm text-xs text-medium"> x2</span>
          </p>
          <div className="flex justify-between col-span-4">
            <p className="font-medium md:text-sm text-xs">x1</p>
            <p className="font-medium md:text-sm text-xs">₦500,000</p>
          </div>
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <p className="text-[#121212] md:text-sm text-xs font-medium">total</p>
          <p className="text-[#121212] md:text-sm text-xs font-medium">₦2,500,000</p>
        </div>
      </div>

      <PaymentTable data={data} />
    </div>
  );
};
