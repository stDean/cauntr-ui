"use client";

import { GetBanks } from "@/actions/inventory.a";
import { useAppDispatch } from "@/app/redux";
import useRecordPayModal from "@/hooks/useRecordPayModal";
import { useReduxState } from "@/hooks/useRedux";
import { SET_BANK } from "@/state";
import { Landmark, X } from "lucide-react";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { Banks } from "../form/AccountSettingsForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Modal } from "./Modal";
import { toast } from "sonner";
import { RecordPayment } from "@/actions/invoice.a";

export const RecordPayModal = () => {
  const recordPay = useRecordPayModal();
  const { token, loggedInUser, bank } = useReduxState();
  const dispatch = useAppDispatch();

  const [isPending, startTransition] = useTransition();
  const [banks, setBanks] = useState<Banks[]>([]);
  const [showBanks, setShowBanks] = useState(false);
  const [filteredBank, setFilteredBank] = useState(banks);
  const [bankSearch, setBankSearch] = useState("");
  const [pay, setPay] = useState<{
    amountPaid: string;
    paymentMethod: string;
  }>({
    amountPaid: "",
    paymentMethod: "CASH",
  });

  useEffect(() => {
    const fetchBanks = async () => {
      const res = await GetBanks({
        token,
        userId: loggedInUser ? loggedInUser!.id : "",
      });

      if (res) setBanks(res.success?.data?.banks);
    };

    fetchBanks();
  }, [token, loggedInUser]);

  const dropdownBankRef = useRef<HTMLDivElement>(null);
  const bankInputRef = useRef<HTMLDivElement>(null);

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

  const handlePayment = () => {
    startTransition(async () => {
      if (pay.amountPaid.trim() === "") {
        toast.warning("Warning", { description: "Amount cannot be empty." });
        return;
      }

      let data: {
        amount: string;
        method: string;
        paymentMethod?: {
          acctName: string;
          bankName: string;
          acctNo: string;
          userBankId: string;
        };
      } = {
        amount: pay.amountPaid,
        method: pay.paymentMethod,
      };

      if (pay.paymentMethod === "BANK_TRANSFER") {
        data.paymentMethod = {
          acctName: bank?.acctName!,
          bankName: bank?.bankName!,
          acctNo: bank?.acctNo!,
          userBankId: bank?.id!,
        };
      }
      const res = await RecordPayment({
        token,
        userId: loggedInUser!.id,
        data,
        invoiceNo: recordPay.invoiceData?.invoiceNo!,
        planId: recordPay.invoiceData?.planId!,
      });

      if (res.error) {
        toast.error("Error", { description: res.error });
        recordPay.onClose();
        setPay({ amountPaid: "", paymentMethod: "CASH" });
        setBankSearch("");
        setShowBanks(false);
        dispatch(SET_BANK(null));
        return;
      }

      toast.success("Success", { description: res.success.msg });
      recordPay.onClose();
      setPay({ amountPaid: "", paymentMethod: "CASH" });
      setBankSearch("");
      setShowBanks(false);
      dispatch(SET_BANK(null));
      return;
    });
  };

  const headerContent = <h1 className="text-xl">Record Payment</h1>;

  const bodyContent = (
    <div className="p-4 space-y-4">
      <div className="space-y-1">
        <p className="text-[#636363] text-xs">Customer Name</p>
        <Input value={recordPay.customerName!} disabled />
      </div>

      <div className="space-y-1">
        <p className="text-[#636363] text-xs">Mode of Payment</p>
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
                <div className="p-4 text-center font-semibold">No Banks</div>
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
        <p className="text-[#636363] text-xs">Amount</p>
        <Input
          placeholder="enter amount"
          value={pay.amountPaid}
          onChange={(e) => {
            setPay({ ...pay, amountPaid: e.target.value });
          }}
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant={"cauntr_blue"}
          size={"sm"}
          className="cursor-pointer text-xs"
          onClick={handlePayment}
          disabled={isPending}
          isLoading={isPending}
          loadingText="please wait"
        >
          Record Payment
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={recordPay.isOpen}
      onClose={recordPay.onClose}
      headerContent={headerContent}
      body={bodyContent}
    />
  );
};
