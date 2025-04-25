import { GetInvoice } from "@/actions/invoice.a";
import { cookies } from "next/headers";
import { InvoiceContent } from "./InvoiceContent";

export default async function page({
  params,
}: {
  params: { invoiceNo: string };
}) {
  const awaitedParams = await params;
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;

  const invoice = await GetInvoice({
    token,
    userId,
    invoiceNo: awaitedParams.invoiceNo,
  });

  return (
    <InvoiceContent
      invoiceData={invoice.success.data.invoiceData}
      companyData={invoice.success.data.companyData}
      billTo={invoice.success.data.billTo}
      balanceDue={invoice.success.data.balanceDue}
      products={invoice.success.data.products}
      payments={invoice.success.data.payments}
      bankPaidTo={invoice.success.data.bankPaidTo}
    />
  );
}
