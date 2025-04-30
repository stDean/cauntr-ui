import { create } from "zustand";

interface CreateReceiptModalProps {
  isOpen: boolean;
  receipt: any;
  onOpen: (receipt: any) => void;
  onClose: () => void;
}

const useReceiptModal = create<CreateReceiptModalProps>((set) => ({
  isOpen: false,
  receipt: null,
  onOpen: (receipt) => set({ isOpen: true, receipt }),
  onClose: () => set({ isOpen: false, receipt: null }),
}));

export default useReceiptModal;
