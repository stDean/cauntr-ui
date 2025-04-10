"use client";

import { useReduxState } from "@/hooks/useRedux";
import { Bell, ChevronRight, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const NavBar = () => {
  const searchParams = useSearchParams();
  const path = usePathname();
  const { loggedInUser: user } = useReduxState();
  const a = path.split("/")[1].toUpperCase();

  const getName = searchParams.has("name") && searchParams.get("name");

  return (
    <div className="flex justify-between items-center w-full mb-4 border-b p-4 lg:p-6">
      {/* LEFT SIDE */}
      <h1
        className={`text-sm lg:text-xl font-semibold ${
          getName && "font-normal! flex! gap-1 items-center "
        }`}
      >
        {a}{" "}
        {getName && (
          <span className="font-semibold inline-flex items-center">
            <ChevronRight className="size-4 md:size-6" /> <span>{getName}</span>
          </span>
        )}
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="flex justify-between items-center gap-5">
          <Link href="/settings">
            <Settings className="size-5 lg:size-6" />
          </Link>

          <p
            className="cursor-pointer"
            onClick={() => {
              // TODO:Make this like a simple dropdown to see all notifications
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
