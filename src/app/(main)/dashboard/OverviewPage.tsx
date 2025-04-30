"use client";

// import { OverviewData, StockData } from "./data";
import SalesPerformanceChart from "@/components/charts/SalesPerformanceChart";
import { Card } from "@/components/MiniCard";
import { OverviewTable } from "@/components/table/OverviewTable";
import { StockDataTable } from "@/components/table/StockDataTable";
import { useReduxState } from "@/hooks/useRedux";
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
      subText: `${text1}`,
    },
    {
      title: title2,
      subText: <p className="text-xl mt-3 md:mt-5 font-semibold">{text2}</p>,
    },
    {
      title: "Total Profit Amount",
      subText: `${text3}`,
    },
    {
      title: "Total Inventory Value",
      subText: `${text4}`,
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
  const cardMonthData = data.cardData.find((i) => i.month === currentMonth);
  const { loggedInUser } = useReduxState();
  console.log(loggedInUser);

  const cardDetails = cardData({
    title1: "Total Sales Amount",
    title2: "Total Purchase Amount",
    text1: formatNaira(cardMonthData?.salesAmount || 0),
    text2: formatNaira(cardMonthData?.purchaseAmount || 0),
    text3: formatNaira(cardMonthData?.profit || 0),
    text4: formatNaira(cardMonthData?.inventoryValue || 0),
  });

  return (
    <>
      <div className="px-4  mb-2">
        <Card cardData={cardDetails} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 grid-auto-rows-auto md:grid-rows-[repeat(11,auto)] gap-2.5 px-4 w-full h-fit mt-3">
        {/* Bar */}
        <div className="col-start-1 col-end-2 md:col-start-1 md:col-end-6 row-auto md:row-span-4 bg-blue-200 p-4 rounded-lg ">
          <SalesPerformanceChart data={data.data} />
        </div>

        {/* Table1 */}
        <div
          className={cn(
            "col-start-1 col-end-2 md:col-start-6 md:col-end-8 row-auto md:row-span-6 rounded-lg border border-[#EEEEEE]"
          )}
        >
          <StockDataTable
            data={data.lowStockProducts}
            name={`Low Stock (${data.lowStockProducts.length})`}
            secondColumn="Quantity"
            secondData={data.lowStockProducts.map((data) => data.quantity || 0)}
          />
        </div>

        {/* Bar1 */}
        <div className="col-start-1 col-end-2 md:col-start-1 md:col-end-6 row-auto md:row-span-7 rounded-lg">
          <OverviewTable data={data.topSellingProduct} />
        </div>

        {/* Table2 */}
        <div
          className={cn(
            "col-start-1 col-end-2 md:col-start-6 md:col-end-8 row-auto md:row-span-5 rounded-lg border border-[#EEEEEE]"
          )}
        >
          <StockDataTable
            data={data.outOfStock}
            name={`Out of Stock (${data.outOfStock.length})`}
            secondColumn="Run Out Date"
            secondData={data.outOfStock.map((data) =>
              new Date(data.updatedAt).toLocaleDateString()
            )}
          />
        </div>
      </div>
    </>
  );
}
