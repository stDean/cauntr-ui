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
      invoiceData={invoice.success?.data.invoiceData || null}
      companyData={invoice.success?.data.companyData || null}
      billTo={invoice.success?.data.billTo || null}
      balanceDue={invoice.success?.data.balanceDue || 0}
      products={invoice.success?.data.products || []}
      payments={invoice.success?.data.payments || null}
      bankPaidTo={invoice.success?.data.bankPaidTo || null}
    />
  );
}
