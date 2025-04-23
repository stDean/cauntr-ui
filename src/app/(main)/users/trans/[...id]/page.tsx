import { Button } from "@/components/ui/button";
import { Content } from "./Content";
import { cookies } from "next/headers";
import { GetSingleTransaction } from "@/actions/sales-history.a";

export default async function page({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;
  const res = await GetSingleTransaction({
    token,
    userId,
    transactionId: awaitedParams.id,
  });

  return <Content saleData={res.success.data} itemId={awaitedParams.id} />;
}
