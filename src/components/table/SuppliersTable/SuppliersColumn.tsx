import { SuppliersProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const SuppliersColumn: ColumnDef<SuppliersProps>[] = [
  {
    accessorKey: "name",
    header: () => <span className="text-xs md:text-sm">Supplier Name</span>,
    cell: ({ row }) => {
      const { name, email, id } = row.original;
      return (
        <div className="space-y-1">
          <Link
            href={`/users/suppliers/${encodeURIComponent(id)}?name=Supplier`}
            className="text-blue-500 hover:underline hover:text-blue-400 md:text-sm!"
          >
            {name}
          </Link>

          <p className="text-xs text-[#636363] ">
            {email || "No email provided"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: () => <span className="text-xs md:text-sm">Phone Number</span>,
  },
  {
    accessorKey: "productCount",
    header: () => <span className="text-xs md:text-sm">Supply Count</span>,
  },
  {
    accessorKey: "dateAdded",
    header: () => <span className="text-xs md:text-sm">Date Added</span>,
    cell: ({ row }) => {
      const date = new Date(row.original.dateAdded);
      return <p>{date.toLocaleDateString()}</p>;
    },
  },
];
