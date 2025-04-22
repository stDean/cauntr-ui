import { create } from "zustand";

interface IdProps {
  planId: string;
  paymentId: string;
  invoiceNo: string;
}

interface InvoiceConfirmationModalProps {
  isOpen: boolean;
  type?: string;
  ids?: IdProps;
  onOpen: ({
    type,
    userName,
    ids,
  }: {
    type: string;
    userName: string;
    ids: IdProps;
  }) => void;
  onClose: () => void;
  userName?: string;
}

const useInvoiceConfirmationModal = create<InvoiceConfirmationModalProps>(
  (set) => ({
    isOpen: false,
    type: undefined,
    userName: undefined,
    ids: undefined,
    onOpen: ({
      type,
      userName,
      ids,
    }: {
      type: string;
      userName: string;
      ids: IdProps;
    }) => set({ isOpen: true, type, userName, ids }),
    onClose: () =>
      set({
        isOpen: false,
        type: undefined,
        userName: undefined,
        ids: undefined,
      }),
  })
);

export default useInvoiceConfirmationModal;
