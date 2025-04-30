import OrdersChart from "@/components/charts/OrdersChart";
import RevenueProfitChart from "@/components/charts/RevenueProfitChart";

export const SalesPage = () => {
  return (
    <div className="px-4 flex flex-col gap-4 md:flex-row">
      <div className="flex-1 space-y-3">
        <RevenueProfitChart />
        <OrdersChart />
      </div>

      {/* <div className="min-w-[350px]">
        <StockDataTable
          data={StockData}
          name="Top Selling Products"
          secondColumn="Quantity Sold"
          secondData={StockData.map((data) => data.qtySold)}
        />
      </div> */}
    </div>
  );
};
