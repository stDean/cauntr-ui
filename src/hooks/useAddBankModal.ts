import { create } from "zustand";

interface BankProps {
  bankName: string;
  acctNo: string;
}
interface AddBankStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  banks: BankProps[] | [];
  addBank: (bank: BankProps) => void;
  removeBank: (bank: BankProps) => void;
}

const useAddBankModal = create<AddBankStore>((set, get) => ({
  isOpen: false,
  banks: [],
  onOpen: () => set({ isOpen: true, banks: [...get().banks] }),
  onClose: () => set({ isOpen: false, banks: [...get().banks] }),
  addBank: (bank: BankProps) => {
    const existingBank = get().banks.find(
      (bankInStore: BankProps) => bankInStore.acctNo === bank.acctNo
    );
    if (!existingBank) {
      set({
        isOpen: true,
        banks: [...get().banks, bank],
      });
    }
  },
  removeBank: (bank: BankProps) =>
    set({
      // isOpen: true,
      banks: get().banks.filter(
        (bankInStore: BankProps) =>
          bankInStore.acctNo !== bank.acctNo &&
          bankInStore.bankName !== bank.bankName
      ),
    }),
}));

export default useAddBankModal;
