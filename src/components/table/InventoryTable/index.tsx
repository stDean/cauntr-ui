"use client";

import { Empty } from "@/components/Empty";
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
import { InventoryColumn } from "./InventoryColumn";
import useAddProductModal from "@/hooks/useAddProductModal";

export function InventoryTable<TData, TValue>({
  data,
  suppliers,
}: {
  data: TData[];
  suppliers: any[];
}) {
  const addProductModal = useAddProductModal();
  const columns = InventoryColumn as ColumnDef<TData, TValue>[];
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
        <div>
          <p className="text-xl">Inventory</p>
          <p className="text-sm text-[#636363]">
            Monitor, review and manage stock levels
          </p>
        </div>
        <div className="flex md:items-center gap-3 flex-col md:flex-row">
          <Input
            placeholder="search brand..."
            value={(table.getColumn("brand")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("brand")?.setFilterValue(event.target.value)
            }
            className="w-full lg:w-[350px] text-xs md:text-sm"
          />

          <div className="space-x-3 space-y-3">
            <Button
              variant={"outline_blue"}
              className="text-sm cursor-pointer"
              size={"sm"}
              onClick={() => {
                console.log("Sell products");
              }}
            >
              Sell Product(s)
            </Button>
            <Button
              variant={"cauntr_blue"}
              className="text-sm cursor-pointer"
              size={"sm"}
              onClick={() => addProductModal.onOpen("click", suppliers)}
            >
              Add Product(s)
            </Button>
          </div>
        </div>
      </div>

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
      ) : (
        <Empty text="No products found in your inventory." />
      )}

      {paginatedRows.length > 0 && totalPages > 1 && (
        <div className="my-4 w-full">
          <Pagination totalPages={totalPages} currentPage={1} />
        </div>
      )}
    </div>
  );
}
