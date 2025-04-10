import { GetCompanyAccount, GetUsers } from "@/actions/settings.a";
import { AccountSettingsForm } from "@/components/form/AccountSettingsForm";
import { ProfileSettingsForm } from "@/components/form/ProfileSettingsForm";
import { TeamTable } from "@/components/table/TeamTable";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";

const faketeam = [
  {
    id: "1",
    firstName: "First",
    lastName: "Name",
    email: "user1@email.com",
    phone: "123456",
    Role: "Admin",
    createdAt: new Date(),
  },
  {
    id: "2",
    firstName: "Second",
    lastName: "Name 2",
    email: "user2@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "3",
    firstName: "Third",
    lastName: "Name 3",
    email: "user3@email.com",
    phone: "123456",
    Role: "Admin",
    createdAt: new Date(),
  },
  {
    id: "4",
    firstName: "Fourth",
    lastName: "Name 4",
    email: "user4@email.com",
    phone: "123456",
    Role: "Admin",
    createdAt: new Date(),
  },
  {
    id: "5",
    firstName: "Fifth",
    lastName: "Name 5",
    email: "user5@email.com",
    phone: "123456",
    Role: "Admin",
    createdAt: new Date(),
  },
  {
    id: "6",
    firstName: "Sixth",
    lastName: "Name 6",
    email: "user6@email.com",
    phone: "123456",
    Role: "Admin",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
  {
    id: "7",
    firstName: "Seventh",
    lastName: "Name 7",
    email: "user7@email.com",
    phone: "123456",
    Role: "Employee",
    createdAt: new Date(),
  },
]

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
  // const cookieStore = await cookies();
  // const token = JSON.parse(cookieStore.get("token")?.value as string);
  const team = await GetUsers({ token: 'token'! });
  const companyAcct = await GetCompanyAccount({ token: 'hello' });

  const tabs = [
    { label: "Account", query: "account" },
    { label: "Profile", query: "profile" },
    { label: "Team", query: "team" },
    { label: "Billing", query: "billing" },
  ];

  const fakecompanyAcct = {
    businessName: "The Best Company",
    businessEmail: "email@email.com",
    phoneNumber: "1234567",
    category: "The Best Category",
    businessAddress: "The Best Address",
    taxID: "78901234",
    banks: []
  }

  return (
    <div className="">
      {/* Tab */}
      <TabNavigation activeTab={tab} basePath="/settings" tabs={tabs} />

      {/* Main Content */}
      <div className="my-4 px-6">
        {tab === "account" && (
          <AccountSettingsForm companyAcct={fakecompanyAcct} />
        )}
         {tab === "profile" && <ProfileSettingsForm />}
        {tab === "team" && <TeamTable data={faketeam} />}
        {tab === "billing" && <p>Billing Settings</p>}
      </div>
    </div>
  );
};