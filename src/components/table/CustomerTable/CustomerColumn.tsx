import { GetTransactionItem } from "@/actions/users.a";
import { Button } from "@/components/ui/button";
import usePayBalanceModal from "@/hooks/usePayBalanceModal";
import { useReduxState } from "@/hooks/useRedux";
import { CustomerTable } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const CustomerColumn = (type: string): ColumnDef<CustomerTable>[] => [
  {
    accessorKey: "productName",
    header: () => <span className="text-xs md:text-sm">Product Name</span>,
    cell: ({ row }) => {
      const { productName, serialNo } = row.original;
      return (
        <div className="space-y-1">
          <p className="md:!text-sm">{productName}</p>

          <p className="text-xs text-[#636363] ">{serialNo}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "quantity",
    header: () => <span className="text-xs md:text-sm">Qty</span>,
  },
  {
    accessorKey: "pricePerUnit",
    header: () => (
      <span className="text-xs md:text-sm hidden md:block">
        Price Per Unit(₦)
      </span>
    ),
    cell: ({ row }) => (
      <p className="hidden md:block">{row.original.pricePerUnit}</p>
    ),
  },
  {
    accessorKey: "balanceOwed",
    header: () => (
      <span
        className={cn("text-xs md:text-sm hidden", {
          block: type === "debtor",
        })}
      >
        Balance Owed(₦)
      </span>
    ),
    cell: ({ row }) => (
      <p
        className={cn("hidden", {
          block: type === "debtor",
        })}
      >
        {row.original.balanceOwed}
      </p>
    ),
  },
  {
    accessorKey: "paidPrice",
    header: () => <span className="text-xs md:text-sm">Price Paid(₦)</span>,
  },
  {
    accessorKey: "paymentMethod",
    header: () => (
      <span className="text-xs md:text-sm hidden md:block">Payment Mode</span>
    ),
    cell: ({ row }) => (
      <p className="hidden md:block">
        {row.original.paymentMethod === "BANK_TRANSFER" ? "Transfer" : "Cash"}
      </p>
    ),
  },
  {
    accessorKey: "purchaseDate",
    header: () => (
      <span
        className={cn("text-xs md:text-sm hidden md:block", {
          "!hidden": type === "debtor",
        })}
      >
        Purchase Date
      </span>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.purchaseDate);
      return (
        <p className={cn("hidden md:block", { "!hidden": type === "debtor" })}>
          {date.toLocaleDateString()}
        </p>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => <span className="text-xs md:text-sm">Action</span>,
    cell: ({ row }) => {
      const payBalance = usePayBalanceModal();
      const { token, loggedInUser } = useReduxState();

      const handlePayBalance = async () => {
        const res = await GetTransactionItem({
          token,
          userId: loggedInUser!.id,
          id: row.original.itemId,
        });
        payBalance.onOpen(res.success.data);
      };

      return (
        <Button
          className="cursor-pointer"
          variant={"outline"}
          size={"sm"}
          onClick={handlePayBalance}
        >
          Pay Balance
        </Button>
      );
    },
  },
];
