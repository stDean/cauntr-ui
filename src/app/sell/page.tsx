import { GetAllProducts, GetBanks, GetCategories } from "@/actions/inventory.a";
import { GetCustomers } from "@/actions/users.a";
import { AddCustomerModal } from "@/components/modals/AddCustomerModal";
import { AddSellingPriceModal } from "@/components/modals/AddSellingPriceModal";
import { NavBar } from "@/components/NavBar";
import { SellProductsTable } from "@/components/table/SellProductsTable";
import { cookies } from "next/headers";

export default async function SellPage() {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;
  const products = await GetAllProducts({ token, userId });
  const customers = await GetCustomers({ token, userId });
  const categories = await GetCategories({ token, userId });
  const bankRes = await GetBanks({ token, userId });

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <>
        <AddCustomerModal />
        <AddSellingPriceModal />
      </>
      <NavBar title="Sell Products" />

      <SellProductsTable
        data={products.success?.data || []}
        customers={customers.success?.data?.customer || []}
        categories={categories.success?.data || []}
        banks={bankRes.success?.data?.banks || []}
      />
    </div>
  );
}
