import { CustomersProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const CustomersColumn: ColumnDef<CustomersProps>[] = [
  {
    accessorKey: "name",
    header: () => <span className="text-xs md:text-sm">Customer Name</span>,
    cell: ({ row }) => {
      const { name, email, id } = row.original;
      return (
        <div className="space-y-1">
          <Link
            href={`/users/customers/${encodeURIComponent(id)}?name=Customer`}
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
    accessorKey: "phone",
    header: () => <span className="text-xs md:text-sm">Phone Number</span>,
  },
  {
    accessorKey: "transactionCount",
    header: () => <span className="text-xs md:text-sm">Buy Count</span>,
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
