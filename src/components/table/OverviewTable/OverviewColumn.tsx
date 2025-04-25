import { OverviewProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const OverviewColumn: ColumnDef<OverviewProps>[] = [
  {
    accessorKey: "productName",
    header: () => <span className="text-xs md:text-sm">Product Name</span>,
  },
  {
    accessorKey: "qtySold",
    header: () => <span className="text-xs md:text-sm">Qty Sold</span>,
  },
  {
    accessorKey: "qtyLeft",
    header: () => <span className="text-xs md:text-sm">Qty Left</span>,
  },
  {
    accessorKey: "amountSold",
    header: () => <span className="text-xs md:text-sm">Amount Sold(₦)</span>,
  },
];
