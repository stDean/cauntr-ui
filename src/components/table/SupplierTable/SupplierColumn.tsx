import { SupplierTable } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const SupplierColumn: ColumnDef<SupplierTable>[] = [
  {
    accessorKey: "productName",
    header: () => <span className="text-xs md:text-sm">Product Name</span>,
  },
  {
    accessorKey: "serialNo",
    header: () => <span className="text-xs md:text-sm">Serial Number</span>,
    cell: ({ row }) => (
      <p>{row.original.serialNo ? row.original.serialNo : "N/A"}</p>
    ),
  },
  {
    accessorKey: "pricePerUnit",
    header: () => <span className="text-xs md:text-sm">Price(₦)</span>,
  },
  {
    accessorKey: "status",
    header: () => <span className="text-xs md:text-sm">Sales Status</span>,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClass = "text-xs font-semibold px-3 py-2 rounded-lg";
      switch (status) {
        case "Available":
          return (
            <span className={`${statusClass} text-[#5f5609] bg-[#FEFCEC]`}>
              {row.original.status}
            </span>
          );
        case "Sold Out":
          return (
            <span className={`${statusClass} text-[#034A12] bg-[#ECFEF0]`}>
              {row.original.status}
            </span>
          );
        default:
          break;
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="text-xs md:text-sm">Supply Date</span>,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <p>{date.toLocaleDateString()}</p>;
    },
  },
];
