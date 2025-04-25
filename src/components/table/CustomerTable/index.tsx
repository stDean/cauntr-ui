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
import { CustomerColumn } from "./CustomerColumn";
import { useReduxState } from "@/hooks/useRedux";

export function CustomerTable<TData, TValue>({
  data,
  type,
}: {
  data: TData[];
  type: string;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columns = CustomerColumn(type) as ColumnDef<TData, TValue>[];
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
        <Input
          placeholder="Filter product..."
          value={(table.getColumn("transId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("transId")?.setFilterValue(event.target.value)
          }
          className="w-[250px] lg:w-[350px] text-xs md:text-sm"
        />
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
                    <TableCell key={cell.id} className="text-xs py-3">
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
      {totalPages > 1 && (
        <div className="my-4 w-full">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
}
