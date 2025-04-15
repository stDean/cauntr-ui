"use client";

import { CartTable } from "@/components/table/CartTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAddCustomerModal from "@/hooks/useAddCustomerModal";
import { useReduxState } from "@/hooks/useRedux";
import { CustomerProps } from "@/lib/types";
import {
  Landmark,
  MoveLeft,
  MoveRight,
  Percent,
  Plus,
  UserSearch,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { useAppDispatch } from "../redux";
import { CLEAR_CART, SET_BANK, SET_BUYER } from "@/state";
import { Banks } from "@/components/form/AccountSettingsForm";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SellProduct, SellProducts } from "@/actions/inventory.a";
import { toast } from "sonner";

export const CartContent = ({
  customers,
  banks,
}: {
  customers: CustomerProps[];
  banks: Banks[];
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addCustomer = useAddCustomerModal();
  const [isPending, startTransition] = useTransition();
  const { cartItems, bank, buyer, token, loggedInUser } = useReduxState();
  const [type, setType] = useState<"customer" | "one_off">("customer");
  const [filteredCustomer, setFilteredCustomer] = useState(customers);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomers, setShowCustomers] = useState(false);
  const [showBanks, setShowBanks] = useState(false);
  const [filteredBank, setFilteredBank] = useState(banks);
  const [bankSearch, setBankSearch] = useState("");
  const [payFull, setPayFull] = useState(false);
  const [payTax, setPayTax] = useState(false);
  const [taxFee, setTaxFee] = useState("");
  const [pay, setPay] = useState<{
    amountPaid: string;
    balance: string;
    paymentMethod: string;
  }>({
    amountPaid: "",
    balance: "",
    paymentMethod: "CASH",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownBankRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const bankInputRef = useRef<HTMLDivElement>(null);

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

        if (type === "customer") {
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

        if (type === "customer") {
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

  return (
    <div className="p-4 space-y-4">
      <Button
        className="cursor-pointer"
        variant={"outline_blue"}
        size={"sm"}
        onClick={() => {
          router.push("/sell");
        }}
      >
        <MoveLeft className="size-4 mr-2" />
        Continue Shopping
      </Button>

      <div className="space-y-4 h-screen overflow-y-scroll pb-36">
        <div className="p-4 border rounded-lg bg-white space-y-2">
          <p className="text-sm font-semibold">Cart Item(s)</p>
          <CartTable data={cartItems} />
        </div>

        <div className="bg-white rounded-lg p-4 border space-y-2">
          <p className="text-sm font-semibold">Payment</p>

          <div className="w-[170px] bg-white border rounded-full flex p-1">
            <p
              className={`flex-1 text-center p-1 text-xs ${
                type === "customer" &&
                "rounded-full text-white font-semibold bg-[#0C049B] transition ease-linear"
              } cursor-pointer`}
              onClick={() => {
                setType("customer");
              }}
            >
              Customer
            </p>
            <p
              className={`flex-1 text-center p-1 text-xs ${
                type === "one_off" &&
                "rounded-full text-white font-semibold bg-[#0C049B] transition ease-linear"
              } cursor-pointer`}
              onClick={() => {
                setType("one_off");
              }}
            >
              One Off
            </p>
          </div>

          {type === "customer" && (
            <div className="space-y-2">
              {!buyer ? (
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
          )}

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

          {!bank && pay.paymentMethod === "BANK_TRANSFER" ? (
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
          ) : bank && pay.paymentMethod === "BANK_TRANSFER" ? (
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

            <div className="mt-1">
              <p className="text-[#636363] text-xs mb-1 font-semibold">
                Balance Owed
              </p>

              <Input
                placeholder="enter balance owed"
                disabled={payFull}
                name="balance"
                value={pay.balance}
                onChange={(e) => setPay({ ...pay, balance: e.target.value })}
              />
            </div>
          </div>

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

          <hr />

          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-[#808080]">Sub-total</p>
            <p className="text-sm font-semibold text-[#808080]">{subTotal}</p>
          </div>

          <hr />

          <div className="flex items-center justify-between">
            <p>Total</p>
            <p>{total}</p>
          </div>

          <hr />

          <div>
            <Button
              variant={"cauntr_blue"}
              size={"sm"}
              className="w-full cursor-pointer"
              disabled={
                type === "customer"
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
};
