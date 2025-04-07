import { Button } from "@/components/ui/button";
import { BillingHistoryProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const BillingColumn: ColumnDef<BillingHistoryProps>[] = [
  {
    accessorKey: "planName",
    header: () => <span className="text-xs md:text-sm">Plan Name</span>,
  },
  {
    accessorKey: "amount",
    header: () => <span className="text-xs md:text-sm">Amount(₦)</span>,
  },
  {
    accessorKey: "startDate",
    header: () => (
      <span className="text-xs md:text-sm hidden md:block">Billing Date</span>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.startDate);
      return (
        <span className="text-xs md:text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: () => (
      <span className="text-xs md:text-sm hidden md:block">End Date</span>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.endDate);
      return (
        <span className="text-xs md:text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <span className="text-xs md:text-sm">Status</span>,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClass = "text-xs font-semibold px-3 py-2 rounded-lg";
      switch (status) {
        case "Pending":
          return (
            <span className={`${statusClass} text-[#5f5609] bg-[#FEFCEC]`}>
              Processing
            </span>
          );
        case "Awaiting Payment":
          return (
            <span className={`${statusClass} text-[#5f5609] bg-[#FEFCEC]`}>
              Processing
            </span>
          );
        case "Successful":
          return (
            <span className={`${statusClass} text-[#034A12] bg-[#ECFEF0]`}>
              Success
            </span>
          );
        case "Canceled":
          return (
            <span className={`${statusClass} text-[#A00F0F] bg-[#FEECEC]`}>
              Failed
            </span>
          );
        case "Failed":
          return (
            <span className={`${statusClass} text-[#A00F0F] bg-[#FEECEC]`}>
              Failed
            </span>
          );
        default:
          break;
      }
    },
  },
  {
    accessorKey: "actions",
    header: () => <span className="text-xs md:text-sm">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            variant={"outline_blue"}
            className="text-sm cursor-pointer border-[]"
            size={"sm"}
            onClick={() => {
              console.log("View");
            }}
          >
            View
          </Button>
          <Button
            variant={"outline_blue"}
            className="text-sm cursor-pointer border-[]"
            size={"sm"}
            onClick={() => {
              console.log("Download");
            }}
          >
            Download
          </Button>
        </div>
      );
    },
  },
];
