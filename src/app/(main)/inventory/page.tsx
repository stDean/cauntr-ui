import {
  GetInventoryItemsByType,
  GetInventoryStats,
} from "@/actions/inventory.a";
import { GetSuppliers } from "@/actions/users.a";
import { Card } from "@/components/MiniCard";
import { InventoryTable } from "@/components/table/InventoryTable";
import { cookies } from "next/headers";

const cardData = ({
  text1,
  text2,
  text3,
}: {
  text1: string;
  text2: string;
  text3: string;
}): any[] => {
  return [
    {
      title: "Inventory Value",
      subText: `${text1}`,
    },
    {
      title: "Total Stock Count",
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold">
          {text2}
          <span className="font-normal! text-base! ml-1">items</span>
        </p>
      ),
    },
    {
      title: "Categories",
      subText: `${text3}`,
    },
    {
      title: "Top Selling Product",
      subText: "MacBook Pro",
    },
  ];
};

export default async function InventoryPage() {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;

  const res = await GetInventoryItemsByType({ token });
  const statsRes = await GetInventoryStats({ token });
  const suppliersRes = await GetSuppliers({ token, userId });

  const cardDetails = cardData({
    text1: statsRes.success.data.totalSellingPrice,
    text2: statsRes.success.data.totalStockQuantity,
    text3: statsRes.success.data.categories,
  });

  return (
    <div className="px-4 mb-18 lg:my-4">
      <Card cardData={cardDetails} />

      <InventoryTable
        data={res.success.data}
        suppliers={suppliersRes.success.data}
      />
    </div>
  );
}
