import { GetDebtor } from "@/actions/users.a";
import { UsersUi } from "@/components/UsersUi";
import { cookies } from "next/headers";

interface DebtorProps {
  params: Promise<{ id: string }>; // always a promise
}

export default async function DebtorPage({ params }: DebtorProps) {
  const awaitedParams = await params;
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;
  const res = await GetDebtor({ id: awaitedParams.id, token, userId });

  return (
    <UsersUi
      type="debtor"
      userData={{
        count: res.success.data.buyCount,
        fullName: res.success.data.customerData.name,
        phoneNo: res.success.data.customerData.phone,
        address: res.success.data.customerData.address,
        email: res.success.data.customerData.email,
      }}
      tableData={res.success.data.trans}
    />
  );
}
