import { useAppDispatch } from "@/app/redux";
import { SellProductProps } from "@/lib/types";
import { ADD_TO_QUANTITY, SET_CART } from "@/state";
import { ColumnDef } from "@tanstack/react-table";
import { ShoppingCart } from "lucide-react";

export const SellProductColumn: ColumnDef<SellProductProps>[] = [
  {
    accessorKey: "productName",
    header: () => <span className="text-xs md:text-sm">Product Name</span>,
  },
  {
    accessorKey: "price",
    header: () => <span className="text-xs md:text-sm">Price</span>,
  },
  {
    accessorKey: "qty",
    header: () => <span className="text-xs md:text-sm">Quantity</span>,
  },
  {
    accessorKey: "action",
    header: () => <span className="hidden">Action</span>,
    cell: ({ row }) => {
      const dispatch = useAppDispatch();
      const { productName, price, id, qty } = row.original;
      return (
        <ShoppingCart
          className="text-[#0C049B] size-4 cursor-pointer"
          onClick={() =>
            dispatch(
              SET_CART({
                productName,
                qty: 1,
                price,
                id,
                totalQty: qty
              })
            )
          }
        />
      );
    },
  },
];
