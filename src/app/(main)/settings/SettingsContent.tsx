"use client";

import { GetUsers } from "@/actions/settings.a";
import { AccountSettingsForm } from "@/components/form/AccountSettingsForm";
import { TeamTable } from "@/components/table/TeamTable";
import { useReduxState } from "@/hooks/useRedux";
import { TeamTableProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SettingsContent = () => {
  const { token } = useReduxState();
  const [teamData, setTeamData] = useState<TeamTableProps[]>([]);
  const searchParams = useSearchParams();
  const tab = searchParams.get("q");

  const getTeamData = async () => {
    const res = await GetUsers({ token });
    setTeamData(res.success.data);
  };

  useEffect(() => {
    getTeamData();
  }, []);

  console.log({ teamData });

  return (
    <div className="">
      {/* Tab */}
      <div className="border-b">
        <div className="my-2 px-10 flex gap-4 text-xs">
          <Link href="/settings?q=account" className="m-0">
            <div className="">
              <p className={cn({ "font-bold": tab === "account" })}>Account</p>
              {tab === "account" && (
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
        {tab === "account" && <AccountSettingsForm />}
        {tab === "profile" && <p>Profile Settings</p>}
        {tab === "team" && <TeamTable data={teamData} />}
        {tab === "billing" && <p>Billing Settings</p>}
      </div>
    </div>
  );
};
