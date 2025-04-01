import { ReactNode } from "react";
import { DashboardWrapper } from "./_component/DashboardWrapper";
import { AddBankModal } from "@/components/modals/AddBankModal";
import { CreateUserModal } from "@/components/modals/CreateUserModal";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <>
        <AddBankModal />
        <CreateUserModal  />
      </>

      <DashboardWrapper>{children}</DashboardWrapper>
    </>
  );
}
