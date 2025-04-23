"use client";

import { SellProduct, SellProducts } from "@/actions/inventory.a";
import { useAppDispatch } from "@/app/redux";
import { Banks } from "@/components/form/AccountSettingsForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";
import {
  ADD_TO_QUANTITY,
  CLEAR_CART,
  DELETE_CART_ITEM,
  REMOVE_FROM_CART_QTY,
  SET_BANK,
  SET_BUYER,
} from "@/state";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Landmark,
  Minus,
  MoveLeft,
  MoveRight,
  Percent,
  Plus,
  Trash2,
  UserSearch,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { SellProductColumn } from "./SellColumn";
import { Pagination } from "@/components/Pagination";

export function SellProductsTable<TData, TValue>({
  data,
  customers,
  categories,
  banks,
}: {
  data: TData[];
  customers: CustomerProps[];
  categories: GroupedCategory[];
  banks: Banks[];
}) {
  const router = useRouter();
  const addCustomer = useAddCustomerModal();
  const [isPending, startTransition] = useTransition();
  const [showCustomers, setShowCustomers] = useState(false);
  const [showBanks, setShowBanks] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filteredCustomer, setFilteredCustomer] = useState(customers);
  const [filteredBank, setFilteredBank] = useState(banks);
  const [customerSearch, setCustomerSearch] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [payFull, setPayFull] = useState(false);
  const [tab, setTab] = useState("customer");
  const [payTax, setPayTax] = useState(false);
  const [pay, setPay] = useState<{
    amountPaid: string;
    balance: string;
    paymentMethod: string;
  }>({
    amountPaid: "",
    balance: "",
    paymentMethod: "CASH",
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
  const dropdownBankRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const bankInputRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { buyer, cartItems, token, loggedInUser, bank } = useReduxState();

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showBanks &&
        !bankInputRef.current?.contains(event.target as Node) &&
        !dropdownBankRef.current?.contains(event.target as Node)
      ) {
        setShowBanks(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBanks]);

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
  }, [customerSearch, customers]);

  useEffect(() => {
    if (bankSearch.trim()) {
      const searchTerm = bankSearch.trim().toLowerCase();
      const filtered = banks?.filter((c) =>
        c!.acctName!.trim().toLowerCase().includes(searchTerm)
      );
      setFilteredBank(filtered);
    } else {
      // Reset to original list when search is empty
      setFilteredBank(banks);
    }
  }, [bankSearch, banks]); // Add customers to dependencies

  const nameSplit = buyer && buyer?.name.split(" ");
  const first = nameSplit && nameSplit![0][0];
  const second = (nameSplit && nameSplit![1] && nameSplit![1][0]) || "";

  const subTotal = payFull
    ? cartItems.reduce((acc, i) => {
        return acc + parseFloat(i.price);
      }, 0)
    : pay.amountPaid
    ? pay.amountPaid
    : "0.00";

  const total = payTax
    ? !isNaN(parseFloat(subTotal as string)) &&
      !isNaN(parseFloat(taxFee || "0"))
      ? parseFloat(subTotal as string) +
        (parseFloat(subTotal as string) * parseFloat(taxFee || "0")) / 100
      : "0.00"
    : !isNaN(parseFloat(subTotal as string))
    ? subTotal
    : "0.00";

  const handleSellProduct = ({ sku }: { sku?: string }) => {
    startTransition(async () => {
      if (cartItems.length === 1) {
        let product: {
          transaction: {
            quantity: number;
            price: number;
          };
          payment: { paymentMethod: string; balanceOwed: number };
          customerDetails?: { name: string; phone: string; email: string };
          vat: number;
          totalPay: number;
          acctPaidTo?: {
            bankName: string;
            acctNo: string;
            acctName: string;
            userBankId: string;
          };
        } = {
          transaction: {
            quantity: cartItems[0].qty,
            price: parseFloat(cartItems[0].price) / cartItems[0].qty,
          },
          payment: {
            paymentMethod: pay.paymentMethod,
            balanceOwed: Number(pay.balance),
          },
          vat: payTax
            ? (parseFloat(subTotal as string) * parseFloat(taxFee || "0")) / 100
            : 0,
          totalPay: Number(total),
        };

        if (pay.paymentMethod === "BANK_TRANSFER") {
          product.acctPaidTo = {
            bankName: bank?.bankName!,
            acctNo: bank?.acctNo!,
            acctName: bank?.acctName!,
            userBankId: bank?.id!,
          };
        }

        if (tab === "customer") {
          product.customerDetails = {
            name: buyer?.name!,
            phone: buyer?.phone!,
            email: buyer?.email!,
          };
        }

        const res = await SellProduct({
          token,
          userId: loggedInUser!.id,
          sku: sku!,
          product,
        });

        if (res?.error) {
          toast.error("Error", { description: res.error });

          setTaxFee("");
          setPay({ amountPaid: "", balance: "", paymentMethod: "CASH" });
          dispatch(CLEAR_CART());
          dispatch(SET_BUYER(null));
          dispatch(SET_BANK(null));
          setPayFull(false);
          setPayTax(false);
          return;
        }

        toast.success("Success", { description: res.success.msg });

        setTaxFee("");
        setPay({ amountPaid: "", balance: "", paymentMethod: "CASH" });
        dispatch(CLEAR_CART());
        dispatch(SET_BUYER(null));
        dispatch(SET_BANK(null));
        setPayFull(false);
        setPayTax(false);
      } else {
        let products: {
          transactions: {
            sku: string;
            quantity: number;
            sellingPrice: number;
          }[];
          payment: { paymentMethod: string; balanceOwed: number };
          customerDetails?: { name: string; phone: string; email: string };
          vat: number;
          totalPay: number;
          acctPaidTo?: {
            bankName: string;
            acctNo: string;
            acctName: string;
            userBankId: string;
          };
        } = {
          transactions: cartItems.map((c) => ({
            sku: c.sku,
            quantity: c.qty,
            sellingPrice: parseFloat(c.price) / c.qty,
          })),
          payment: {
            paymentMethod: pay.paymentMethod,
            balanceOwed: Number(pay.balance),
          },
          vat: payTax
            ? (parseFloat(subTotal as string) * parseFloat(taxFee || "0")) / 100
            : 0,
          totalPay: Number(total),
        };

        if (pay.paymentMethod === "BANK_TRANSFER") {
          products.acctPaidTo = {
            bankName: bank?.bankName!,
            acctNo: bank?.acctNo!,
            acctName: bank?.acctName!,
            userBankId: bank?.id!,
          };
        }

        if (tab === "customer") {
          products.customerDetails = {
            name: buyer?.name!,
            phone: buyer?.phone!,
            email: buyer?.email || "",
          };
        }

        const res = await SellProducts({
          token,
          userId: loggedInUser!.id,
          products,
        });

        if (res?.error) {
          toast.error("Error", { description: res.error });

          setTaxFee("");
          setPay({ amountPaid: "", balance: "", paymentMethod: "CASH" });
          dispatch(CLEAR_CART());
          dispatch(SET_BUYER(null));
          dispatch(SET_BANK(null));
          setPayFull(false);
          setPayTax(false);
          return;
        }

        toast.success("Success", { description: res.success.msg });

        setTaxFee("");
        setPay({ amountPaid: "", balance: "", paymentMethod: "CASH" });
        dispatch(CLEAR_CART());
        dispatch(SET_BUYER(null));
        dispatch(SET_BANK(null));
        setPayFull(false);
        setPayTax(false);
      }
    });
  };

  const filteredData = table.getRowModel().rows.filter((row) => {
    const uniqueProductTypes = Array.from(new Set(filterCat.productType));
    const matchesProductType = uniqueProductTypes.length
      ? uniqueProductTypes.includes(
          (row.original as { productType: string }).productType
        )
      : true;

    const matchesBrand = filterCat.brand.length
      ? filterCat.brand.includes((row.original as { brand: string }).brand)
      : true;

    return matchesProductType && matchesBrand;
  });

  const searchParams = useSearchParams();
  const rowsPerPage = 20;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentPage = Number(searchParams.get("page")) || 1;

  // Slice the filtered rows to display only the current page's rows
  const paginatedRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="max-w-7xl my-5 lg:mx-auto space-y-4 mx-2">
      <div className="flex gap-4 lg:gap-[110px] flex-col md:flex-row">
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
        <div className="col-span-2 bg-white rounded-lg p-4 sticky h-[580px] top-0 overflow-y-scroll hidden lg:block space-y-3">
          <div className="space-y-1">
            <p className="text-[#636363] text-sm font-semibold">Category</p>
            {/* <Input className="focus:!ring-0 focus:!border-0" /> */}
          </div>

          <div>
            {categories.map(({ brands, productType }) => (
              <div key={productType} className="space-y-2 mb-3">
                <p className="text-[#3B3B3B] !text-sm font-medium">
                  {productType.toUpperCase()}
                </p>

                {brands.map((b) => (
                  <div
                    className="flex items-center justify-between indent-5"
                    key={b}
                  >
                    <label
                      htmlFor={b}
                      className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#3B3B3B]"
                    >
                      {b}
                    </label>
                    <Checkbox
                      id={b}
                      className="cursor-pointer"
                      onCheckedChange={(checked) => {
                        setFilterCat((prev) => ({
                          productType: checked
                            ? [...prev.productType, productType]
                            : prev.productType.filter(
                                (type) => type !== productType
                              ),
                          brand: checked
                            ? [...prev.brand, b]
                            : prev.brand.filter((brand) => brand !== b),
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 lg:col-span-7 bg-white rounded-lg p-4 space-y-4">
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
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {paginatedRows.length > 0 && totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            )}
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

            {tab === "one_off" ? null : !buyer ? (
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
                    placeholder="search customer"
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
                        addCustomer.onOpen({ type: "customer" });
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
                    <p className="text-[#808080]">₦{c.price}</p>
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
              <Select
                onValueChange={(value) => {
                  setPay((prev) => ({
                    ...prev,
                    paymentMethod: value,
                  }));
                }}
                value={pay.paymentMethod}
              >
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

            {pay.paymentMethod === "BANK_TRANSFER" && !bank ? (
              <div className="">
                <p className="text-[#636363] text-xs mb-1 font-semibold">
                  Select Bank
                </p>
                <div
                  className="border relative rounded-lg"
                  onClick={() => {
                    setShowBanks(true);
                  }}
                  ref={bankInputRef}
                >
                  <Input
                    className="!border-0 !ring-0 focus:!border-0 focus:!ring-0 pr-9"
                    value={bankSearch}
                    onChange={(e) => {
                      setBankSearch(e.target.value);
                    }}
                    placeholder="search bank"
                  />
                  <Landmark className="size-5 absolute top-2 right-2 text-[#808080]" />
                </div>

                {showBanks && (
                  <div
                    className="bg-white z-50 rounded-lg border mt-1 max-h-[250px] overflow-y-scroll"
                    ref={dropdownBankRef}
                  >
                    <p
                      className="p-3 bg-[#F6F5FF] text-[#0C049B] flex items-center gap-2 text-sm cursor-pointer hover:text-[#0C049B]/80 hover:bg-[#F6F5FF]/80"
                      onClick={() => {
                        addCustomer.onOpen({ type: "bank" });
                        setShowCustomers(false);
                      }}
                    >
                      <Plus className="size-4" />
                      Add New Bank
                    </p>

                    {filteredBank.length > 0 ? (
                      filteredBank.map((c, i) => (
                        <Fragment key={`${c.bankName} - ${c.acctName} ${i}`}>
                          <div
                            className="p-3 flex gap-2 text-sm cursor-pointer hover:text-[#0C049B]/80 hover:bg-[#F6F5FF]/80 flex-col"
                            onClick={() => {
                              dispatch(
                                SET_BANK({
                                  id: c.id,
                                  bankName: c.bankName,
                                  acctNo: c.acctNo,
                                  acctName: c.acctName,
                                })
                              );
                            }}
                          >
                            <p> {c.acctName}</p>
                            <p className="text-[#3F3B3B] !text-xs">
                              {c.acctNo} | {c.bankName}
                            </p>
                          </div>

                          {i !== banks.length - 1 && <hr />}
                        </Fragment>
                      ))
                    ) : (
                      <div className="p-4 text-center font-semibold">
                        No Banks
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : pay.paymentMethod === "BANK_TRANSFER" && bank ? (
              <div className="border rounded-lg p-2 bg-white flex justify-between items-center gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{bank.acctName}</p>
                  <p className="text-xs text-[#A3A3A3]">
                    {bank.bankName} | {bank.acctNo}
                  </p>
                </div>
                <X
                  className="text-[#A3A3A3] size-4 ml-auto self-start cursor-pointer"
                  onClick={() => {
                    dispatch(SET_BANK(null));
                  }}
                />
              </div>
            ) : null}

            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-[#636363] text-xs mb-1 font-semibold">
                  Amount Paid
                </p>
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="payFull"
                    className="!text-[#636363] text-xs mb-1"
                  >
                    Paid Full Amount
                  </Label>
                  <Switch
                    id="payFull"
                    className="!h-[1rem] !w-6"
                    small
                    onClick={() => {
                      setPayFull((prev) => !prev);
                      setPay({
                        ...pay,
                        amountPaid: "",
                        balance: "",
                      });
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

              {tab === "customer" && (
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
                  id="payTax"
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
              disabled={
                tab === "customer"
                  ? !buyer ||
                    cartItems.length <= 0 ||
                    isPending ||
                    total === "0.00"
                  : cartItems.length <= 0 || isPending || total === "0.00"
              }
              isLoading={isPending}
              loadingText="please wait"
              onClick={() => {
                handleSellProduct({ sku: cartItems[0].sku });
              }}
            >
              Sell Products <MoveRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
