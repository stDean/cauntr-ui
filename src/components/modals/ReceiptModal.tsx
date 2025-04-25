"use client";

import useReceiptModal from "@/hooks/useReceiptModal";
import { X } from "lucide-react";
import Image from "next/image";
import { Modal } from "./Modal";
export const ReceiptModal = () => {
  const recieptModal = useReceiptModal();

  const items = [
    {
      name: "Apple iPhone 15",
      quantity: 1,
      price: 399.99,
      total: 399.99,
    },
    {
      name: "Airpods Max 2024",
      quantity: 1,
      price: 499.99,
      total: 499.99,
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalDue = subtotal;
  const amountPaid = 699.98;
  const balance = totalDue - amountPaid;

  const bodyContent = (
    <div className="flex flex-col gap-5 p-4 w-full ">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md md:text-xl font-semibold">Reciept 2020</p>
          <p className="md:p-2 p-0.5  bg-[#FEFCEC] text-[#5F5609] rounded-lg text-center  text-xs md:text-sm">
            pending
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <X className="size-4 cursor-pointer" onClick={recieptModal.onClose} />
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

      <p className="text-xs md:text-sm font-medium">Payment Date: 04-05-2025</p>

      <div className="grid grid-cols-12">
        <div className="col-span-6 o-3 space-y-2">
          <p className="font-semibold md:text-base text-sm">Tigo Gadgets</p>
          <p className="text-xs md:text-sm">15a, Pepple street,</p>
          <p className="text-xs md:ext-sm">Computer Village,</p>
          <p className="text-xs md:text-sm">Lagos State</p>
          <p className="text-xs md:text-sm">09112341231</p>
          <p className="text-xs md:text-sm">Tigogadgets@gmail.com</p>
        </div>
        <div className="col-span-6 o-3 space-y-2">
          <p className="font-semibold md:text-base text-sm">Tbill to</p>
          <p className="text-xs md:text-sm">15a, Pepple street,</p>
          <p className="text-xs md:text-sm">Computer Village,</p>
          <p className="text-xs md:text-sm">Lagos State</p>
          <p className="text-xs md:text-sm">09112341231</p>
          <p className="text-xs md:text-sm">Tigogadgets@gmail.com</p>
        </div>
      </div>

      <div className="px-4 py-6 bg-[#F8F8F8] rounded-lg">
        <div className="max-w-2xl mx-auto">
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b  border-[#eeeeee]">
                <th className="text-left pb-2  text-[#121212] font-bold text-xs md:text-sm">
                  Product Name
                </th>
                <th className="text-center pb-2  text-[#121212] font-bold text-xs md:text-sm">
                  Quantity
                </th>
                <th className="text-right pb-2  text-[#121212] font-bold text-xs md:text-sm">
                  Price
                </th>
                <th className="text-right pb-2  text-[#121212] font-bold text-xs md:text-sm">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 text-[#3B3B3B] text-xs md:text-sm font-medium">
                    {item.name}
                  </td>
                  <td className="text-center py-3 text-[#3B3B3B] text-xs md:text-sm font-medium">
                    {item.quantity}
                  </td>
                  <td className="text-right py-3 text-[#3B3B3B] text-xs md:text-sm font-medium">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="text-right py-3 text-[#3B3B3B] text-xs md:text-sm font-medium">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}

              <tr>
                <td className="pt-3 font-bold text-[#121212] text-xs md:text-sm">
                  Subtotal
                </td>
                <td colSpan={2}></td>
                <td className="text-right pt-3 font-bold text-[#121212] text-xs md:text-sm">
                  ${subtotal.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="pt-2 font-bold text-[#121212] text-xs md:text-sm">
                  VAT
                </td>
                <td colSpan={2}></td>
                <td className="text-right pt-2 text-xs md:text-sm ">$0.00</td>
              </tr>
              <tr className="border-t">
                <td className="pt-3 font-bold text-[#121212] text-xs md:text-sm">
                  Total Amount Due
                </td>
                <td colSpan={2}></td>
                <td className="text-right pt-3 font-bold text-[#121212] text-xs md:text-sm">
                  ${totalDue.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between mt-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="font-bold text-[#121212] text-xs md:text-sm">
                Amount Paid:
              </div>
              <div className="font-bold text-[#121212] text-xs md:text-sm">
                Balance:
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="text-xs md:text-sm">${amountPaid.toFixed(2)}</div>
              <div className="text-xs md:text-sm">${balance.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {balance > 0 ? (
        <div className="border-b border-[#eeeeee] py-4">
          <p className="font-bold text-sm md:text-md text-[#121212] ">
            <span className="font-medium text-xs md:text-sm ">balance - </span>$
            {balance}{" "}
          </p>
        </div>
      ) : (
        ""
      )}

      <div className="space-y-2">
        <p className="font-bold text-[#121212] text-xs md:text-sm">
          Paid with bank Transfer to:
        </p>
        <div className="flex space-x-5">
          <p className="text-[#A3A3A3] font-medium text-xs md:text-sm">
            Account Name:
          </p>
          <p className="text-[#3B3B3B] text-xs md:text-sm font-medium">
            OMITAOMU, Basit
          </p>
        </div>
        <div className="flex space-x-5">
          <p className="text-[#A3A3A3] font-medium text-xs md:text-sm">
            Bank Name:
          </p>
          <p className="text-[#3B3B3B] text-xs md:text-sm font-medium">
            GT Bank{" "}
          </p>
        </div>
        <div className="flex space-x-5">
          <p className="text-[#A3A3A3] font-medium text-xs md:text-sm">
            Bank Account:
          </p>
          <p className="text-[#3B3B3B] text-xs md:text-sm font-medium">
            0242510812
          </p>
        </div>
      </div>
    </div>
  );

  // TODO:Check how we can add a bank acct to transfer to!!

  return (
    <Modal
      isOpen={recieptModal.isOpen}
      onClose={recieptModal.onClose}
      body={bodyContent}
      addStyle2
    />
  );
};
