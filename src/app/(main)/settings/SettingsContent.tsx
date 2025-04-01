"use client";

import { AccountSettingsForm } from "@/components/form/AccountSettingsForm";
import { ProfileSettingsForm } from "@/components/form/ProfileSettingsForm";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export const SettingsContent = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("q");

  return (
    <div className="">
      {/* Tab */}
      <div className="border-b">
        <div className="my-2 px-10 flex gap-4 text-xs">
          <Link href="/settings?q=account" className="m-0">
            <div className="">
              <p className={cn({ "font-bold": (tab === "account" || tab === null) })}>Account</p>
              {(tab === "account" || tab === null) && (
                <hr className="bg-red-500 h-[3px] mt-1 -mb-3 rounded-lg" />
              )}
            </div>
          </Link>

          <Link href="/settings?q=profile" className="m-0">
            <div>
              <p className={cn({ "font-bold": tab === "profile" })}>Profile</p>
              {tab === "profile" && (
                <hr className="bg-red-500 h-[3px] mt-2 -mb-3 rounded-lg" />
              )}
            </div>
          </Link>

          <Link href="/settings?q=team" className="m-0">
            <div>
              <p className={cn({ "font-bold": tab === "team" })}>Team</p>
              {tab === "team" && (
                <hr className="bg-red-500 h-[3px] mt-2 -mb-3 rounded-lg" />
              )}
            </div>
          </Link>

          <Link href="/settings?q=billing" className="m-0">
            <div>
              <p className={cn({ "font-bold": tab === "billing" })}>
                Billing And Subscription
              </p>
              {tab === "billing" && (
                <hr className="bg-red-500 h-[3px] mt-2 -mb-3 rounded-lg" />
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="my-4 px-6">
        {(tab === "account" || tab === null) && <AccountSettingsForm />}
        {tab === "profile" && <ProfileSettingsForm />}
        {tab === "team" && <p>Team Settings</p>}
        {tab === "billing" && <p>Billing Settings</p>}
      </div>
    </div>
  );
};
