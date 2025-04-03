import {
  Archive,
  FileText,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LinkTab = ({ Icon, href }: { Icon: LucideIcon; href: string }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname === "/" && href === "/dashboard") ||
    pathname.includes(href);

  return (
    <Link
      href={href}
      className={`${
        isActive ? "bg-[#FEEDCD]" : " hover:bg-[#f3f1eb]"
      }  p-3 rounded-md`}
    >
      <Icon />
    </Link>
  );
};

export const MobileTab = () => {
  return (
    <div className="lg:hidden sticky bottom-0 bg-white h-14 flex items-center justify-around border-t">
      <LinkTab href="/dashboard" Icon={LayoutDashboard} />
      <LinkTab href="/inventory" Icon={Archive} />
      <LinkTab href="/sales" Icon={Truck} />
      <LinkTab href="/users" Icon={Users} />
      <LinkTab href="/invoice" Icon={FileText} />
      <LinkTab href="/settings" Icon={Settings} />
    </div>
  );
};
