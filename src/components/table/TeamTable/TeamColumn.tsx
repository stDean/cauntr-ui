import { GetUser } from "@/actions/settings.a";
import { Button } from "@/components/ui/button";
import useConfirmationModal from "@/hooks/useConfirmationModal";
import useCreateUserModal from "@/hooks/useCreateUserModal";
import { useReduxState } from "@/hooks/useRedux";
import { TeamTableProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const createTeamColumns = (
  token: string | null
): ColumnDef<TeamTableProps>[] => [
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
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <p className="text-xs md:text-sm">
          {role === "ADMIN" ? "Admin" : "Employee"}
        </p>
      );
    },
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
      const createUserModal = useCreateUserModal();
      const deleteUserModal = useConfirmationModal();
      const { loggedInUser } = useReduxState();

      return (
        <div
          className={cn("flex gap-2", {
            hidden: loggedInUser?.email === row.original.email,
          })}
        >
          <Button
            className="btn btn-primary cursor-pointer text-xs md:text-sm"
            variant={"outline"}
            onClick={async () => {
              const res = await GetUser({
                token: token!,
                userId: row.original.id,
              });

              createUserModal.onOpen("edit", res.success.data);
            }}
            size={"sm"}
          >
            Edit Role
          </Button>
          <Button
            className="cursor-pointer text-xs md:text-sm"
            variant={"outline_red"}
            onClick={() => {
              deleteUserModal.onOpen({
                firstData: `${row.original.firstName} ${row.original.lastName}`,
                secondData: row.original.role as "EMPLOYEE" | "ADMIN",
                thirdData: row.original.id,
              });
            }}
            disabled={loggedInUser?.email! === row.original.email}
            size={"sm"}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
