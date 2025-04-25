import { GetCompanyAccount } from "@/actions/settings.a";
import { CreateInvoiceContent } from "./CreateInvoiceContent";
import { cookies } from "next/headers";
import { GetCustomers } from "@/actions/users.a";
import { GetAllProducts, GetBanks } from "@/actions/inventory.a";

export default async function InvoiceCreatePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value as string;
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const companyAcct = await GetCompanyAccount({ token });
  const customers = await GetCustomers({ token, userId });
  const products = await GetAllProducts({ token, userId });
  const bankRes = await GetBanks({ token, userId });

  return (
    <CreateInvoiceContent
      companyAcct={companyAcct.success.data}
      customers={customers.success.data.customer}
      data={products.success.data}
      banks={bankRes.success.data.banks}
    />
  );
}
