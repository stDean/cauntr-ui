"use client";

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
import { ArrowLeft, Plus, UserSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { SellProductColumn } from "./SellColumn";
import useAddCustomerModal from "@/hooks/useAddCustomerModal";
import { CustomerProps } from "@/lib/types";

export function SellProductsTable<TData, TValue>({
  data,
  customers,
}: {
  data: TData[];
  customers: CustomerProps[];
}) {
  const router = useRouter();
  const addCustomer = useAddCustomerModal();
  const [showCustomers, setShowCustomers] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filteredCustomer, setFilteredCustomer] = useState(customers);
  const [customerSearch, setCustomerSearch] = useState("");
  const columns = SellProductColumn as ColumnDef<TData, TValue>[];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  useEffect(() => {
    if (customerSearch.trim()) {
      const searchTerm = customerSearch.trim().toLowerCase();
      const filtered = customers.filter((c) =>
        c.name.trim().toLowerCase().includes(searchTerm)
      );
      setFilteredCustomer(filtered);
    } else {
      // Reset to original list when search is empty
      setFilteredCustomer(customers);
    }
  }, [customerSearch, customers]); // Add customers to dependencies

  console.log({ filteredCustomer });

  return (
    <div className="max-w-7xl my-5 mx-auto space-y-4 ">
      <div className="flex gap-[165px]">
        <Button
          onClick={() => router.push("/inventory")}
          className="cursor-pointer"
          variant={"outline_blue"}
        >
          <ArrowLeft className="size-4 mr-2" />
          Go Back To Inventory
        </Button>

        <Input
          className="w-[550px] !bg-white"
          placeholder="search products..."
          value={
            (table.getColumn("productName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("productName")?.setFilterValue(event.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-12 gap-4 overflow-y-scroll h-screen pb-[155px]">
        <div className="col-span-3 bg-white rounded-lg p-4 sticky h-[580px] top-0 overflow-y-scroll">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
          exercitationem ipsa assumenda a alias saepe error voluptate soluta
          animi? Explicabo id, pariatur at unde qui ipsam voluptate soluta,
          molestias eligendi recusandae quaerat eos consectetur voluptates,
          architecto error! Atque, illo odit tempora error sunt et itaque quod
          aperiam dolorum ducimus commodi beatae dolorem deleniti expedita
          facilis, eius corrupti! Officia impedit cumque eius nam saepe. Animi,
          mollitia consectetur quis, officiis repudiandae, nobis accusantium
          impedit molestias quo corporis ipsum consequatur ab rerum. Ab eius
          cupiditate esse voluptatem nulla amet fuga ipsam, neque quia, eveniet
          quod eligendi? Maiores consequuntur animi dolorum qui minima
          aspernatur tenetur perferendis inventore! Hic nulla ipsum quo maiores
          fugiat cumque officiis obcaecati dolorem, laboriosam quod libero
          eveniet earum minima expedita et corporis iusto molestias illo nostrum
          ipsam enim quis necessitatibus temporibus! Dolor itaque, hic nulla
          architecto reiciendis, tempore nostrum rerum nesciunt corrupti sunt
          ducimus voluptatum saepe commodi sed alias eius! Ullam alias, in omnis
          soluta sapiente repudiandae. Doloremque minima ducimus officiis
          nostrum atque id libero totam obcaecati amet incidunt suscipit labore
          quos ut nihil rerum commodi, sunt reiciendis ea necessitatibus
          corporis harum tempore debitis! Libero provident officiis unde
          deserunt eius rerum reiciendis odio, ea neque a eveniet nulla.
          Consequatur, consequuntur!
        </div>

        <div className="col-span-6 bg-white rounded-lg p-4 space-y-4">
          <p className="text-xl">Products</p>
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
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
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-lg p-4 sticky h-[630px] top-0 overflow-y-scroll">
          <div className="space-y-1">
            <p className="text-[#636363] text-sm">Basket</p>
            <div>
              <p className="text-[#636363] text-xs">Select Customer</p>
              <div
                className="border relative rounded-lg"
                onClick={() => {
                  setShowCustomers(true);
                }}
              >
                <Input
                  className="!border-0 !ring-0 focus:!border-0 focus:!ring-0 pr-9"
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                  }}
                />
                <UserSearch className="size-5 absolute top-2 right-2 text-[#808080]" />
              </div>

              {showCustomers && (
                <div className="bg-white z-50 rounded-lg border mt-2 max-h-[250px] overflow-y-scroll">
                  <p
                    className="p-3 bg-[#F6F5FF] text-[#0C049B] flex items-center gap-2 text-sm cursor-pointer hover:text-[#0C049B]/80 hover:bg-[#F6F5FF]/80"
                    onClick={() => {
                      addCustomer.onOpen();
                      setShowCustomers(false);
                    }}
                  >
                    <Plus className="size-4" />
                    Add New Customer
                  </p>

                  {filteredCustomer.length &&
                    filteredCustomer.map((c, i) => (
                      <Fragment key={`${c.name} - ${c.phone}`}>
                        <p className="p-3 flex items-center gap-2 text-sm cursor-pointer hover:text-[#0C049B]/80 hover:bg-[#F6F5FF]/80">
                          {c.name} |{" "}
                          <span className="text-[#3F3B3B] !text-xs">
                            {c.phone}
                          </span>
                        </p>

                        {i !== customers.length - 1 && <hr />}
                      </Fragment>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
