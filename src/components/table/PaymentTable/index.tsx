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
import { PaymentColumn } from "./PaymentColumn";
import { Search } from "lucide-react";
import { Empty } from "@/components/Empty";

export function PaymentTable<TData, TValue>({ data }: { data: TData[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columns = PaymentColumn as ColumnDef<TData, TValue>[];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  const searchParams = useSearchParams();
  const rowsPerPage = 5;
  const filteredRows = table.getRowModel().rows;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const currentPage = Number(searchParams.get("page")) || 1;

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="my-4 border rounded-lg px-4 py-2 space-y-4">
      <div className="flex justify-between md:items-center flex-col md:flex-row space-y-3">
        <div className="flex justify-between md:items-center gap-3 flex-col md:flex-row  w-full">
          <p className="font-medium text-[#121212]">
            Payment History
            <span className="text-[#636363]"> ({data.length})</span>
          </p>

          <div className="flex items-center border border-[#eeeeee] px-3 rounded-lg transition-all bg-white ">
            <Search size={15} className="text-[#A5A5A5]" />
            <Input
              placeholder="Search date"
              value={
                (table.getColumn("date")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("date")?.setFilterValue(event.target.value)
              }
              className="w-full lg:w-[500px] text-xs md:text-sm border-none shadow-none outline-none focus:outline-none focus:ring-0 focus:shadow-none focus:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#A5A5A5]"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg!">
        {paginatedRows.length > 0 ? (
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
                {paginatedRows.length > 0 &&
                  paginatedRows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-xs py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Empty text="No Payment for that date.." />
        )}
      </div>

      {paginatedRows.length > 0 && totalPages > 1 && (
        <div className="my-4 w-full">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
}
