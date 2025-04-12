import { SellProductProps } from "@/lib/types";
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
      return <ShoppingCart className="text-[#0C049B] size-4 cursor-pointer" />
    },
  },
];
