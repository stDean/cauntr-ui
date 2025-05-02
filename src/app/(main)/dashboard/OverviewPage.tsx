"use client";

// import { OverviewData, StockData } from "./data";
import SalesPerformanceChart from "@/components/charts/SalesPerformanceChart";
import { Card } from "@/components/MiniCard";
import { OverviewTable } from "@/components/table/OverviewTable";
import { StockDataTable } from "@/components/table/StockDataTable";
import { cn, formatNaira } from "@/lib/utils";

export const cardData = ({
  text1,
  text2,
  text3,
  text4,
  title1,
  title2,
}: {
  text1: string;
  text2: string;
  text3: string;
  text4?: string;
  title1: string;
  title2: string;
}): any[] => {
  return [
    {
      title: title1,
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">{text1}</p>
      ),
    },
    {
      title: title2,
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">{text2}</p>
      ),
    },
    {
      title: "Total Profit Amount",
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">{text3}</p>
      ),
    },
    {
      title: "Total Inventory Value",
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">{text4}</p>
      ),
    },
  ];
};

interface OverviewProps {
  cardData: {
    month: string;
    salesAmount: number;
    purchaseAmount: number;
    profit: number;
    inventoryValue: number;
  }[];
  lowStockProducts: {
    productName: string;
    quantity: number;
  }[];
  outOfStock: {
    productName: string;
    updatedAt: Date;
  }[];
  topSellingProduct: {
    productName: string;
    soldQty: string;
    remainingQty: string;
    soldAmount: string;
  }[];
  data: {
    month: string;
    sales: number;
    purchases: number;
  }[];
}

export default function OverviewPage({ data }: { data: OverviewProps }) {
  const currentMonth = new Date().toLocaleString("default", { month: "short" });
  const cardMonthData = data
    ? data.cardData.find((i) => i.month === currentMonth)
    : null;

  const cardDetails = cardData({
    title1: "Total Sales Amount",
    title2: "Total Purchase Amount",
    text1: formatNaira(cardMonthData ? cardMonthData?.salesAmount : 0),
    text2: formatNaira(cardMonthData ? cardMonthData?.purchaseAmount : 0),
    text3: formatNaira(cardMonthData ? cardMonthData?.profit : 0),
    text4: formatNaira(cardMonthData ? cardMonthData?.inventoryValue : 0),
  });

  return (
    <>
      <div className="px-4  mb-2">
        <Card cardData={cardDetails} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 grid-auto-rows-auto md:grid-rows-[repeat(11,auto)] gap-3 px-4 w-full h-fit mt-3">
        {/* Bar */}
        <div className="col-start-1 col-end-2 md:col-start-1 md:col-end-6 row-auto md:row-span-4 p-4 border rounded-lg ">
          <p className="md:text-xl">Sales Performance</p>
          <SalesPerformanceChart data={data ? data.data : []} />

          <div className="w-full flex justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="h-2 w-2 rounded-full bg-[#766FFB]" />
              <p className="text-xs">Sales</p>
            </div>

            <div className="flex items-center gap-2">
              <p className="h-2 w-2 rounded-full bg-[#FDD487]" />
              <p className="text-xs">Purchases</p>
            </div>
          </div>
        </div>

        {/* Table1 */}
        <div
          className={cn(
            "col-start-1 col-end-2 md:col-start-6 md:col-end-8 row-auto md:row-span-6 rounded-lg border border-[#EEEEEE] overflow-y-scroll"
          )}
        >
          <StockDataTable
            data={data ? data.lowStockProducts : []}
            name={`Low Stock (${data ? data.lowStockProducts.length : "0"})`}
            secondColumn="Quantity"
            secondData={
              data ? data.lowStockProducts.map((data) => data.quantity || 0) : 0
            }
          />
        </div>

        {/* Bar1 */}
        <div className="col-start-1 col-end-2 md:col-start-1 md:col-end-6 row-auto md:row-span-7 rounded-lg">
          <OverviewTable data={data ? data.topSellingProduct : []} />
        </div>

        {/* Table2 */}
        <div
          className={cn(
            "col-start-1 col-end-2 md:col-start-6 md:col-end-8 row-auto md:row-span-5 rounded-lg border border-[#EEEEEE] overflow-y-scroll"
          )}
        >
          <StockDataTable
            data={data ? data.outOfStock : []}
            name={`Out of Stock (${data ? data.outOfStock.length : "0"})`}
            secondColumn="Run Out Date"
            secondData={
              data
                ? data.outOfStock.map((data) =>
                    new Date(data.updatedAt).toLocaleDateString()
                  )
                : ""
            }
          />
        </div>
      </div>
    </>
  );
}
