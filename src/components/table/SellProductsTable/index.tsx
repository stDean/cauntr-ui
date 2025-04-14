"use client";

import { useAppDispatch } from "@/app/redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAddCustomerModal from "@/hooks/useAddCustomerModal";
import { useReduxState } from "@/hooks/useRedux";
import { CustomerProps, GroupedCategory } from "@/lib/types";
import {
  ADD_TO_QUANTITY,
  DELETE_CART_ITEM,
  REMOVE_FROM_CART_QTY,
  SET_BUYER,
} from "@/state";
import {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import {
  Minus,
  MoveLeft,
  MoveRight,
  Percent,
  Plus,
  Trash2,
  UserSearch,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { SellProductColumn } from "./SellColumn";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function SellProductsTable<TData, TValue>({
  data,
  customers,
  categories,
}: {
  data: TData[];
  customers: CustomerProps[];
  categories: GroupedCategory[];
}) {
  const router = useRouter();
  const addCustomer = useAddCustomerModal();
  const [isPending, startTransition] = useTransition();
  const [showCustomers, setShowCustomers] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filteredCustomer, setFilteredCustomer] = useState(customers);
  const [customerSearch, setCustomerSearch] = useState("");
  const [payFull, setPayFull] = useState(false);
  const [tab, setTab] = useState("customer");
  const [payTax, setPayTax] = useState(false);
  const [pay, setPay] = useState<{
    amountPaid: string;
    balance: string;
  }>({
    amountPaid: "",
    balance: "",
  });
  const [taxFee, setTaxFee] = useState("");
  const [filterCat, setFilterCat] = useState<{
    productType: string[];
    brand: string[];
  }>({
    productType: [],
    brand: [],
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { buyer, cartItems } = useReduxState();

  const columns = SellProductColumn as ColumnDef<TData, TValue>[];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showCustomers &&
        !inputRef.current?.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setShowCustomers(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCustomers]);

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

  const nameSplit = buyer && buyer?.name.split(" ");
  const first = nameSplit && nameSplit![0][0];
  const second = nameSplit && nameSplit![1][0];

  const subTotal = payFull
    ? cartItems.reduce((acc, i) => {
        return acc + parseFloat(i.price);
      }, 0)
    : pay.amountPaid;

  const total = payTax
    ? !isNaN(parseFloat(subTotal as string)) &&
      !isNaN(parseFloat(taxFee || "0"))
      ? parseFloat(subTotal as string) +
        (parseFloat(subTotal as string) * parseFloat(taxFee || "0")) / 100
      : "0.00"
    : !isNaN(parseFloat(subTotal as string))
    ? subTotal
    : "0.00";

  const handleSellProduct = () => {
    startTransition(async () => {
      if (cartItems.length === 1) {
        console.log("Use sell product route");
      } else {
        console.log("Use sell products route");
      }
    });
  };

  const filteredData = table.getRowModel().rows.filter((row) => {
    const matchesProductType = filterCat.productType.length
      ? filterCat.productType.includes(
          (row.original as { productType: string }).productType
        )
      : true;

    const matchesBrand = filterCat.brand.length
      ? filterCat.brand.includes((row.original as { brand: string }).brand)
      : true;

    return matchesProductType && matchesBrand;
  });

  return (
    <div className="max-w-7xl my-5 lg:mx-auto space-y-4 mx-2">
      <div className="flex gap-4 lg:gap-[165px] flex-col md:flex-row">
        <Button
          onClick={() => router.push("/inventory")}
          className="cursor-pointer w-fit"
          variant={"outline_blue"}
        >
          <MoveLeft className="size-4 mr-2" />
          Go Back To Inventory
        </Button>

        <Input
          className="w-[350px] sm:w-[450px] md:w-[550px] !bg-white"
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
        <div className="col-span-3 bg-white rounded-lg p-4 sticky h-[580px] top-0 overflow-y-scroll hidden lg:block space-y-3">
          <div className="space-y-1">
            <p className="text-[#636363] text-sm">Category</p>
            {/* <Input className="focus:!ring-0 focus:!border-0" /> */}
          </div>

          <div>
            {categories.map(({ brands, productType }) => (
              <div key={productType} className="space-y-2 mb-3">
                <p className="text-[#3B3B3B] text-sm font-semibold">
                  {productType.toUpperCase()}
                </p>

                {brands.map((b) => (
                  <div
                    className="flex items-center justify-between indent-5"
                    key={b}
                  >
                    <label
                      htmlFor={b}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#3B3B3B]"
                    >
                      {b}
                    </label>
                    <Checkbox
                      id={b}
                      className="cursor-pointer"
                      onClick={() => {
                        setFilterCat((prev) => {
                          const isChecked =
                            prev.brand.includes(b) &&
                            prev.productType.includes(productType);

                          return {
                            productType: isChecked
                              ? prev.productType.filter(
                                  (type) => type !== productType
                                )
                              : [...prev.productType, productType],
                            brand: isChecked
                              ? prev.brand.filter((brand) => brand !== b)
                              : [...prev.brand, b],
                          };
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 lg:col-span-6 bg-white rounded-lg p-4 space-y-4">
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
                {filteredData.length ? (
                  filteredData.map((row) => (
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

        <div className="lg:col-span-3 md:col-span-4  bg-white rounded-lg p-4 sticky h-fit  max-h-[630px] top-0 overflow-y-scroll hidden md:block space-y-3">
          <div className="bg-white grid grid-cols-4 border rounded-lg text-sm cursor-pointer">
            <p
              className={cn("col-span-2 p-2 text-center  rounded-l-lg", {
                "bg-black text-white": tab === "customer",
              })}
              onClick={() => setTab("customer")}
            >
              Customer Sale
            </p>
            <p
              onClick={() => setTab("one_off")}
              className={cn("col-span-2 p-2 text-center rounded-r-lg", {
                "bg-black text-white": tab === "one_off",
              })}
            >
              One Off
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[#636363] text-sm">Basket</p>

            {tab === "one_off" ? null :!buyer ? (
              <div className="">
                <p className="text-[#636363] text-xs mb-1 font-semibold">
                  Select Customer
                </p>
                <div
                  className="border relative rounded-lg"
                  onClick={() => {
                    setShowCustomers(true);
                  }}
                  ref={inputRef}
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
                  <div
                    className="bg-white z-50 rounded-lg border mt-1 max-h-[250px] overflow-y-scroll"
                    ref={dropdownRef}
                  >
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

                    {filteredCustomer.length > 0 ? (
                      filteredCustomer.map((c, i) => (
                        <Fragment key={`${c.name} - ${c.phone}`}>
                          <p
                            className="p-3 flex items-center gap-2 text-sm cursor-pointer hover:text-[#0C049B]/80 hover:bg-[#F6F5FF]/80"
                            onClick={() => {
                              dispatch(
                                SET_BUYER({
                                  name: c.name,
                                  email: c.email,
                                  phone: c.phone,
                                })
                              );
                            }}
                          >
                            {c.name} |{" "}
                            <span className="text-[#3F3B3B] !text-xs">
                              {c.phone}
                            </span>
                          </p>

                          {i !== customers.length - 1 && <hr />}
                        </Fragment>
                      ))
                    ) : (
                      <div className="p-4 text-center font-semibold">
                        No Customer
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-2 bg-white flex justify-between items-center gap-4">
                <div className="rounded-full bg-[#EEEEEE] font-semibold p-3">
                  {first}
                  {second}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{buyer.name}</p>
                  <p className="text-xs text-[#A3A3A3]">
                    {buyer.email ? buyer.email : buyer.phone}
                  </p>
                </div>
                <X
                  className="text-[#A3A3A3] size-4 ml-auto self-start cursor-pointer"
                  onClick={() => {
                    dispatch(SET_BUYER(null));
                  }}
                />
              </div>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-scroll">
            {cartItems.map((c, i) => (
              <div
                className="p-2 bg-[#F8F8F8] flex justify-between items-center mb-2"
                key={`${c.productName} - ${c.price} - ${i}`}
              >
                <p className="text-[#636363] text-sm font-semibold">
                  {c.productName}
                </p>
                <div className="flex flex-col justify-between items-center space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <p className="text-[#808080]">#{c.price}</p>
                    <Trash2
                      className="text-red-500 size-4 cursor-pointer"
                      onClick={() => {
                        dispatch(DELETE_CART_ITEM({ id: c.id }));
                      }}
                    />
                  </div>

                  <div className="border-2 w-[90px] px-1 py-[2px]  flex rounded-lg items-center justify-between text-sm">
                    <Plus
                      className="size-4 text-[#999999] cursor-pointer"
                      strokeWidth={4}
                      onClick={() => dispatch(ADD_TO_QUANTITY({ id: c.id }))}
                    />{" "}
                    {c.qty}
                    <Minus
                      className="size-4 text-[#999999] cursor-pointer"
                      strokeWidth={4}
                      onClick={() =>
                        dispatch(REMOVE_FROM_CART_QTY({ id: c.id }))
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[#636363] text-xs mb-1 font-semibold">
                Mode of Payment
              </p>
              <Select>
                <SelectTrigger className="w-full focus:!ring-0">
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Payment Method</SelectLabel>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-[#636363] text-xs mb-1 font-semibold">
                  Amount Paid
                </p>
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="paid-full-amount"
                    className="!text-[#636363] text-xs mb-1"
                  >
                    Paid Full Amount
                  </Label>
                  <Switch
                    id="paid-full-amount"
                    className="!h-[1rem] !w-6"
                    small
                    onClick={() => {
                      setPayFull((prev) => !prev);
                      setPay({ amountPaid: "", balance: "" });
                    }}
                  />
                </div>
              </div>

              <Input
                placeholder="enter amount paid"
                disabled={payFull}
                name="amountPaid"
                value={pay.amountPaid}
                onChange={(e) => setPay({ ...pay, amountPaid: e.target.value })}
              />

              {!payFull && (
                <div className="mt-1">
                  <p className="text-[#636363] text-xs mb-1 font-semibold">
                    Balance Owed
                  </p>

                  <Input
                    placeholder="enter balance owed"
                    disabled={payFull}
                    name="balance"
                    value={pay.balance}
                    onChange={(e) =>
                      setPay({ ...pay, balance: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <hr />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-[#808080]">Sub-total</p>
              <p className="text-sm font-semibold text-[#808080]">{subTotal}</p>
            </div>

            <hr />

            <div className="flex justify-between items-center">
              <p className="text-sm text-[#808080]">Tax</p>
              <div className="flex items-center space-x-2">
                <Switch
                  onClick={() => {
                    setPayTax((prev) => !prev);
                    setTaxFee("");
                  }}
                />
              </div>
            </div>
            {payTax && (
              <div className="border rounded-lg flex justify-between items-center ">
                <Input
                  className="!border-0 !ring-0 focus:!border-0 focus:!ring-0"
                  value={taxFee}
                  name="taxFee"
                  onChange={(e) => setTaxFee(e.target.value)}
                />
                <Percent className="size-5 text-[#999999] mr-2" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <p>Total</p>
              <p>{total}</p>
            </div>
          </div>

          <hr />

          <div>
            <Button
              variant={"cauntr_blue"}
              size={"sm"}
              className="w-full cursor-pointer"
              disabled={!buyer || cartItems.length <= 0 || isPending}
              isLoading={isPending}
              loadingText="please wait"
              onClick={handleSellProduct}
            >
              Sell Products <MoveRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
