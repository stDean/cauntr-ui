import { create } from "zustand";

type TypeProp = "click" | "single" | "multiple";
interface SupplierProps {
  id: string;
  name: string;
  email?: string;
  contact: string;
}

interface AddProductModalStore {
  isOpen: boolean;
  onOpen: (type: TypeProp, suppliers: SupplierProps[]) => void;
  onClose: () => void;
  type: TypeProp;
  suppliers: SupplierProps[] | [];
}

const useAddProductModal = create<AddProductModalStore>((set) => ({
  isOpen: false,
  type: "click" as TypeProp,
  suppliers: [],
  onOpen: (type, suppliers) => set({ isOpen: true, type, suppliers }),
  onClose: () => set({ isOpen: false, suppliers: [], type: "click" }),
}));

export default useAddProductModal;
