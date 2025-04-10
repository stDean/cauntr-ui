"use client";

import { MobileTab } from "@/components/MobileTab";
import { NavBar } from "@/components/NavBar";
import { SideBar } from "@/components/SideBar";
import { ReactNode } from "react";

const DashBoardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 text-gray-900 w-full min-h-screen">
      <SideBar />
      <main className="flex flex-col w-full h-screen bg-gray-50">
        <NavBar />

        <div className="overflow-y-scroll scrollbar-thin">{children}</div>
      </main>
      <MobileTab />
    </div>
  );
};

export function DashboardWrapper({ children }: { children: ReactNode }) {
  return <DashBoardLayout>{children}</DashBoardLayout>;
}
