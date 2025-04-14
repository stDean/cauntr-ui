import { create } from "zustand";

interface ProductProp {
  productName: string;
  serialNo?: string;
  costPrice: string;
  price: string;
  qty: number;
  id: string;
  totalQty: number;
  sku: string;
}

interface AddSellingPriceModalProps {
  isOpen: boolean;
  product: ProductProp | null;
  onOpen: (data: ProductProp) => void;
  onClose: () => void;
}

const useAddSellingPriceModal = create<AddSellingPriceModalProps>((set) => ({
  isOpen: false,
  product: null,
  onOpen: (data) => set({ isOpen: true, product: data }),
  onClose: () => set({ isOpen: false, product: null }),
}));

export default useAddSellingPriceModal;
