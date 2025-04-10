import { ReactNode } from "react";
import { DashboardWrapper } from "./_component/DashboardWrapper";
import { AddBankModal } from "@/components/modals/AddBankModal";
import { CreateUserModal } from "@/components/modals/CreateUserModal";
import { DeleteUserModal } from "@/components/modals/DeleteUserModal";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";
import { AddProductModal } from "@/components/modals/AddProductModal";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <>
        <AddBankModal />
        <CreateUserModal />
        <DeleteUserModal />
        <ChangePasswordModal />
        <AddProductModal />
      </>

      <DashboardWrapper>{children}</DashboardWrapper>
    </>
  );
}
