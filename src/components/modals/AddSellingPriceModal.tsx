"use client";

import useAddSellingPriceModal from "@/hooks/useAddSellingPriceModal";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Modal } from "./Modal";
import { useAppDispatch } from "@/app/redux";
import { SET_CART } from "@/state";

export const AddSellingPriceModal = () => {
  const dispatch = useAppDispatch();
  const addSellingPrice = useAddSellingPriceModal();
  const [sellingPrice, setSellingPrice] = useState("");

  const headerContent = <h1 className="text-xl ">Add to Basket</h1>;

  const bodyContent = (
    <div className="p-4 text-[#636363] space-y-4">
      <div className="bg-[#F8F8F8] p-4 rounded-lg space-y-3">
        <p className="font-semibold">Item</p>

        <p className="text-sm ">
          {addSellingPrice.product?.productName}{" "}
          {addSellingPrice.product?.serialNo &&
            `| ${addSellingPrice.product.serialNo}`}
        </p>
      </div>

      <div>
        <p className="text-[#3B3B3B] text-sm">Selling Price</p>
        <Input
          className="focus:!ring-0 focus:!border-0 my-1"
          value={sellingPrice}
          onChange={(e) => {
            setSellingPrice(e.target.value);
          }}
          placeholder="add selling price"
        />
        <p className="text-[#3B3B3B] text-xs">
          Cost Price: {addSellingPrice.product?.costPrice}
        </p>
      </div>

      <div className="w-full">
        <Button
          variant={"cauntr_blue"}
          size={"sm"}
          onClick={() => {
            dispatch(
              SET_CART({
                productName: addSellingPrice.product?.productName,
                price: sellingPrice,
                qty: addSellingPrice.product?.qty,
                id: addSellingPrice.product?.id,
                totalQty: addSellingPrice.product?.totalQty,
                sku: addSellingPrice.product?.sku,
              })
            );
            addSellingPrice.onClose();
            setSellingPrice("");
          }}
          className="w-full cursor-pointer text-xs"
          disabled={sellingPrice.trim() === ""}
        >
          Add Item
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={addSellingPrice.isOpen}
      onClose={() => {
        addSellingPrice.onClose();
        setSellingPrice("");
      }}
      headerContent={headerContent}
      body={bodyContent}
    />
  );
};
