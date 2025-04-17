import { create } from "zustand";

interface TransItemProps {
  salesDetails: {
    customerName: string;
    salesAmount: string;
    balanceOwed: string;
    salesType: string;
    itemId: string;
    alreadyPaid: string;
  };
  paymentHistory: {
    paymentDate: Date;
    amount: string;
    balancePaid: string;
  }[];
}

interface PayBalanceModalProps {
  isOpen: boolean;
  item: TransItemProps | null;
  onOpen: (item: TransItemProps) => void;
  onClose: () => void;
}

const usePayBalanceModal = create<PayBalanceModalProps>((set) => ({
  isOpen: false,
  item: null,
  onOpen: (item) => set({ isOpen: true, item }),
  onClose: () => set({ isOpen: false, item: null }),
}));

export default usePayBalanceModal;
