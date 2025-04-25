"use client";

import useInvoiceConfirmationModal from "@/hooks/useInvoiceConfirmation";
import { BellRing, CheckCheck } from "lucide-react";
import { ConfirmationModal } from "./ConfirmationModal";
import { useTransition } from "react";
import { MarkAsPaid, ResendInvoice } from "@/actions/invoice.a";
import { useReduxState } from "@/hooks/useRedux";
import { toast } from "sonner";

export const InvoiceConfirmationModal = () => {
  const invoiceConfirmation = useInvoiceConfirmationModal();
  const { token, loggedInUser } = useReduxState();
  const [isPending, startTransition] = useTransition();

  const subText =
    invoiceConfirmation.type === "notify" ? (
      <span>
        Do you want to send a payment reminder to{" "}
        <b>"{invoiceConfirmation.userName}"</b>
      </span>
    ) : (
      <span>
        Marking the invoice as paid will close the payment for{" "}
        <b>"{invoiceConfirmation.userName}"</b>
      </span>
    );

  const handleConfirmation = () => {
    startTransition(async () => {
      if (invoiceConfirmation.type === "notify") {
        const res = await ResendInvoice({
          token,
          invoiceNo: invoiceConfirmation.ids?.invoiceNo!,
        });

        if (res.error) {
          toast.error("Error", { description: res.error });
          invoiceConfirmation.onClose();
          return;
        }

        toast.success("Success", { description: res.success.msg });
        invoiceConfirmation.onClose();
        return;
      }

      const res = await MarkAsPaid({
        token,
        userId: loggedInUser!.id,
        invoiceNo: invoiceConfirmation.ids?.invoiceNo!,
        paymentId: invoiceConfirmation.ids?.paymentId!,
        planId: invoiceConfirmation.ids?.planId!,
      });

      if (res.error) {
        toast.error("Error", { description: res.error });
        invoiceConfirmation.onClose();
        return;
      }

      toast.success("Success", { description: res.success.msg });
      invoiceConfirmation.onClose();
    });
  };

  return (
    <ConfirmationModal
      isOpen={invoiceConfirmation.isOpen}
      onClose={invoiceConfirmation.onClose}
      Icon={invoiceConfirmation.type === "notify" ? BellRing : CheckCheck}
      secondaryText={
        invoiceConfirmation.type === "notify" ? "Send Reminder" : "Mark as Paid"
      }
      secondaryButtonAction={handleConfirmation}
      subText={subText}
      variant="cauntr_blue"
      colored
      isPending={isPending}
    />
  );
};
