import {
  GetCompanyAccount,
  GetSubHistory,
  GetUser,
  GetUsers,
} from "@/actions/settings.a";
import { AccountSettingsForm } from "@/components/form/AccountSettingsForm";
import { ProfileSettingsForm } from "@/components/form/ProfileSettingsForm";
import { TeamTable } from "@/components/table/TeamTable";
import { TabNavigation } from "@/components/TabNavigation";
import { cookies } from "next/headers";
import { BillingAndSubscriptions } from "./_component/BillingAndSubscriptions";

export const SettingsContent = async ({ tab }: { tab: string }) => {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;

  const team = await GetUsers({ token: token! });
  const companyAcct = await GetCompanyAccount({ token });
  const user = await GetUser({ token, userId });
  const subHistory = await GetSubHistory({ token });

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
      <div className="mt-4 px-4 mb-18 lg:my-4">
        {tab === "account" && (
          <AccountSettingsForm companyAcct={companyAcct.success?.data} />
        )}
        {tab === "profile" && <ProfileSettingsForm user={user.success?.data} />}
        {tab === "team" && <TeamTable data={team.success?.data} />}
        {tab === "billing" && (
          <BillingAndSubscriptions
            billingHistory={subHistory.success?.billingHistory}
            cardDetails={subHistory.success?.cardDetails}
          />
        )}
      </div>
    </div>
  );
};
