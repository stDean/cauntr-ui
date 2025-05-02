import { create } from "zustand";

interface ManageRestockLevelModalProps {
  isOpen: boolean;
  productName?: string;
  onOpen: (productName: string) => void;
  onClose: () => void;
}

const useManageRestockLevelModal = create<ManageRestockLevelModalProps>(
  (set) => ({
    isOpen: false,
    productName: undefined,
    onOpen: (productName: string) => set({ isOpen: true, productName }),
    onClose: () => set({ isOpen: false, productName: undefined }),
  })
);

export default useManageRestockLevelModal;
