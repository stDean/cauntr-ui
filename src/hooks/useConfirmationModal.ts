import { create } from "zustand";

interface ConfirmationProps {
  firstData: string;
  secondData?: string;
  thirdData?: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  confirmationData: ConfirmationProps | null;
  onOpen: (data: ConfirmationProps) => void;
  onClose: () => void;
}

const useConfirmationModal = create<ConfirmationModalProps>((set) => ({
  isOpen: false,
  confirmationData: null,
  onOpen: (data: ConfirmationProps) =>
    set({ isOpen: true, confirmationData: data }),
  onClose: () => set({ isOpen: false, confirmationData: null }),
}));

export default useConfirmationModal;
