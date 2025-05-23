"use client";

import { ProductTable } from "@/components/table/ProductTable";
import { Button } from "@/components/ui/button";
import useManageRestockLevelModal from "@/hooks/useManageRestockLevel";
import { ProductType } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const SingleProductsByName = ({
  type,
  brand,
  products,
}: {
  type: string;
  brand: string;
  products: ProductType[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const restockLevel = useManageRestockLevelModal();

  const name = searchParams.get("name");
  const qty = products.reduce((accu, p) => {
    return accu + p.quantity;
  }, 0);

  return (
    <div className="px-4 mb-18 space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant={"outline_blue"}
          size={"sm"}
          className="cursor-pointer flex items-center text-xs"
          onClick={() => router.push("/inventory")}
        >
          <ChevronLeft className="size-4 text-[#0C049B]" />
          Go Back
        </Button>
        <Button
          variant={"cauntr_blue"}
          size={"sm"}
          className="cursor-pointer text-xs"
          onClick={() => restockLevel.onOpen(name!)}
        >
          Manage Restock Level
        </Button>
      </div>

      <div className="rounded-lg p-4 bg-white space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-xl">
            {name}
            <span className="text-[#636363] text-sm ml-1">
              {products.length === 1 && products[0].sku}
            </span>
          </p>

          <Button
            variant={"outline_blue"}
            size={"sm"}
            className="cursor-pointer text-xs"
            onClick={() => router.push("/sell")}
          >
            Sell Product
          </Button>
        </div>
        <div className="flex items-center w-full gap-2">
          <div className="rounded-lg p-2 bg-[#F8F8F8] w-full pl-4">
            <p className="text-xs text-[#636363]">Category</p>
            <p className="font-semibold text-sm mt-1">{products[0].type}</p>
          </div>

          <div className="rounded-lg p-2 bg-[#F8F8F8] w-full pl-4">
            <p className="text-xs text-[#636363]">Quantity</p>
            <p className="font-semibold text-sm mt-1">{qty}</p>
          </div>
        </div>
      </div>

      {products.length > 1 && <ProductTable data={products} />}
    </div>
  );
};
