import { GetTransactions } from "@/actions/sales-history.a";
import { Card } from "@/components/MiniCard";
import { SalesTable } from "@/components/table/SalesTable";
import { TransactionSummaryProps } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { cookies } from "next/headers";

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
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">
          {text2}
          <span className="font-normal! text-base! ml-1">items</span>
        </p>
      ),
    },
    {
      title: "Categories",
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">{text3}</p>
      ),
    },
    {
      title: "Top Selling Product",
      subText: (
        <p className="truncate text-xl mt-3 md:mt-5 font-semibold">
          {text4 || "NIL"}
        </p>
      ),
    },
  ];
};

export default async function SalesHistoryPage() {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;
  const transactions = await GetTransactions({ token, userId });
  const transactionSummary: TransactionSummaryProps | null =
    transactions.success?.transactionSummary || null;

  const cardDetails = cardData({
    title1: "Total Sales",
    title2: "Total Stock Sold",
    text1: `${formatNaira(Number(transactionSummary?.totalSales) || 0)}`,
    text2: `${transactionSummary?.totalStockSold || "0"}`,
    text3: `${transactionSummary?.categories || "0"}`,
    text4: `${transactionSummary?.topSellingProduct.name || "NIL"}`,
  });

  return (
    <div className="px-4 mb-18 lg:mb-2">
      <Card cardData={cardDetails} />
      <SalesTable data={transactions.success?.data || []} />
    </div>
  );
}
