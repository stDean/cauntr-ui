"use client";

import {
  Archive,
  FileText,
  LayoutDashboard,
  LucideIcon,
  PanelRight,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname === "/" && href === "/dashboard") ||
    pathname.includes(href);

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center justify-between  px-8 py-3 gap-3 transition-colors ${
          isActive ? "bg-[#FEEDCD] text-white" : "hover:bg-[#f3f1eb]"
        }
      }`}
      >
        <span className={` font-medium text-xs lg:text-sm text-gray-700`}>
          {label}
        </span>

        <Icon className="w-3 h-3 lg:h-4 lg:w-4 !text-gray-700" />
      </div>
    </Link>
  );
};

export const SideBar = () => {
  return (
    <div className="lg:flex flex-col w-64 bg-white overflow-hidden max-h-screen shadow-md z-40 hidden border-r">
      {/* TOP LOGO */}
      <div className={`flex gap-3 justify-between items-center pt-2 px-5`}>
        <img src="/logo.png" alt="logo" className="w-20 h-10 lg:w-28 lg:h-16" />

        <PanelRight className="text-gray-500 size-5 lg:size-6" />
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-6">
        {"ADMIN" === "ADMIN" && (
          <SidebarLink
            href="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
          />
        )}

        <SidebarLink href="/inventory" icon={Archive} label="Inventory" />

        {"ADMIN" === "ADMIN" && (
          <>
            <SidebarLink href="/sales" icon={Truck} label="Sales History" />

            <SidebarLink href="/users" icon={Users} label="Users" />
          </>
        )}

        <SidebarLink href="/invoice" icon={FileText} label="Invoice" />

        <SidebarLink href="/settings" icon={Settings} label="Settings" />
      </div>
    </div>
  );
};
