import { create } from "zustand";

interface CreateReceiptModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useReceiptModal = create<CreateReceiptModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useReceiptModal;
