import { create } from "zustand";

interface AddCustomerModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAddCustomerModal = create<AddCustomerModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));

export default useAddCustomerModal;
