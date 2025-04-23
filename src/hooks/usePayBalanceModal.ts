import { create } from "zustand";

interface PayBalanceModalProps {
  isOpen: boolean;
  itemId: string | null;
  onOpen: (itemId: string) => void;
  onClose: () => void;
}

const usePayBalanceModal = create<PayBalanceModalProps>((set) => ({
  isOpen: false,
  itemId: null,
  onOpen: (itemId: string) => set({ isOpen: true, itemId }),
  onClose: () => set({ isOpen: false, itemId: null }),
}));

export default usePayBalanceModal;
