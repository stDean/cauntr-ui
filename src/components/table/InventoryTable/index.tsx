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
  const rowsPerPage = 6;
  const filteredRows = table.getRowModel().rows;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const currentPage = Number(searchParams.get("page")) || 1;

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="my-4 border rounded-lg px-4 py-2 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xl">Inventory</p>
          <p className="text-sm text-[#636363]">
            Monitor, review and manage stock levels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="search brand..."
            value={(table.getColumn("brand")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("brand")?.setFilterValue(event.target.value)
            }
            className="w-[250px] lg:w-[350px] text-xs md:text-sm"
          />
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

      {paginatedRows.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
