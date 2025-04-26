"use client";

import { format } from "date-fns";
import { CreateInvoice } from "@/actions/invoice.a";
import { AcctDetailsProps } from "@/actions/settings.a";
import { useAppDispatch } from "@/app/redux";
import { Banks } from "@/components/form/AccountSettingsForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReduxState } from "@/hooks/useRedux";
import { CustomerProps } from "@/lib/types";
import { cn, formatNaira } from "@/lib/utils";
import { SET_BANK, SET_BUYER } from "@/state";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Percent,
  UserSearch,
  X,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";

enum Steps {
  BUSNDCUS = 0,
  PAYMENT = 1,
}

export const CreateInvoiceContent = ({
  companyAcct,
  customers,
  data,
  banks,
}: {
  companyAcct: AcctDetailsProps | null;
  customers: CustomerProps[];
  data: {
    productName: string;
    price: string;
    qty: string;
    sku: string;
    id: string;
  }[];
  banks: Banks[];
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(Steps.BUSNDCUS);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [filteredCustomer, setFilteredCustomer] = useState(customers);
  const [filteredProducts, setFilteredProducts] = useState(data);
  const [tax, setTax] = useState("");
  const [showCustomers, setShowCustomers] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [filteredBank, setFilteredBank] = useState(banks);
  const [showBanks, setShowBanks] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [date, setDate] = useState<Date>();
  const [addedProducts, setAddedProducts] = useState<
    {
      name: string;
      price: string;
      sellingPrice: string;
      qty: number;
      sku: string;
      quantity: string;
      id: string;
    }[]
  >([]);
  const { buyer, bank, token, loggedInUser } = useReduxState();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const productInputRef = useRef<HTMLDivElement>(null);
  const bankInputRef = useRef<HTMLDivElement>(null);
  const dropdownBankRef = useRef<HTMLDivElement>(null);

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
        showProducts &&
        !productInputRef.current?.contains(event.target as Node) &&
        !productDropdownRef.current?.contains(event.target as Node)
      ) {
        setShowProducts(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProducts]);

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
    if (productSearch.trim()) {
      const searchTerm = productSearch.trim().toLowerCase();
      const filtered = data.filter((c) =>
        c.productName.trim().toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      // Reset to original list when search is empty
      setFilteredProducts(data);
    }
  }, [productSearch, data]);

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
  }, [bankSearch, banks]);

  const subTotal = addedProducts.reduce((acc, product) => {
    const price =
      product.price !== "0"
        ? parseFloat(product.price)
        : parseFloat(product.sellingPrice) || 0;
    return acc + price * product.qty;
  }, 0);

  const taxPercentage = parseFloat(tax) || 0;
  const taxAmount = subTotal * (taxPercentage / 100);
  const total = subTotal + taxAmount;

  const hasInvalidSellingPrice = addedProducts.some(
    (product) =>
      product.price === "0" &&
      (!product.sellingPrice || product.sellingPrice === "0")
  );

  const handleCreateInvoice = () => {
    startTransition(async () => {
      const products = addedProducts.map((p) => ({
        productId: p.id,
        pricePerUnit: Number(p.sellingPrice),
        totalPrice: Number(p.sellingPrice) * Number(p.qty),
        quantity: p.qty,
      }));

      const data: any = {
        customerDetails: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        },
        payment: {
          method: paymentMethod,
          totalAmount: Number(total),
          paymentDate: date && date!.toISOString(),
          vat: Number(taxAmount),
        },
        productDetails: products,
      };

      if (paymentMethod === "BANK_TRANSFER") {
        data.paymentMethod = {
          bankName: bank?.bankName,
          acctName: bank?.acctName,
          acctNo: bank?.acctNo,
          userBankId: bank?.id,
        };
      }

      const res = await CreateInvoice({
        token,
        userId: loggedInUser!.id,
        data,
      });
      if (res.error) {
        toast.error("Error", { description: res.error });
        setCustomer({ address: "", email: "", name: "", phone: "" });
        setTax("");
        setAddedProducts([]);
        setStep(Steps.BUSNDCUS);
        setPaymentMethod("CASH");
        dispatch(SET_BANK(null));
        dispatch(SET_BUYER(null));
        return;
      }

      toast.success("Success", { description: res.success.msg });
      setCustomer({ address: "", email: "", name: "", phone: "" });
      setTax("");
      setAddedProducts([]);
      setStep(Steps.BUSNDCUS);
      setPaymentMethod("CASH");
      dispatch(SET_BANK(null));
      dispatch(SET_BUYER(null));

      router.push("/invoice");
    });
  };

  return (
    <div className="px-4 mb-18 lg:mb-2 space-y-4 flex gap-4">
      <div className="flex-1 rounded-lg border p-4 h-fit hidden md:block bg-white">
        <div className="space-y-4">
          <div>
            <p className="text-xs md:text-sm text-[#A3A3A3]">Invoice No</p>
          </div>

          <hr />

          <div>
            <p className="font-semibold text-sm">
              Invoice Date: <span>{new Date().toLocaleDateString()}</span>
            </p>
            <p className="font-semibold text-sm">
              Payment Date: <span>{new Date().toLocaleDateString()}</span>
            </p>
          </div>

          <hr />

          <div className="flex flex-col gap-2 sm:flex-row justify-between">
            <div className="text-[#636363] text-xs flex-1 space-y-1">
              <p className="font-semibold !text-sm">
                {companyAcct?.businessName}
              </p>
              <p>{companyAcct?.businessAddress}</p>
              <p>{companyAcct?.phoneNumber}</p>
              <p>{companyAcct?.businessEmail}</p>
            </div>
            <div className="text-[#636363] text-xs flex-1 space-y-1">
              <p className="font-semibold !text-sm">Bill To</p>
              <p>{customer.name}</p>
              <p>{customer.address}</p>
              <p>{customer.phone}</p>
              <p>{customer.email}</p>
            </div>
            <div></div>
          </div>

          <hr />

          <div className="font-semibold">
            {formatNaira(Number(total))} due on{" "}
            {date ? date!.toLocaleDateString()! : ""}
          </div>

          <hr />

          <div className="">
            {addedProducts.map((p, i) => (
              <Fragment key={`${p.price} - ${i}`}>
                <div className="grid grid-cols-12 py-4">
                  <p className="col-span-8 text-[#121212] font-medium md:text-base text-sm">
                    {p.name}{" "}
                    <span className="text-[#808080]  text-xs text-medium">
                      x{p.qty}
                    </span>
                  </p>
                  <div className="flex justify-between col-span-4">
                    <p className="font-medium md:text-sm text-xs">x{p.qty}</p>
                    <p className="font-medium md:text-sm text-xs">
                      {formatNaira(Number(p.sellingPrice))}
                    </p>
                  </div>
                </div>

                <hr />
              </Fragment>
            ))}
          </div>

          <div className="text-[#121212] font-semibold flex items-center justify-between">
            <p>Subtotal</p>
            <p>{formatNaira(subTotal)}</p>
          </div>

          <div className="text-[#121212] font-semibold text-xl flex items-center justify-between">
            <p>Total</p>
            <p>{formatNaira(total)}</p>
          </div>

          <hr />

          <p className="font-semibold mb-1">Payment method</p>
          {paymentMethod === "BANK_TRANSFER" &&
          bank &&
          bank.acctName?.trim() !== undefined ? (
            <div className="space-y-1">
              <p className="font-semibold">Last Payment to:</p>
              <p className="text[#A3A3A3] text-sm">
                Account Name: {bank.acctName}
              </p>
              <p className="text[#A3A3A3] text-sm">
                Bank name: {bank.bankName}
              </p>
              <p className="text[#A3A3A3] text-sm">
                Account Number: {bank.acctNo}
              </p>
            </div>
          ) : (
            paymentMethod === "CASH" && (
              <p className="font-semibold text-blue-400">
                Payment to be made by cash
              </p>
            )
          )}
        </div>
      </div>

      <div className="w-full md:w-[350px] xl:w-[450px] rounded-lg border p-4 h-fit md:max-h-[700px] md:overflow-y-scroll">
        <p className="text-xl font-semibold">Create Invoice</p>
        {step === Steps.BUSNDCUS ? (
          <div className="mt-2 space-y-4">
            <div>
              <p className="text-sm">Business Information</p>

              <div className="space-y-4 mt-2">
                <div>
                  <p className="text-xs text-[#636363]">Name</p>
                  <Input value={companyAcct?.businessName} disabled />
                </div>

                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-[#636363]">Email</p>
                    <Input value={companyAcct?.businessEmail} disabled />
                  </div>
                  <div>
                    <p className="text-xs text-[#636363]">Phone Number</p>
                    <Input value={companyAcct?.phoneNumber} disabled />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#636363]">Address</p>
                  <Input value={companyAcct?.businessAddress} disabled />
                </div>
              </div>
            </div>

            <hr />

            <div>
              <p className="text-sm">Client Information</p>

              <div className="space-y-4 mt-2">
                <div>
                  <p className="text-xs text-[#636363]">Select Client</p>
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
                                    address: c.address,
                                  })
                                );
                                setCustomer({
                                  name: c.name || buyer?.name || "",
                                  email: c.email || buyer?.email || "",
                                  phone: c.phone || buyer?.phone || "",
                                  address: c.address || buyer?.address || "",
                                });

                                setShowCustomers(false);
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

                <div>
                  <p className="text-xs text-[#636363]">Name</p>
                  <Input value={customer.name} disabled />
                </div>

                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-[#636363]">Email</p>
                    <Input value={customer.email} disabled />
                  </div>
                  <div>
                    <p className="text-xs text-[#636363]">Phone Number</p>
                    <Input value={customer.phone} disabled />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#636363]">Address</p>
                  <Input value={customer.address} disabled />
                </div>
              </div>
            </div>

            <hr />

            <div className="flex justify-end gap-4">
              <Button
                variant={"outline_red"}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(SET_BUYER(null));
                  setCustomer({
                    address: "",
                    email: "",
                    name: "",
                    phone: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                variant={"cauntr_blue"}
                className="cursor-pointer"
                onClick={() => {
                  setStep(Steps.PAYMENT);
                }}
                disabled={customer.name.trim() === ""}
              >
                Save And Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-1 mt-2">Search Product</p>
              <div ref={productInputRef} onClick={() => setShowProducts(true)}>
                <Input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="search product name"
                />
              </div>
            </div>

            {showProducts && (
              <div
                className="bg-white z-50  rounded-lg border -mt-2 max-h-[250px] overflow-y-scroll"
                ref={productDropdownRef}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((c, i) => (
                    <Fragment key={`${c.productName} - ${c.price} ${i}`}>
                      <div
                        className="cursor-pointer hover:text-[#0C049B]/80 hover:bg-[#F6F5FF]/80"
                        onClick={() => {
                          const isDuplicate = addedProducts.some(
                            (product) => product.sku === c.sku
                          );

                          if (!isDuplicate) {
                            setAddedProducts([
                              ...addedProducts,
                              {
                                name: c.productName,
                                price: c.price,
                                qty: 1,
                                sku: c.sku,
                                quantity: c.qty,
                                sellingPrice: c.price === "0" ? "" : c.price,
                                id: c.id,
                              },
                            ]);
                          }
                          setShowProducts(false);
                        }}
                      >
                        <p
                          className="px-3 pt-3 pb-1 text-sm"
                          onClick={() => {}}
                        >
                          {c.productName}
                        </p>

                        <p className="px-3 pb-3 text-xs">
                          #{c.price} | {c.qty}
                        </p>
                      </div>

                      {i !== data.length - 1 && <hr />}
                    </Fragment>
                  ))
                ) : (
                  <div className="p-4 text-center font-semibold">
                    No Customer
                  </div>
                )}
              </div>
            )}

            <div>
              <p className="text-sm text[#636363]">Added Products</p>

              {addedProducts.length > 0 ? (
                <div>
                  {addedProducts.map((product, idx) => (
                    <div
                      key={`${product.name} ${idx}`}
                      className="flex justify-between items-center p-4 rounded-lg bg-[#EEEEEE] mt-1"
                    >
                      <p className="truncate w-24">{product.name}</p>
                      <p className="flex items-center justify-between gap-2">
                        <ChevronLeft
                          className="size-4 cursor-pointer"
                          onClick={() => {
                            setAddedProducts((prev) =>
                              prev
                                .map((p, index) =>
                                  index === idx ? { ...p, qty: p.qty - 1 } : p
                                )
                                .filter((p) => p.qty > 0)
                            );
                          }}
                        />
                        {product.qty}
                        <ChevronRight
                          className="size-4 cursor-pointer"
                          onClick={() => {
                            if (
                              Number(product.quantity) > Number(product.qty)
                            ) {
                              setAddedProducts((prev) =>
                                prev.map((p, index) =>
                                  index === idx ? { ...p, qty: p.qty + 1 } : p
                                )
                              );
                            }
                          }}
                        />
                      </p>
                      {product.price !== "0" ? (
                        <p>{formatNaira(Number(product.price))}</p>
                      ) : (
                        <Input
                          className="bg-white w-18 focus:!ring-0 focus:!border-0"
                          value={product.sellingPrice}
                          onChange={(e) => {
                            const newPrice = e.target.value;
                            setAddedProducts((prev) =>
                              prev.map((p) =>
                                p.sku === product.sku
                                  ? { ...p, sellingPrice: newPrice }
                                  : p
                              )
                            );
                          }}
                        />
                      )}
                      <X
                        className="size-4 cursor-pointer"
                        onClick={() => {
                          setAddedProducts((prev) =>
                            prev.filter((p) => p.sku !== product.sku)
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center my-3 text-sm font-semibold">
                  Search Product to add to invoice item
                </p>
              )}
            </div>

            <hr />

            <p className="text-sm">Payment Method</p>

            <div>
              <p className="text-xs text-[#636363] mb-1">Mode of Payment</p>

              <Select
                onValueChange={(value) => {
                  setPaymentMethod(value);
                }}
                value={paymentMethod}
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

            {paymentMethod === "BANK_TRANSFER" && !bank ? (
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
            ) : paymentMethod === "BANK_TRANSFER" && bank ? (
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

            <div className="space-y-6">
              <div className="flex gap-2 items-center">
                <div className="space-y-1 flex-1">
                  <p className="text-xs text-[#636363]">Payment Date</p>
                  {/* TODO:CHange this to a date picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1 flex-1">
                  <p className="text-xs text-[#636363]">Tax</p>
                  <div className="relative border rounded-lg">
                    <Input
                      className="ring-0 border-0 focus:!ring-0 focus:!border-0 pr-7"
                      value={tax}
                      onChange={(E) => setTax(E.target.value)}
                      placeholder="0"
                    />
                    <Percent className="size-4 absolute right-2 top-3 text-[#636363]" />
                  </div>
                </div>
              </div>

              <hr />

              <div className="flex justify-between items-center font-semibold">
                <p>SubTotal</p>
                <p>{formatNaira(subTotal)}</p>
              </div>

              <div className="flex justify-between items-center font-semibold text-xl">
                <p>Total</p>
                <p>{formatNaira(total)}</p>
              </div>
            </div>

            <hr />

            <div className="flex justify-end gap-4">
              <Button
                variant={"outline_red"}
                className="cursor-pointer"
                onClick={() => {
                  setStep(Steps.BUSNDCUS);
                  setAddedProducts([]);
                  dispatch(SET_BANK(null));
                }}
              >
                Cancel
              </Button>
              <Button
                variant={"cauntr_blue"}
                className="cursor-pointer"
                onClick={handleCreateInvoice}
                disabled={
                  addedProducts.length === 0 ||
                  hasInvalidSellingPrice ||
                  isPending
                }
                isLoading={isPending}
                loadingText="creating"
              >
                Create Invoice
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
