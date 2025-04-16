import { CustomersProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const CustomersColumn: ColumnDef<CustomersProps>[] = [
   {
        accessorKey: "customerName",
        header: () => <span className="text-xs md:text-sm">Customer Name</span>,
        cell: ({ row }) => {
          const { customerName } = row.original;
          return (
            <Link
          href={`/users?customers/${encodeURIComponent(customerName)}`}
          className="text-blue-500 hover:underline hover:text-blue-400"
        >
          {customerName}
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
    accessorKey: "buyCount",
    header: () => <span className="text-xs md:text-sm">Buy Count</span>,
  },
  {
    accessorKey: "dateAdded",
    header: () => <span className="text-xs md:text-sm">Date Added</span>,
  },
 
];
