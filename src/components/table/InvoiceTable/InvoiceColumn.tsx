import useInvoiceConfirmationModal from "@/hooks/useInvoiceConfirmation";
import useRecordPayModal from "@/hooks/useRecordPayModal";
import { InvoiceColumnProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { BellRing, CheckCheck, CreditCard } from "lucide-react";
import Link from "next/link";

export const InvoiceColumn: ColumnDef<InvoiceColumnProps>[] = [
  {
    accessorKey: "invoiceNo",
    header: () => <span className="text-xs md:text-sm">Invoice Number</span>,
    cell: ({ row }) => (
      <Link
        href={`/invoice/${row.original.invoiceNo}`}
        className="text-blue-400 hover:text-blue-500 hover:underline hover:underline-offset-4"
      >
        {row.original.invoiceNo}
      </Link>
    ),
  },
  {
    accessorKey: "customerName",
    header: () => <span className="text-xs md:text-sm">Customer Name</span>,
  },
  {
    accessorKey: "amount",
    header: () => <span className="text-xs md:text-sm">Amount</span>,
  },
  {
    accessorKey: "status",
    header: () => <span className="text-xs md:text-sm">Status</span>,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClass = "text-xs font-semibold px-3 py-2 rounded-lg";
      switch (status) {
        case "DRAFT":
          return (
            <span className={`${statusClass} text-[#5f5609] bg-[#FEFCEC]`}>
              Pending
            </span>
          );
        case "PART_PAID":
          return (
            <span className={`${statusClass} text-[#5f5609] bg-[#FEFCEC]`}>
              Part Paid
            </span>
          );
        case "PAID":
          return (
            <span className={`${statusClass} text-[#034A12] bg-[#ECFEF0]`}>
              Paid
            </span>
          );
        case "OVERDUE":
          return (
            <span className={`${statusClass} text-[#A00F0F] bg-[#FEECEC]`}>
              Overdue
            </span>
          );
        default:
          break;
      }
    },
  },
  {
    accessorKey: "action",
    header: () => <span className="text-xs md:text-sm">Actions</span>,
    cell: ({ row }) => {
      const invoiceConfirmation = useInvoiceConfirmationModal();
      const recordPay = useRecordPayModal();

      return (
        <div className="flex justify-around">
          <BellRing
            className={cn("size-4 cursor-pointer hover:text-black/50", {
              "cursor-not-allowed": row.original.status === "PAID",
            })}
            onClick={() => {
              row.original.status !== "PAID" &&
                invoiceConfirmation.onOpen({
                  type: "notify",
                  userName: row.original.customerName,
                  ids: {
                    paymentId: row.original.paymentId,
                    planId: row.original.planId,
                    invoiceNo: row.original.invoiceNo,
                  },
                });
            }}
          />
          <CreditCard
            className={cn("size-4 cursor-pointer hover:text-black/50", {
              "cursor-not-allowed": row.original.status === "PAID",
            })}
            onClick={() => {
              row.original.status !== "PAID" &&
                recordPay.onOpen({
                  customerName: row.original.customerName,
                  invoiceData: {
                    invoiceNo: row.original.invoiceNo,
                    planId: row.original.planId,
                  },
                });
            }}
          />
          <CheckCheck
            className={cn("size-4 cursor-pointer hover:text-black/50", {
              "cursor-not-allowed": row.original.status === "PAID",
            })}
            onClick={() => {
              row.original.status !== "PAID" &&
                invoiceConfirmation.onOpen({
                  type: "payFull",
                  userName: row.original.customerName,
                  ids: {
                    paymentId: row.original.paymentId,
                    planId: row.original.planId,
                    invoiceNo: row.original.invoiceNo,
                  },
                });
            }}
          />
        </div>
      );
    },
  },
];
