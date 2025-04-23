import { GetTransactionItem } from "@/actions/users.a";
import { Button } from "@/components/ui/button";
import usePayBalanceModal from "@/hooks/usePayBalanceModal";
import { useReduxState } from "@/hooks/useRedux";
import { CustomerTransactionsProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const CustomerColumn = (
  type: string
): ColumnDef<CustomerTransactionsProps>[] => [
  {
    accessorKey: "transId",
    header: () => <span className="text-xs md:text-sm">Transaction ID</span>,
    cell: ({ row }) => (
      <Link
        href={`/users/trans/${row.original.id}`}
        className="text-blue-400 hover:text-blue-500 hover:underline hover:underline-offset-2"
      >
        {row.original.transId}
      </Link>
    ),
  },
  {
    accessorKey: "soldBy",
    header: () => <span className="text-xs md:text-sm">Sold By</span>,
  },
  {
    accessorKey: "itemCount",
    header: () => (
      <span className="text-xs md:text-sm hidden md:block">Item Count</span>
    ),
  },
  {
    accessorKey: "dateSold",
    header: () => <span className="text-xs md:text-sm">Transaction Date</span>,
    cell: ({ row }) => {
      const date = new Date(row.original.dateSold);
      return <p>{date.toLocaleDateString()}</p>;
    },
  },
];
