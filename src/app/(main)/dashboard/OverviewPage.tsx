"use client";

import { OverviewData, StockData } from "./data";
import { SET_EMAIL, SET_LOGGED_IN_USER, SET_TOKEN } from "@/state";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/MiniCard";
import { Logout } from "@/actions/auth.a";
import { OverviewTable } from "@/components/table/OverviewTable";
import SalesPerformanceChart from "@/app/charts/SalesPerformanceChart";
import { StockDataProps } from "@/lib/types";
import { StockDataTable } from "@/components/table/StockDataTable";
import { useAppDispatch } from "@/app/redux";
import { useRouter } from "next/navigation";

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
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold">
          {text2}
          <span className="font-normal! text-base! ml-1">items</span>
        </p>
      ),
    },
    {
      title: "Total Profit Amount",
      subText: `${text3}`,
    },
    {
      title: "Total Inventory Value",
      subText: `${text4 || "NIL"}`,
    },
  ];
};

export default function OverviewPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logOut = async () => {
    await Logout();
    router.push("/");

    dispatch(SET_LOGGED_IN_USER(null));
    dispatch(SET_EMAIL(""));
    dispatch(SET_TOKEN(""));
  };

  const cardDetails = cardData({
    title1: "Total Sales Amount",
    title2: "Total Stock Count",
    text1: "#2,800,000",
    text2: "#2,800,000",
    text3: "#2,800,000",
  });

  return (
    <>
      <div className="px-4  mb-2">
        <Card cardData={cardDetails} />
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-7 
            grid-auto-rows-auto md:grid-rows-[repeat(11,auto)] 
            gap-2.5 px-4 w-full h-fit mt-3"
      >
        {/* Bar */}
        <div
          className="col-start-1 col-end-2 md:col-start-1 md:col-end-6 
                row-auto md:row-span-4
                bg-blue-200 p-4 rounded-lg min-w-0"
        >
          <SalesPerformanceChart />
        </div>

        {/* Table1 */}
        <div
          className="col-start-1 col-end-2 md:col-start-6 md:col-end-8 
                row-auto md:row-span-6
               rounded-lg min-w-0"
        >
          <StockDataTable
            data={StockData}
            name="Low Stock (235)"
            secondColumn="Quantity Sold"
            secondData={StockData.map((data) => data.qtySold || "N/A")}
          />
        </div>

        {/* Bar1 */}
        <div
          className="col-start-1 col-end-2 md:col-start-1 md:col-end-6 
                row-auto md:row-span-7
                 p-4 rounded-lg min-w-0 h-fit"
        >
          <OverviewTable data={OverviewData} />
        </div>

        {/* Table2 */}
        <div
          className="col-start-1 col-end-2 md:col-start-6 md:col-end-8 
                row-auto md:row-span-5
                 rounded-lg min-w-0"
        >
          <StockDataTable
            data={StockData}
            name="Out of Stock (235)"
            secondColumn="Run Out Date"
            secondData={StockData.map((data) => data.runOutDate)}
          />
        </div>
      </div>

      <Button className="cursor-pointer" onClick={logOut}>
        Logout
      </Button>
    </>
  );
}
