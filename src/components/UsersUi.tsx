"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { SupplierTable } from "./table/SupplierTable";
import { CustomerTable } from "./table/CustomerTable";

interface UserUiProps {
  type: "supplier" | "debtor" | "customer";
  userData: {
    fullName: string;
    email?: string;
    phoneNo: string;
    count: number;
    address?: string;
  };
  tableData: any[];
}

export const UsersUi = ({ type, userData, tableData }: UserUiProps) => {
  const router = useRouter();

  return (
    <div className="px-4 mb-20 lg:my-2 lg:mb-4 space-y-4">
      <Button
        variant={"outline_blue"}
        size={"sm"}
        onClick={() => router.back()}
        className="cursor-pointer text-xs"
      >
        Go Back
      </Button>

      <div className="border rounded-lg p-4 space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold">
          {userData.fullName}
        </h1>
        <p className="text-sm text-[#636363] capitalize">{type}</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="font-semibold mb-4">Personal Information</p>
        <hr />

        <div className="grid grid-cols-12 space-y-4 mt-4">
          <div className="col-span-6">
            <p className="text-xs md:text-sm text-[#636363]">Full Name</p>
            <p className="md:text-xl font-semibold text-sm truncate">
              {userData.fullName}
            </p>
          </div>
          <div className="col-span-6">
            <p className="text-xs md:text-sm text-[#636363]">Phone Number</p>
            <p className="md:text-xl font-semibold text-sm">
              {userData.phoneNo}
            </p>
          </div>
          <div className="col-span-6">
            <p className="text-xs md:text-sm text-[#636363]">Email Address</p>
            <p className="md:text-xl text-sm font-semibold truncate">
              {userData.email || "No Email Provided"}
            </p>
          </div>
          {/* <div className="col-span-6">
            <p className="text-xs md:text-sm text-[#636363]">
              {type === "supplier" ? "Supply" : "Buy"} Count
            </p>
            <p className="md:text-xl font-semibold text-sm">{userData.count}</p>
          </div> */}

          {userData.address && (
            <div className="col-span-6">
              <p className="text-xs md:text-sm text-[#636363]">Address</p>
              <p className="md:text-xl font-semibold">{userData.address}</p>
            </div>
          )}
        </div>
      </div>

      {type === "supplier" && <SupplierTable data={tableData} />}
      {type === "customer" && (
        <CustomerTable data={tableData} type="creditor" />
      )}
      {type === "debtor" && <CustomerTable data={tableData} type="debtor" />}
    </div>
  );
};
