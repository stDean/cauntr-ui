"use client";

import useAddProductModal from "@/hooks/useAddProductModal";
import { AddProductsType } from "@/lib/utils";
import { useState } from "react";
import { SelectButtons } from "../SelectButton";
import { Modal } from "./Modal";
import { Button } from "../ui/button";
import { AddSingleProduct } from "../form/AddProductForm";

export const AddProductModal = () => {
  const addProductModal = useAddProductModal();
  const [options, setOptions] = useState<{
    add_products: (typeof AddProductsType.options)[number];
  }>({ add_products: AddProductsType.options[0] });

  const handleChange = (val: (typeof AddProductsType.options)[number]) => {
    setOptions((prev) => ({
      ...prev,
      add_products: val,
    }));
  };

  const headerContent = (
    <div className="">
      <p className="text-xl">
        {addProductModal.type === "click"
          ? "Add Product"
          : options.add_products.title}
      </p>
      <p className="text-sm text-[#636363]">
        {addProductModal.type === "click"
          ? "Choose an option and add products to your inventory."
          : options.add_products.subTitle}
      </p>
    </div>
  );
  const bodyContent =
    addProductModal.type === "click" ? (
      <div>
        <SelectButtons options={options} onChange={handleChange} />
        <div className="flex justify-end px-6 pb-4">
          <Button
            variant={"cauntr_blue"}
            className="cursor-pointer"
            onClick={
              options.add_products.title === "Add an Item"
                ? () =>
                    addProductModal.onOpen("single", addProductModal.suppliers)
                : () => addProductModal.onOpen("multiple", [])
            }
          >
            Continue
          </Button>
        </div>
      </div>
    ) : addProductModal.type === "single" ? (
      <AddSingleProduct />
    ) : (
      <div>Add Multiple products</div>
    );

  return addProductModal.type === "click" ? (
    <Modal
      headerContent={headerContent}
      body={bodyContent}
      onClose={addProductModal.onClose}
      isOpen={addProductModal.isOpen}
    />
  ) : addProductModal.type === "single" ? (
    <Modal
      headerContent={headerContent}
      body={bodyContent}
      onClose={addProductModal.onClose}
      isOpen={addProductModal.isOpen}
      addStyle2
    />
  ) : (
    <Modal
      headerContent={headerContent}
      body={bodyContent}
      onClose={addProductModal.onClose}
      isOpen={addProductModal.isOpen}
    />
  );
};
