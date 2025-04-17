"use client";

import usePayBalanceModal from "@/hooks/usePayBalanceModal";
import { Modal } from "./Modal";
import { Input } from "../ui/input";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useReduxState } from "@/hooks/useRedux";
import { Landmark, Plus, X } from "lucide-react";
import { SET_BANK } from "@/state";
import { useAppDispatch } from "@/app/redux";
import useAddCustomerModal from "@/hooks/useAddCustomerModal";
import { Banks } from "../form/AccountSettingsForm";
import { GetBanks } from "@/actions/inventory.a";
import { Button } from "../ui/button";
import { PayBalance } from "@/actions/users.a";
import { toast } from "sonner";

export const PayBalanceModal = () => {
  const payBalance = usePayBalanceModal();
  const addCustomer = useAddCustomerModal();
  const [isPending, startTransition] = useTransition();
  const { bank, loggedInUser, token } = useReduxState();
  const dispatch = useAppDispatch();
  const [banks, setBanks] = useState<Banks[] | []>([]);
  const [showBanks, setShowBanks] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [filteredBank, setFilteredBank] = useState(banks);
  const [pay, setPay] = useState<{
    amount: string;
    paymentMethod: string;
  }>({
    amount: "",
    paymentMethod: "CASH",
  });

  const bankInputRef = useRef<HTMLDivElement>(null);
  const dropdownBankRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      const res = await GetBanks({ token, userId: loggedInUser!.id });
      setBanks(res.success.data.banks);
    };

    fetchBanks();
  }, [token, loggedInUser]);

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

  console.log({ banks, a: payBalance.item });

  const handlePay = () => {
    startTransition(async () => {
      const res = await PayBalance({
        token,
        userId: loggedInUser!.id,
        payData: { amount: Number(pay.amount), method: pay.paymentMethod },
        itemId: payBalance!.item!.salesDetails!.itemId!,
        acctPaidTo: {
          bankName: bank?.bankName!,
          acctNo: bank?.acctNo!,
          acctName: bank?.acctName!,
          userBankId: bank?.id!,
        },
      });

      if (res.error) {
        toast.error("Error", { description: res.error });
        payBalance.onClose();
        setBankSearch("");
        setShowBanks(false);
        dispatch(SET_BANK(null));
        setPay({ amount: "", paymentMethod: "CASH" });
        return;
      }

      toast.success("Success", { description: res.success.msg });
      payBalance.onClose();
      setBankSearch("");
      setShowBanks(false);
      dispatch(SET_BANK(null));
      setPay({ amount: "", paymentMethod: "CASH" });
    });
  };

  const headerContent = <h1 className="text-xl">Record Balance</h1>;

  const bodyContent = (
    <div className="p-4 space-y-2">
      <div className="space-y-2 pb-2">
        <p className="font-semibold">Sale Detail</p>
        <div className="md:grid grid-cols-12 gap-4 space-y-2 md:space-y-0">
          <div className="w-full md:col-span-6 space-y-1">
            <p className="text-xs text-[#636363]">Customer Name</p>
            <Input
              value={payBalance.item?.salesDetails.customerName}
              disabled
            />
          </div>

          <div className="w-full md:col-span-6 space-y-1">
            <p className="text-xs text-[#636363]">Sale Type</p>
            <Input
              value={
                payBalance.item?.salesDetails.salesType === "SALE"
                  ? "Sale"
                  : "Bulk Sales"
              }
              disabled
            />
          </div>

          <div className="w-full md:col-span-4 space-y-1">
            <p className="text-xs text-[#636363]">Sales Amount</p>
            <Input value={payBalance.item?.salesDetails.salesAmount} disabled />
          </div>

          <div className="w-full md:col-span-4 space-y-1">
            <p className="text-xs text-[#636363]">Paid Amount</p>
            <Input value={payBalance.item?.salesDetails.alreadyPaid} disabled />
          </div>

          <div className="w-full md:col-span-4 space-y-1">
            <p className="text-xs text-[#636363]">Amount Owed</p>
            <Input value={payBalance.item?.salesDetails.balanceOwed} disabled />
          </div>
        </div>
      </div>

      <hr />

      <div className="space-y-2 pb-2">
        <p className="font-semibold">Payment History</p>
        <div className="max-h-56 overflow-y-scroll space-y-2">
          {payBalance.item?.paymentHistory.map((p, i) => {
            return (
              <div
                className="md:grid grid-cols-12 gap-4 space-y-2 md:space-y-0"
                key={`${p.amount} - ${p.paymentDate} - ${i}`}
              >
                <div className="w-full md:col-span-6 space-y-1">
                  <p className="text-xs text-[#636363]">Payment Date</p>
                  <Input
                    value={new Date(p.paymentDate).toLocaleDateString()}
                    disabled
                  />
                </div>

                <div className="w-full md:col-span-6 space-y-1">
                  <p className="text-xs text-[#636363]">Amount</p>
                  <Input value={p.balancePaid} disabled />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <hr />

      <div className="space-y-2 pb-2">
        <p className="font-semibold">Sale Detail</p>

        <div className="space-y-1">
          <p className="text-xs text-[#636363]">Payment Details</p>
          <Input
            value={pay.amount}
            onChange={(e) => {
              setPay((prev) => ({
                ...prev,
                amount: e.target.value,
              }));
            }}
            placeholder="0"
          />
        </div>

        <div className="space-y-1">
          <div>
            <p className="text-xs text-[#636363]">Select Mode of Payment</p>
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
        </div>
      </div>

      <hr />

      <div className="flex justify-end pt-2">
        <Button
          variant={"cauntr_blue"}
          size={"sm"}
          onClick={handlePay}
          disabled={isPending}
          isLoading={isPending}
          loadingText="paying"
          className="cursor-pointer"
        >
          Pay
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={payBalance.isOpen}
      onClose={() => {
        payBalance.onClose();
        setBankSearch("");
        setPay({ amount: "", paymentMethod: "CASH" });
      }}
      headerContent={headerContent}
      body={bodyContent}
      addStyle2
    />
  );
};
