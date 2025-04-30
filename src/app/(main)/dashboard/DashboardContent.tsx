import { GetDashSummary } from "@/actions/inventory.a";
import OverviewPage from "./OverviewPage";
import { ProductsPage } from "./ProductsPage";
// import { SalesPage } from "./SalesPage";
import { TabNavigation } from "@/components/TabNavigation";
import { cookies } from "next/headers";

const DashboardContent = async ({ tab }: { tab: string }) => {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;
  const dashSummary = await GetDashSummary({ token, userId });

  const tabs = [
    { label: "overview", query: "overview" },
    { label: "products", query: "products" },
    // { label: "sales", query: "sales" },
  ];

  return (
    <div className="mb-18 lg:mb-2 space-y-4">
      <TabNavigation activeTab={tab} basePath="/dashboard" tabs={tabs} />

      <div className="mt-4 mb-18 lg:my-4">
        {tab === "overview" && (
          <OverviewPage data={dashSummary.success.data.overview} />
        )}

        {tab === "products" && (
          <ProductsPage data={dashSummary.success.data.products} />
        )}
        {/* {tab === "sales" && <SalesPage />} */}
      </div>
    </div>
  );
};

export default DashboardContent;
