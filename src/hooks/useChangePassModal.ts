import { UserProps } from "@/lib/types";
import { create } from "zustand";

interface ChangePasswordModalProps {
  isOpen: boolean;
  data: { password: string; cfPassword: string } | null;
  password: string;
  error: string;
  onClose: (data: { password: string; cfPassword: string }) => void;
  onOpen: () => void;
}

const useChangePasswordModal = create<ChangePasswordModalProps>((set) => ({
  isOpen: false,
  data: null,
  password: "",
  error: "",
  onClose: (data: { password: string; cfPassword: string }) => {
    if (!data.password || !data.cfPassword) {
      set({
        isOpen: false,
        password: "",
        error: "",
      });
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;
    const isValidPassword = passwordRegex.test(data.password);
    const passwordsMatch = data.password === data.cfPassword;
    const isLongEnough = data.password.length >= 8;

    set({
      isOpen: false,
      password: isValidPassword && passwordsMatch ? data.password : "",
      error: !isValidPassword
        ? "Password must have at least one capital letter, one number, and one special character."
        : !passwordsMatch
        ? "Passwords do not match."
        : !isLongEnough
        ? "Password must be at least 8 characters long"
        : "",
    });
  },
  onOpen: () =>
    set({
      isOpen: true,
      password: "",
      error: "",
      data: { password: "", cfPassword: "" },
    }),
}));

export default useChangePasswordModal;
