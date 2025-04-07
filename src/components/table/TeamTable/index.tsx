"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCreateUserModal from "@/hooks/useCreateUserModal";
import { useReduxState } from "@/hooks/useRedux";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { createTeamColumns } from "./TeamColumn";

export function TeamTable<TData, TValue>({ data }: { data: TData[] }) {
  const createUserModal = useCreateUserModal();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { token } = useReduxState();
  const columns = createTeamColumns(token) as ColumnDef<TData, TValue>[];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  // Pagination Logics
  const searchParams = useSearchParams();
  const rowsPerPage = 10;
  const filteredRows = table.getRowModel().rows;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const currentPage = Number(searchParams.get("page")) || 1;

  // Slice the filtered rows to display only the current page's rows
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h1 className="text-xl">Team Members</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Filter name..."
            value={
              (table.getColumn("userName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("userName")?.setFilterValue(event.target.value)
            }
            className="w-[250px] lg:w-[350px] text-xs md:text-sm"
          />
          <Button
            variant={"cauntr_blue"}
            className="text-sm cursor-pointer"
            size={"sm"}
            onClick={() => createUserModal.onOpen("create", null)}
          >
            Add User <Plus className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {paginatedRows.length ? (
              paginatedRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
