import { GetAllProducts } from "@/actions/inventory.a";
import { GetInvoices, GetInvoiceSummary } from "@/actions/invoice.a";
import { Card } from "@/components/MiniCard";
import { InvoiceTable } from "@/components/table/InvoiceTable";
import { formatNaira } from "@/lib/utils";
import { cookies } from "next/headers";

const cardData = ({
  text1,
  text2,
  text3,
  text4,
}: {
  text1: string;
  text2: string;
  text3: string;
  text4?: string;
}): any[] => {
  return [
    {
      title: "Clients Served",
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">{text1}</p>
      ),
    },
    {
      title: "Invoices Generated",
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">{text2}</p>
      ),
    },
    {
      title: "Invoiced Amount",
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">{text3}</p>
      ),
    },
    {
      title: "Paid",
      subText: (
        <p className="text-xl mt-3 md:mt-5 font-semibold truncate">
          {text4 || "NIL"}
        </p>
      ),
    },
  ];
};

export default async function InvoicePage() {
  const cookieStore = await cookies();
  const token = JSON.parse(cookieStore.get("token")?.value as string);
  const userId = cookieStore.get("userId")?.value as string;

  const invoicesRes = await GetInvoices({ token, userId });
  const summary = await GetInvoiceSummary({ token, userId });
  const products = await GetAllProducts({ token, userId });

  const cardDetails = cardData({
    text1: String(summary.success?.returnedData.clientServed || 0),
    text2: String(summary.success?.returnedData.invoiceGenerated || 0),
    text3: formatNaira(summary.success?.returnedData.invoiceAmount || 0),
    text4: formatNaira(summary.success?.returnedData.invoicePaid || 0),
  });

  return (
    <div className="px-4 mb-18 lg:mb-2 space-y-4">
      <Card cardData={cardDetails} />

      <InvoiceTable
        data={invoicesRes.success?.data || []}
        products={products.success?.data || []}
      />
    </div>
  );
}
