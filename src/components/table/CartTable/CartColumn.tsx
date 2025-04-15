import { useAppDispatch } from "@/app/redux";
import {
  ADD_TO_QUANTITY,
  CartItem,
  DELETE_CART_ITEM,
  REMOVE_FROM_CART_QTY,
} from "@/state";
import { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus, X } from "lucide-react";

export const CartColumn: ColumnDef<CartItem>[] = [
  {
    accessorKey: "productName",
    header: () => <span className="text-xs md:text-sm">Product</span>,
    cell: ({ row }) => {
      const { price, productName, qty } = row.original;
      return (
        <div className="space-y-1">
          <p>
            {productName}{" "}
            <span className="!text-xs text-[#636363]">x {qty}</span>
          </p>
          <p>{price}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: () => <span className="hidden sm:block">SKU</span>,
    cell: ({ row }) => <p className="hidden sm:block">{row.original.sku}</p>,
  },
  {
    accessorKey: "action",
    header: () => <span className="text-xs md:text-sm">Action</span>,
    cell: ({ row }) => {
      const dispatch = useAppDispatch();

      return (
        <div className="flex items-center gap-2">
          <p
            className="p-1 rounded-full bg-[#EEEEEE] text-[#333] cursor-pointer"
            onClick={() => {
              dispatch(ADD_TO_QUANTITY({ id: row.original.id }));
            }}
          >
            <Plus className="size-3" strokeWidth={3} />
          </p>
          <p>{row.original.qty}</p>
          <p
            className="p-1 rounded-full bg-[#EEEEEE] text-[#333] cursor-pointer"
            onClick={() => {
              dispatch(REMOVE_FROM_CART_QTY({ id: row.original.id }));
            }}
          >
            <Minus className="size-3" strokeWidth={3} />
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "clear",
    header: () => <span className="text-xs md:text-sm">Clear</span>,
    cell: ({ row }) => {
      const dispatch = useAppDispatch();

      return (
        <p>
          <X
            className="size-4 sm:size-5 cursor-pointer"
            onClick={() => {
              dispatch(DELETE_CART_ITEM({ id: row.original.id }));
            }}
          />
        </p>
      );
    },
  },
];
