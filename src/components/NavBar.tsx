"use client";

import { useReduxState } from "@/hooks/useRedux";
import { cn } from "@/lib/utils";
import { Bell, ChevronRight, Settings, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const NavBar = ({ title }: { title?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();
  const { loggedInUser: user, cartItems } = useReduxState();
  const a = path.split("/")[1].toUpperCase();

  const getName = searchParams.has("name") && searchParams.get("name");

  return (
    <div className="flex justify-between items-center w-full mb-2 border-b p-4 bg-white">
      {/* LEFT SIDE */}
      <h1
        className={`text-sm lg:text-xl font-semibold ${
          getName && "font-normal! flex! gap-1 items-center "
        }`}
      >
        {title ? title : a}
        {/* {a}{" "} */}
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

          <div
            className="cursor-pointer md:hidden relative"
            onClick={() => {
              // TODO:Make this like a simple dropdown to see all notifications
              console.log("Hello");
            }}
          >
            <p
              className={cn(
                "absolute text-[10px] left-[14px] top-2 font-bold",
                {
                  "text-green-500": cartItems && cartItems.length > 0,
                }
              )}
              onClick={() => {
                router.push("/cart");
              }}
            >
              {cartItems && cartItems.length}
            </p>
            <ShoppingCart
              className={cn("size-8", {
                "text-green-500": cartItems && cartItems.length > 0,
              })}
            />
          </div>

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
