import { ReactNode } from "react";
import { DashboardWrapper } from "./_component/DashboardWrapper";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <>The Modals goes here!</> */}

      <DashboardWrapper>{children}</DashboardWrapper>
    </>
  );
}
