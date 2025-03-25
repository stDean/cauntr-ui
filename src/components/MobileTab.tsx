import {
  Archive,
  FileText,
  LayoutDashboard,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";

export const MobileTab = () => {
  return (
    <div className="md:hidden sticky bottom-0 bg-white h-14 flex items-center justify-around border-t ">
      <Link href="/dashboard">
        <LayoutDashboard />
      </Link>

      <Link href="/dashboard">
        <Archive />
      </Link>

      <Link href="/dashboard">
        <Truck />
      </Link>

      <Link href="/dashboard">
        <Users />
      </Link>

      <Link href="/dashboard">
        <FileText />
      </Link>

      <Link href="/dashboard">
        <Settings />
      </Link>
    </div>
  );
};
