import { Button } from "@/components/ui/button";
import { TeamTableProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const TeamColumns: ColumnDef<TeamTableProps>[] = [
  {
    accessorKey: "userName",
    accessorFn: (row) =>
      `${row.firstName || "No Name"} ${row.lastName || "No Name"}`,
    header: () => <span className="text-xs md:text-sm">User FullName</span>,
    cell: ({ row }) => {
      const fullName = row.getValue("userName") as string;
      return (
        <div className="flex flex-col gap-2 text-xs">
          <p className="font-semibold md:text-sm!">{fullName}</p>
          <p className="text-sm text-gray-500">{row.original.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => <span className="text-xs md:text-sm">Phone Number</span>,
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phone") as string;
      return (
        <p className="text-xs md:text-sm">{phoneNumber || "No Phone Number"}</p>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden md:block">Date Added</span>,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      const date = new Date(createdAt);
      return (
        <span className="hidden md:block">
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
    accessorKey: "actions",
    header: () => <span className="text-xs md:text-sm">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            className="btn btn-primary cursor-pointer text-xs md:text-sm"
            variant={"outline"}
            onClick={() => {
              console.log("Show Modal to Edit User Role");
            }}
            size={"sm"}
          >
            Edit Role
          </Button>
          <Button
            className="cursor-pointer text-xs md:text-sm"
            variant={"outline_red"}
            onClick={() => {
              console.log("Show Modal to Delete User");
            }}
            size={"sm"}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
