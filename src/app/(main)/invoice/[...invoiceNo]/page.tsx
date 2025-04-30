import { GetInvoice } from "@/actions/invoice.a";
import { cookies } from "next/headers";
import { InvoiceContent } from "./InvoiceContent";

interface SingleInvoiceProps {
  params: Promise<{ invoiceNo: string }>; // always a promise
}

export default async function SingleInvoicePage({
  params,
}: SingleInvoiceProps) {
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
