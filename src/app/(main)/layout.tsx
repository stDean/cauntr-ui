import { AddBankModal } from "@/components/modals/AddBankModal";
import { AddCustomerModal } from "@/components/modals/AddCustomerModal";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";
import { CreateUserModal } from "@/components/modals/CreateUserModal";
import { DeleteUserModal } from "@/components/modals/DeleteUserModal";
import { ReceiptModal } from "@/components/modals/ReceiptModal";
import { ReactNode } from "react";
import { DashboardWrapper } from "./_component/DashboardWrapper";
import { PayBalanceModal } from "@/components/modals/PayBalanceModal";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <>
        <AddBankModal />
        <CreateUserModal />
        <DeleteUserModal />
        <ChangePasswordModal />
        <AddProductModal />
        <ReceiptModal />
        <AddCustomerModal />
        <PayBalanceModal />
      </>

      <DashboardWrapper>{children}</DashboardWrapper>
    </>
  );
}
