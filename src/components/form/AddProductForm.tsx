"use client";

import { AddProductSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { Form } from "../ui/form";
import { CustomInput } from "./ui/CustomInput";
import { CustomTextArea } from "./ui/CustomTextArea";
import { Button } from "../ui/button";
import useAddProductModal from "@/hooks/useAddProductModal";
import { CustomSelect } from "./ui/CustomSelect";
import { SelectItem } from "../ui/select";
import { CustomDatePicker } from "./ui/DatePicker";
import { CreateProduct } from "@/actions/inventory.a";
import { useReduxState } from "@/hooks/useRedux";
import { toast } from "sonner";

export const AddSingleProduct = () => {
  const addProductModal = useAddProductModal();
  const [isPending, startTransition] = useTransition();
  const [characterCounter, setCharacterCounter] = useState(0);
  const [showDrop, setShowDrop] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState(
    addProductModal.suppliers
  );
  const { token, loggedInUser } = useReduxState();

  const form = useForm<z.infer<typeof AddProductSchema>>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      product_name: "",
      brand: "",
      type: "",
      costPrice: "",
      description: "",
      purchaseDate: "",
      quantity: "1",
      sellingPrice: "",
      serial_no: "",
      status: "",
      supplier_email: "",
      supplier_name: "",
      supplier_phone_no: "",
    },
  });

  const createProduct = (values: z.infer<typeof AddProductSchema>) => {
    startTransition(async () => {
      const res = await CreateProduct({
        token,
        values,
        userId: loggedInUser!.id!,
      });

      if (res.error) {
        toast.error("Error", { description: res.error });
        return;
      }

      if (res.success) {
        toast.success("Success", {
          description: "Product created successfully",
        });
        addProductModal.onClose();
        form.reset();
      }
    });
  };

  useEffect(() => {
    setCharacterCounter(form.getValues("description")!.length);
  }, [form.watch("description")]);

  const supplierName = form.watch("supplier_name");

  useEffect(() => {
    if (supplierName) {
      setShowDrop(true);
    } else {
      setShowDrop(false);
    }
  }, [supplierName]);

  useEffect(() => {
    // Filter suppliers based on input
    if (supplierName) {
      const filtered = addProductModal.suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(supplierName.toLowerCase())
      );
      setFilteredSuppliers(filtered);
      setShowDrop(true);
    } else {
      setFilteredSuppliers(addProductModal.suppliers);
    }
  }, [supplierName, addProductModal.suppliers]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createProduct)}>
        <div className="px-6 py-3">
          <div className="space-y-4">
            <p className="font-semibold text-sm">Product Detail</p>

            <div className="space-y-2">
              <CustomInput
                control={form.control}
                label="Product Name"
                name="product_name"
                disabled={isPending}
                placeholder="enter product name"
              />

              <div className="flex gap-2 flex-col md:flex-row">
                <CustomInput
                  control={form.control}
                  label="Product Type"
                  name="type"
                  disabled={isPending}
                  placeholder="enter product type"
                />
                <CustomInput
                  control={form.control}
                  label="Product Brand"
                  name="brand"
                  disabled={isPending}
                  placeholder="enter product brand"
                />
              </div>

              <div className="flex gap-2 flex-col md:flex-row">
                <CustomSelect
                  control={form.control}
                  label="Status"
                  name="status"
                  disabled={isPending}
                  items={
                    <>
                      {["New", "Used"].map((type) => (
                        <SelectItem value={type.toUpperCase()} key={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </>
                  }
                />
                <CustomDatePicker
                  control={form.control}
                  label="Date"
                  name="purchaseDate"
                />
              </div>

              <div className="flex gap-2 flex-col md:flex-row">
                <CustomInput
                  control={form.control}
                  label="Serial Number (optional)"
                  name="serial_no"
                  disabled={isPending}
                  placeholder="enter serial number"
                />
                <CustomInput
                  control={form.control}
                  label="Quantity"
                  name="quantity"
                  disabled={isPending || form.watch("serial_no") !== ""}
                />
              </div>

              <div className="flex flex-col w-full">
                <CustomTextArea
                  name="description"
                  label="Description(optional)"
                  control={form.control}
                  placeholder="Item Description not more than 250 characters"
                  characterCounter={characterCounter}
                  characterLimit={250}
                />
                <p
                  className={`text-xs pt-1 ${
                    characterCounter >= 201 && "text-red-500"
                  } ${
                    characterCounter >= 150 &&
                    characterCounter <= 200 &&
                    "text-yellow-500"
                  } `}
                >
                  {characterCounter}/250
                </p>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="space-y-4">
            <p className="font-semibold text-sm">Pricing</p>

            <div className="space-y-2">
              <CustomInput
                control={form.control}
                label="Cost Price"
                name="costPrice"
                disabled={isPending}
                placeholder="How much was this product bought?"
              />
              <CustomInput
                control={form.control}
                label="Selling Price"
                name="sellingPrice"
                disabled={isPending}
                placeholder="How much is this product sold for?"
              />
            </div>
          </div>

          <hr className="my-4" />

          <div className="space-y-4">
            <p className="font-semibold text-sm">
              Supplier Details <span className="font-normal!">(Optional)</span>
            </p>

            <div className="space-y-2">
              <div className="relative w-full">
                <CustomInput
                  control={form.control}
                  label="Supplier Name"
                  name="supplier_name"
                  disabled={isPending}
                  placeholder="enter supplier name"
                />

                {showDrop && filteredSuppliers.length > 0 && (
                  <div className="absolute border rounded-lg z-50 w-full max-h-40 overflow-y-auto bg-white p-4 mt-2 shadow-lg">
                    {filteredSuppliers.map(({ name, contact, email }, idx) => (
                      <Fragment key={`${name}-${contact}-${idx}`}>
                        <div
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            form.setValue("supplier_name", name);
                            form.setValue("supplier_phone_no", contact);
                            form.setValue("supplier_email", email || "");
                            setShowDrop(false);
                          }}
                        >
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-xs text-gray-600">
                            {contact} | {email || "no email provided"}
                          </p>
                        </div>
                        {idx !== filteredSuppliers.length - 1 && (
                          <hr className="my-2" />
                        )}
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-col md:flex-row">
                <CustomInput
                  control={form.control}
                  label="Supplier Email"
                  name="supplier_email"
                  disabled={isPending}
                  placeholder="enter supplier email"
                />
                <CustomInput
                  control={form.control}
                  label="Supplier Phone Number"
                  name="supplier_phone_no"
                  disabled={isPending}
                  placeholder="enter supplier phone number"
                />
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-end">
            <Button
              variant={"cauntr_blue"}
              className="cursor-pointer"
              size={"sm"}
              isLoading={isPending}
              loadingText="creating"
              disabled={isPending}
            >
              Add Product
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
