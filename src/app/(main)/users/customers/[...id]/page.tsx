import { GetCustomer } from "@/actions/users.a";
import { UsersUi } from "@/components/UsersUi";
import { cookies } from "next/headers";
import React from "react";

export default async function CustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const awaitedParams = await params;
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;
  const res = await GetCustomer({ id: awaitedParams.id, token, userId });

  return (
    <UsersUi
      type="customer"
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
