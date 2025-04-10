import { ProductType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const ProductColumn: ColumnDef<ProductType>[] = [
  {
    accessorKey: "sku",
    header: () => <span className="text-xs md:text-sm">SKU</span>,
  },
  {
    accessorKey: "serialNo",
    header: () => <span className="text-xs md:text-sm">Serial Number</span>,
    cell: ({ row }) => {
      const checkSerialNo = !!row.original.serialNo;
      return (
        <p>{checkSerialNo ? row.original.serialNo : "No Serial Number"}</p>
      );
    },
  },
  {
    accessorKey: "brand",
    header: () => <span className="text-xs md:text-sm">Brand</span>,
  },
  {
    accessorKey: "type",
    header: () => <span className="text-xs md:text-sm">Type</span>,
  },
  {
    accessorKey: "quantity",
    header: () => <span className="text-xs md:text-sm">Quantity</span>,
  },
  {
    accessorKey: "sellingPrice",
    header: () => <span className="text-xs md:text-sm">Value(₦)</span>,
  },
];
