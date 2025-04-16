import {  DebtorsProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const DebtorsColumn: ColumnDef<DebtorsProps>[] = [
   {
        accessorKey: "debtorName",
        header: () => <span className="text-xs md:text-sm">Debtor Name</span>,
        cell: ({ row }) => {
          const { debtorName } = row.original;
          return (
            <Link
          href={`/users?debtors/${encodeURIComponent(debtorName)}`}
          className="text-blue-500 hover:underline hover:text-blue-400"
        >
          {debtorName}
        </Link>
          );
        },
      },
  {
    accessorKey: "email",
    header: () => <span className="text-xs md:text-sm">Email</span>,
    },
  {
    accessorKey: "phone",
    header: () => <span className="text-xs md:text-sm">Phone Number</span>,
  },
  {
    accessorKey: "amountOwed",
    header: () => <span className="text-xs md:text-sm">Invoice Owed(₦)</span>,
  },
  {
    accessorKey: "dateOverdue",
    header: () => <span className="text-xs md:text-sm">Days Overdue</span>,
  },
 
];
