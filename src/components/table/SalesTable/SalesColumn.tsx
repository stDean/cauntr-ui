import { SalesType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const SalesColumn: ColumnDef<SalesType>[] = [
   {
        accessorKey: "employer",
        header: () => <span className="text-xs md:text-sm">Employer</span>,
        cell: ({ row }) => {
          const { employer } = row.original;
          return (
            <Link
          href={`/sales/${encodeURIComponent(employer)}`}
          className="text-blue-500 hover:underline hover:text-blue-400"
        >
          {employer}
        </Link>
          );
        },
      },
  {
    accessorKey: "itemsCount",
    header: () => <span className="text-xs md:text-sm">Item Count</span>,
    },
  {
    accessorKey: "dateSold",
    header: () => <span className="text-xs md:text-sm">Date Sold</span>,
  },
  {
    accessorKey: "costOfSale",
    header: () => <span className="text-xs md:text-sm">Cost of Sale(₦)</span>,
  },
 
];
