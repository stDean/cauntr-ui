import { create } from "zustand";

interface AddCustomerModalProps {
  isOpen: boolean;
  type: string;
  onOpen: ({ type }: { type: string }) => void;
  onClose: () => void;
}

const useAddCustomerModal = create<AddCustomerModalProps>((set) => ({
  isOpen: false,
  type: "customer",
  onOpen: ({ type }: { type: string }) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: "customer" }),
}));

export default useAddCustomerModal;
