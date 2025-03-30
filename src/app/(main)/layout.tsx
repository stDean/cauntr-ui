import { ReactNode } from "react";
import { DashboardWrapper } from "./_component/DashboardWrapper";
import { AddBankModal } from "@/components/modals/AddBankModal";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <>
        <AddBankModal />
      </>

      <DashboardWrapper>{children}</DashboardWrapper>
    </>
  );
}
