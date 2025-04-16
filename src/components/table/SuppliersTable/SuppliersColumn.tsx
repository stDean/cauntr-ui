import { SuppliersProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const SuppliersColumn: ColumnDef<SuppliersProps>[] = [
   {
        accessorKey: "supplierName",
        header: () => <span className="text-xs md:text-sm">Supplier Name</span>,
        cell: ({ row }) => {
          const { supplierName } = row.original;
          return (
            <Link
          href={`/users?suppliers/${encodeURIComponent(supplierName)}`}
          className="text-blue-500 hover:underline hover:text-blue-400"
        >
          {supplierName}
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
    accessorKey: "supplyCount",
    header: () => <span className="text-xs md:text-sm">Supply Name</span>,
  },
  {
    accessorKey: "dateAdded",
    header: () => <span className="text-xs md:text-sm">Date Added</span>,
  },
 
];
