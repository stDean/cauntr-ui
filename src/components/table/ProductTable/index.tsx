"use client";

import { Pagination } from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ProductColumn } from "./ProductColumn";

export function ProductTable<TData, TValue>({ data }: { data: TData[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columns = ProductColumn as ColumnDef<TData, TValue>[];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  const searchParams = useSearchParams();
  const rowsPerPage = 10;
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
        <div className="flex md:items-center gap-3 flex-col md:flex-row">
          <Input
            placeholder="search sku..."
            value={(table.getColumn("sku")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("sku")?.setFilterValue(event.target.value)
            }
            className="w-full lg:w-[450px] text-xs md:text-sm"
          />
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
            {paginatedRows.length > 0 &&
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
              ))}
          </TableBody>
        </Table>
      </div>

      {paginatedRows.length > 0 && totalPages > 1 && (
        <div className="my-4 w-full">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
}
