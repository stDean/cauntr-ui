import RevenueChart from "@/components/charts/RevenueChart";
// import { StockData } from "./data";
// import { StockDataTable } from "@/components/table/StockDataTable";

interface ProductProps {
  topRevenue: {
    product: string;
    revenue: number;
    // unitsSold: number;
  }[];
  topProfit: {
    product: string;
    profit: number;
    // margin: "33.3%";
  }[];
}

export const ProductsPage = ({ data }: { data: ProductProps }) => {
  return (
    <div className="px-4 flex flex-col lg:flex-row gap-4">
      <div className="space-y-6 flex-1">
        <div className="rounded-lg border">
          <RevenueChart data={data.topRevenue} />
        </div>

        <div className="rounded-lg border">
          <RevenueChart
            data={data.topProfit.map((p) => ({
              product: p.product,
              revenue: p.profit,
            }))}
          />
        </div>
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
