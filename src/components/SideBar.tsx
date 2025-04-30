"use client";

import { Logout } from "@/actions/auth.a";
import { useAppDispatch } from "@/app/redux";
import { SET_EMAIL, SET_LOGGED_IN_USER, SET_TOKEN } from "@/state";
import {
  Archive,
  FileText,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  PanelRight,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useReduxState } from "@/hooks/useRedux";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, active }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname === "/" && href === "/dashboard") ||
    pathname.includes(href);

  return (
    <Link href={active ? href : "#"}>
      <div
        className={`cursor-pointer flex items-center justify-between  px-8 py-3 gap-3 transition-colors ${
          isActive ? "bg-[#FEEDCD] text-white" : "hover:bg-[#f3f1eb]"
        } ${!active && "opacity-25 cursor-not-allowed"}
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loggedInUser } = useReduxState();

  const logOut = async () => {
    await Logout();
    router.push("/");

    dispatch(SET_LOGGED_IN_USER(null));
    dispatch(SET_EMAIL(""));
    dispatch(SET_TOKEN(""));
  };

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
            active={loggedInUser?.companyStatus === "ACTIVE"}
          />
        )}

        <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          active={loggedInUser?.companyStatus === "ACTIVE"}
        />

        {"ADMIN" === "ADMIN" && (
          <>
            <SidebarLink
              href="/sales"
              icon={Truck}
              label="Sales History"
              active={loggedInUser?.companyStatus === "ACTIVE"}
            />

            <SidebarLink
              href="/users"
              icon={Users}
              label="Users"
              active={loggedInUser?.companyStatus === "ACTIVE"}
            />
          </>
        )}

        <SidebarLink
          href="/invoice"
          icon={FileText}
          label="Invoice"
          active={loggedInUser?.companyStatus === "ACTIVE"}
        />

        <SidebarLink href="/settings" icon={Settings} label="Settings" active />
      </div>

      <div className="mb-10 flex items-center justify-center">
        <Button
          className="cursor-pointer text-red-400 hover-text-red-700"
          onClick={logOut}
          variant={"outline_red"}
          size={"sm"}
        >
          Logout <LogOut className="size-5 ml-3" />
        </Button>
      </div>
    </div>
  );
};
