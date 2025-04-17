"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { DebtorsColumn } from "./DebtorsColumn";
import { Pagination } from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Empty } from "@/components/Empty";
import useAddCustomerModal from "@/hooks/useAddCustomerModal";
import { Danfo } from "next/font/google";

export function DebtorsTable<TData, TValue>({ data }: { data: TData[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columns = DebtorsColumn as ColumnDef<TData, TValue>[];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  const searchParams = useSearchParams();
  const addDebtor = useAddCustomerModal();
  const rowsPerPage = 10;
  const filteredRows = table.getRowModel().rows;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const currentPage = Number(searchParams.get("page")) || 1;

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return data.length > 0 ? (
    <div className="my-4 border rounded-lg px-4 py-3 space-y-4">
      <div className="flex justify-between md:items-center flex-col md:flex-row space-y-3">
        <div className="flex justify-between md:items-center gap-3 flex-col md:flex-row  w-full">
          <Input
            placeholder="search by Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-full lg:w-[500px] text-xs md:text-sm"
          />
          <Button
            variant={"cauntr_blue"}
            size={"sm"}
            className="cursor-pointer"
            onClick={() => addDebtor.onOpen({ type: "debtor" })}
          >
            <Plus size={15} className="mr-2" /> Add Debtors
          </Button>
        </div>
      </div>

      <div className="border rounded-lg!">
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
            {paginatedRows.length > 0 ? (
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
                  No debtor with that name.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginatedRows.length > 0 && totalPages > 1 && (
        <div className="my-4 w-full">
          <Pagination totalPages={totalPages} currentPage={1} />
        </div>
      )}
    </div>
  ) : (
    <Empty
      text="Oops seems like you currently don’t have any customer, add some customers now."
      customer
      handleClick={() => {
        addDebtor.onOpen({ type: "debtor" });
      }}
      buttonText="Add Debtors"
    />
  );
}
