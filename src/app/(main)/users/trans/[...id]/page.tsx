import { GetSingleTransaction } from "@/actions/sales-history.a";
import { cookies } from "next/headers";
import { Content } from "./Content";

interface TransPageProps {
  params: Promise<{ id: string }>; // always a promise
}

export default async function page({ params }: TransPageProps) {
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
