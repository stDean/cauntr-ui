import { OverviewProps } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const OverviewColumn: ColumnDef<OverviewProps>[] = [
  {
    accessorKey: "productName",
    header: () => <span className="text-xs md:text-sm">Product Name</span>,
  },
  {
    accessorKey: "soldQty",
    header: () => <span className="text-xs md:text-sm">Qty Sold</span>,
  },
  {
    accessorKey: "remainingQty",
    header: () => <span className="text-xs md:text-sm">Qty Left</span>,
  },
  {
    accessorKey: "soldAmount",
    header: () => <span className="text-xs md:text-sm">Amount Sold(₦)</span>,
    cell: ({ row }) => <p>{formatNaira(Number(row.original.soldAmount))}</p>,
  },
];
