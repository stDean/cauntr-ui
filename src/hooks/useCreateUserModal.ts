import { UserProps } from "@/lib/types";
import { create } from "zustand";

type TypeProp = "create" | "edit";
// type UserProps = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  type: TypeProp;
  user: UserProps | null;
  onOpen: (type: TypeProp, user: UserProps | null) => void;
  onClose: () => void;
}

const useCreateUserModal = create<CreateUserModalProps>((set) => ({
  isOpen: false,
  user: null,
  type: "create" as TypeProp,
  onOpen: (type: TypeProp, user: UserProps | null) =>
    set({ isOpen: true, type, user }),
  onClose: () => set({ isOpen: false, type: "create", user: null }),
}));

export default useCreateUserModal;
