import React from "react";
import RevenueChart from "@/app/charts/RevenueChart";
import { StockData } from "./data";
import { StockDataTable } from "@/components/table/StockDataTable";

export const ProductsPage = () => {
  return (
    <div className="px-4 flex flex-col lg:flex-row gap-4">
      <div className="space-y-4 flex-1">
        <div className="rounded-lg border">
          <RevenueChart />
        </div>

        <div className="rounded-lg border">
          <RevenueChart />
        </div>
      </div>

      <div className="min-w-[350px]">
        <StockDataTable
          data={StockData}
          name="Top Selling Products"
          secondColumn="Quantity Sold"
          secondData={StockData.map((data) => data.qtySold)}
        />
      </div>
    </div>
  );
};
