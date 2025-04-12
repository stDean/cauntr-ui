import { GetAllProducts } from "@/actions/inventory.a";
import { GetCustomers } from "@/actions/users.a";
import { AddCustomerModal } from "@/components/modals/AddCustomerModal";
import { NavBar } from "@/components/NavBar";
import { SellProductsTable } from "@/components/table/SellProductsTable";
import { cookies } from "next/headers";

export default async function SellPage() {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;
  const products = await GetAllProducts({ token, userId });
  const customers = await GetCustomers({ token, userId });

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <>
        <AddCustomerModal />
      </>
      <NavBar title="Sell Products" />

      <SellProductsTable
        data={products.success.data}
        customers={customers.success.data.customer}
      />
    </div>
  );
}
