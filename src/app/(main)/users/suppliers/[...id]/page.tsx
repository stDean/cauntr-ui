import { GetSupplier } from "@/actions/users.a";
import { UsersUi } from "@/components/UsersUi";
import { cookies } from "next/headers";

interface SupplierPageProps {
  params: Promise<{ id: string }>; // always a promise
}

export default async function SupplierPage({ params }: SupplierPageProps) {
  const awaitedParams = await params;
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;
  const res = await GetSupplier({ id: awaitedParams.id, token, userId });

  return (
    <UsersUi
      type="supplier"
      userData={{
        count: res.success.data.count,
        fullName: res.success.data.name,
        phoneNo: res.success.data.contact,
        address: res.success.data.address,
        email: res.success.data.email,
      }}
      tableData={res.success.data.products}
    />
  );
}
