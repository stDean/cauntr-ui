import { GetCompanyAccount, GetUsers } from "@/actions/settings.a";
import { AccountSettingsForm } from "@/components/form/AccountSettingsForm";
import { ProfileSettingsForm } from "@/components/form/ProfileSettingsForm";
import { TeamTable } from "@/components/table/TeamTable";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";

const TabNavigation = ({
  activeTab,
  tabs,
  basePath,
}: {
  activeTab: string;
  tabs: { label: string; query: string }[];
  basePath: string;
}) => {
  return (
    <div className="border-b">
      <div className="my-2 px-10 flex gap-4 text-xs">
        {tabs.map(({ label, query }) => (
          <Link key={query} href={`${basePath}?q=${query}`} className="m-0">
            <div>
              <p className={cn({ "font-bold": activeTab === query })}>
                {label}
              </p>
              {activeTab === query && (
                <hr className="bg-red-500 h-[3px] mt-1 -mb-3 rounded-lg" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const SettingsContent = async ({ tab }: { tab: string }) => {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const team = await GetUsers({ token: token! });
  const companyAcct = await GetCompanyAccount({ token });

  const tabs = [
    { label: "Account", query: "account" },
    { label: "Profile", query: "profile" },
    { label: "Team", query: "team" },
    { label: "Billing", query: "billing" },
  ];

  return (
    <div className="">
      {/* Tab */}
      <TabNavigation activeTab={tab} basePath="/settings" tabs={tabs} />

      {/* Main Content */}
      <div className="my-4 px-6">
        {tab === "account" && (
          <AccountSettingsForm companyAcct={companyAcct.success.data} />
        )}
         {tab === "profile" && <ProfileSettingsForm />}
        {tab === "team" && <TeamTable data={team.success.data} />}
        {tab === "billing" && <p>Billing Settings</p>}
      </div>
    </div>
  );
};