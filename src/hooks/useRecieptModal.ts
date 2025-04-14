import { UserProps } from "@/lib/types";
import { create } from "zustand";

type TypeProp = "create" | "edit";
// type UserProps = z.infer<typeof createUserSchema>;

interface CreateRecieptMoldalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRecieptModal = create<CreateRecieptMoldalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useRecieptModal;
