"use client";

import { useReduxState } from "@/hooks/useRedux";
import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const path = usePathname();
  const { loggedInUser: user } = useReduxState();
  const a = path.split("/")[1].toUpperCase();

  return (
    <div className="flex justify-between items-center w-full mb-4 border-b p-4 lg:p-6">
      {/* LEFT SIDE */}
      <h1 className="lg:text-xl font-semibold">{a}</h1>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="flex justify-between items-center gap-5">
          <Link href="/settings">
            <Settings className="size-5 lg:size-6" />
          </Link>

          <p
            className="cursor-pointer"
            onClick={() => {
              console.log("Hello");
            }}
          >
            <Bell className="size-5 lg:size-6" />
          </p>

          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-2" />

          <div className="flex items-center">
            <span className="text-sm lg:text-base">
              Hello,{" "}
              <span className="font-semibold">
                {user?.firstName ? user?.firstName : "there"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
