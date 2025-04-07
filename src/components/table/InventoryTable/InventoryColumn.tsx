import { InventoryProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const InventoryColumn: ColumnDef<InventoryProps>[] = [
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
    header: () => (
      <span className="text-xs md:text-sm hidden md:block">Quantity</span>
    ),
  },
  {
    accessorKey: "inventoryValue",
    header: () => (
      <span className="text-xs md:text-sm hidden md:block">Value(₦)</span>
    ),
  },
];
