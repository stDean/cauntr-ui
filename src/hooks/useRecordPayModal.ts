import { create } from "zustand";

interface InvoiceData {
  invoiceNo: string;
  planId: string;
}

interface RecordPayModalProps {
  isOpen: boolean;
  customerName?: string;
  invoiceData?: InvoiceData;
  onOpen: ({
    customerName,
    invoiceData,
  }: {
    customerName: string;
    invoiceData: InvoiceData;
  }) => void;
  onClose: () => void;
}

const useRecordPayModal = create<RecordPayModalProps>((set) => ({
  isOpen: false,
  customerName: undefined,
  invoiceData: undefined,
  onOpen: ({
    customerName,
    invoiceData,
  }: {
    customerName: string;
    invoiceData: InvoiceData;
  }) => set({ isOpen: true, customerName, invoiceData }),
  onClose: () => set({ isOpen: false, customerName: undefined }),
}));

export default useRecordPayModal;
