"use client";

import { Logout } from "@/actions/auth.a";
import { useAppDispatch } from "@/app/redux";
import { useReduxState } from "@/hooks/useRedux";
import { SET_EMAIL, SET_LOGGED_IN_USER, SET_TOKEN } from "@/state";
import {
  Archive,
  FileText,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LinkTab = ({
  Icon,
  href,
  active,
}: {
  Icon: LucideIcon;
  href: string;
  active?: boolean;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname === "/" && href === "/dashboard") ||
    pathname.includes(href);

  return (
    <Link
      href={active ? href : "#"}
      className={`${isActive ? "bg-[#FEEDCD]" : " hover:bg-[#f3f1eb]"} ${
        !active && "opacity-20 cursor-not-allowed"
      }  p-3 rounded-md`}
    >
      <Icon />
    </Link>
  );
};

export const MobileTab = () => {
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
    <div className="lg:hidden sticky bottom-0 bg-white h-14 flex items-center justify-around border-t">
      <LinkTab
        href="/dashboard"
        Icon={LayoutDashboard}
        active={loggedInUser?.companyStatus === "ACTIVE"}
      />
      <LinkTab
        href="/inventory"
        Icon={Archive}
        active={loggedInUser?.companyStatus === "ACTIVE"}
      />
      <LinkTab
        href="/sales"
        Icon={Truck}
        active={loggedInUser?.companyStatus === "ACTIVE"}
      />
      <LinkTab
        href="/users"
        Icon={Users}
        active={loggedInUser?.companyStatus === "ACTIVE"}
      />
      <LinkTab
        href="/invoice"
        Icon={FileText}
        active={loggedInUser?.companyStatus === "ACTIVE"}
      />
      <LinkTab href="/settings" Icon={Settings} active />
      <LogOut
        className="cursor-pointer text-red-300 hover:text-red-500"
        onClick={logOut}
      />
    </div>
  );
};
