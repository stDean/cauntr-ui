import { InventoryProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const InventoryColumn: ColumnDef<InventoryProps>[] = [
  {
    accessorKey: "productName",
    header: () => <span className="text-xs md:text-sm">Product Name</span>,
    cell: ({ row }) => {
      const { brand, productName, productType } = row.original;
      return (
        <Link
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL2}/inventory/${productType}/${brand}/${productName}?name=${productName}`}
          className="text-blue-500 hover:underline-offset-2 hover:text-blue-400 hover:underline"
        >
          {row.original.productName}
        </Link>
      );
    },
  },
  {
    accessorKey: "productType",
    header: () => <span className="text-xs md:text-sm">Product Type</span>,
  },
  {
    accessorKey: "brand",
    header: () => <span className="text-xs md:text-sm">Brand</span>,
  },
  {
    accessorKey: "stockCount",
    header: () => <span className="text-xs md:text-sm">Quantity</span>,
  },
  {
    accessorKey: "inventoryValue",
    header: () => <span className="text-xs md:text-sm">Value(₦)</span>,
  },
];
