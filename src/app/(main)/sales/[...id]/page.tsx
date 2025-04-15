import { cookies } from "next/headers";
import { SingleSales } from "./SingleSales";
import { GetSingleTransaction } from "@/actions/sales-history.a";

export default async function SalesPage({
  params,
}: {
  params: { id: string };
}) {
  const awaitedParams = await params;
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;

  const res = await GetSingleTransaction({
    token,
    userId,
    transactionId: awaitedParams.id,
  });

  return <SingleSales saleData={res.success.data} />;
}
