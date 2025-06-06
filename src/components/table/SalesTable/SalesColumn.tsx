import { SalesType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const SalesColumn: ColumnDef<SalesType>[] = [
  {
    accessorKey: "shortId",
    header: () => <span className="text-xs md:text-sm">Sales ID</span>,
    cell: ({ row }) => {
      const { transactionId: id } = row.original;
      return (
        <Link
          href={`/sales/${encodeURIComponent(id)}`}
          className="text-blue-500 hover:underline hover:text-blue-400 md:!text-sm"
        >
          {row.original.shortId}
        </Link>
      );
    },
  },
  {
    accessorKey: "employee",
    header: () => <span className="text-xs md:text-sm">Employee</span>,
    cell: ({ row }) => {
      const { employee, email } = row.original;
      return (
        <div className="space-y-1">
          <p>{employee}</p>
          <p className="text-xs text-[#636363] ">{email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "salesType",
    header: () => <span className="text-xs md:text-sm">Sales Type</span>,
    cell: ({ row }) => {
      return <p>{row.original.salesType === "SALE" ? "Sale" : "Bulk Sales"}</p>;
    },
  },
  {
    accessorKey: "itemCount",
    header: () => <span className="text-xs md:text-sm">Item Count</span>,
  },
  {
    accessorKey: "transactionDate",
    header: () => <span className="text-xs md:text-sm">Date Sold</span>,
    cell: ({ row }) => {
      const date = new Date(row.original.transactionDate);
      return <p>{date.toLocaleDateString()}</p>;
    },
  },
];
