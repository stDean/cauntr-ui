import { GetCustomers, GetDebtors, GetSuppliers } from "@/actions/users.a";
import { TabNavigation } from "@/components/TabNavigation";
import { CustomersTable } from "@/components/table/CustomersTable";
import { DebtorsTable } from "@/components/table/DebtorsTable";
import { SuppliersTable } from "@/components/table/SuppliersTable";
import { cookies } from "next/headers";

const UsersContent = async ({ tab }: { tab: string }) => {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;

  const customerRes = await GetCustomers({ token, userId });
  const supplierRes = await GetSuppliers({ token, userId });
  const debtorsRes = await GetDebtors({ token, userId });

  const tabs = [
    { label: "Suppliers", query: "suppliers" },
    { label: "Customers", query: "customers" },
    { label: "Debtors", query: "debtors" },
  ];

  return (
    <div className="mb-18 lg:mb-2 space-y-4">
      <p className="ml-5 mt-1 font-bold">Manage Users</p>
      <hr />

      <TabNavigation activeTab={tab} basePath="/users" tabs={tabs} />

      <div className="mt-4 px-4 mb-18 lg:my-4">
        {tab === "suppliers" && (
          <SuppliersTable data={supplierRes.success?.data || []} />
        )}

        {tab === "customers" && (
          <CustomersTable data={customerRes.success.data?.customer || []} />
        )}
        {tab === "debtors" && (
          <DebtorsTable data={debtorsRes.success?.data || []} />
        )}
      </div>
    </div>
  );
};

export default UsersContent;
