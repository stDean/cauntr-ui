import OverviewPage from "./OverviewPage";
import { ProductsPage } from "./ProductsPage";
import { SalesPage } from "./SalesPage";
import { TabNavigation } from "@/components/TabNavigation";

const DashboardContent = async ({ tab }: { tab: string }) => {

  const tabs = [
    { label: "overview", query: "overview" },
    { label: "products", query: "products" },
    { label: "sales", query: "sales" },
  ];

  return (
    <div className="mb-18 lg:mb-2 space-y-4">
      <TabNavigation activeTab={tab} basePath="/dashboard" tabs={tabs} />

      <div className="mt-4 mb-18 lg:my-4">
        {tab === "overview" && (
          <OverviewPage />
        )}

        {tab === "products" && (
         <ProductsPage />
        )}
        {tab === "sales" && <SalesPage />}
      </div>
    </div>
  );
};

export default DashboardContent;
