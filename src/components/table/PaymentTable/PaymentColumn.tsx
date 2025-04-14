
import { PaymentHistoryType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const PaymentColumn: ColumnDef<PaymentHistoryType>[] = [
   {
        accessorKey: "paymentDate",
        header: () => <span className="text-xs md:text-sm">Payment Date</span>,
      },
  {
    accessorKey: "paymentMethod",
    header: () => <span className="text-xs md:text-sm">Mode of Payment</span>,
    },
  {
    accessorKey: "amount",
    header: () => <span className="text-xs md:text-sm">Amount</span>,
  },
];
