import {
  GetInventoryItemsByType,
  GetInventoryStats,
} from "@/actions/inventory.a";
import { GetSuppliers } from "@/actions/users.a";
import { Card } from "@/components/MiniCard";
import { InventoryTable } from "@/components/table/InventoryTable";
import { cookies } from "next/headers";
import { cardData } from "../sales/page";
import { formatNaira } from "@/lib/utils";

export default async function InventoryPage() {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;

  const res = await GetInventoryItemsByType({ token, userId });
  const statsRes = await GetInventoryStats({ token, userId });
  const suppliersRes = await GetSuppliers({ token, userId });

  const cardDetails = cardData({
    title1: "Inventory Value",
    title2: "Total Stock Count",
    text1: formatNaira(Number(statsRes.success?.data?.totalSellingPrice ?? 0)),
    text2: statsRes.success?.data?.totalStockQuantity ?? 0,
    text3: statsRes.success?.data?.categories ?? 0,
    text4: `${statsRes.success?.data?.topSellingProduct.name || "NIL"}`,
  });

  return (
    <div className="px-4 mb-18 lg:my-2">
      <Card cardData={cardDetails} />

      <InventoryTable
        data={res.success?.data || []}
        suppliers={suppliersRes.success?.data || []}
      />
    </div>
  );
}
