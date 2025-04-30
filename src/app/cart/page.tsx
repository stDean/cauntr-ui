import { GetCustomers } from "@/actions/users.a";
import { NavBar } from "@/components/NavBar";
import { cookies } from "next/headers";
import { CartContent } from "./CartContent";
import { GetBanks } from "@/actions/inventory.a";

export default async function CartPage() {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;
  const customers = await GetCustomers({ token, userId });
  const bankRes = await GetBanks({ token, userId });

  return (
    <div className="bg-[#f8f8f8] min-h-screen overflow-hidden">
      <NavBar title="Cart" />

      <CartContent
        customers={customers.success?.data.customer || []}
        banks={bankRes.success?.data.banks || []}
      />
    </div>
  );
}
