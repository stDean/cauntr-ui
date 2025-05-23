export interface UserProps {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: "EMPLOYEE" | "ADMIN";
  phone?: string | null;
  companyStatus: string;
}

export interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export interface TeamTableProps {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: Date;
}

export interface BillingHistoryProps {
  planName: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: "Pending" | "Awaiting Payment" | "Successful" | "Canceled" | "Failed";
}

export interface CardDetailsProps {
  last4: string;
  card_type: string;
  exp_month: number;
  exp_year: number;
  company: { company_email: string; subscriptionStatus: string };
}

export interface InventoryProps {
  productName: string;
  productType: string;
  stockCount: number;
  brand: string;
  inventoryValue: number;
}

export interface ProductType {
  productName: string;
  brand: string;
  type: string;
  quantity: number;
  sellingPrice: string;
  sku: string;
  serialNo: string;
}

export interface SalesType {
  email: string;
  employee: string;
  itemCount: number;
  salesType: string;
  transactionDate: Date;
  transactionId: string;
  shortId: string;
}

export interface PaymentHistoryType {
  date: string;
  amount: number;
  modeOfPay: string;
  balanceOwed: string;
  balancePaid: string;
  amountPaid: string;
}

export interface SellProductProps {
  id: string;
  productName: string;
  qty: number;
  price: string;
  productType: string;
  brand: string;
  sn: string;
  costPrice: string;
  sku: string;
}

export interface CustomerProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  transactionCount: number;
  address?: string;
}

export interface GroupedCategory {
  productType: string;
  brands: string[];
}

export interface SuppliersProps {
  id: string;
  name: string;
  email?: string;
  contact: string;
  supplyCount: number;
  dateAdded: Date;
  productCount: number;
}

export interface CustomersProps {
  id: string;
  name: string;
  email?: string;
  phone: string;
  transactionCount: number;
  dateAdded: Date;
}

export interface DebtorsProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  transactionCount: number;
  dateAdded: Date;
}

export interface TransactionSummaryProps {
  totalSales: number;
  categories: number;
  totalStockSold: number;
  topSellingProduct: { name: string; quantity: number };
}

export interface SingleSalesProps {
  soldBy: { name: string; type: string };
  customer: { name?: string; email?: string; phone?: string };
  salesSummary: { productName: string; qty: number; price: number }[];
  paymentHistory: {
    date: Date;
    amount: string;
    modeOfPay: string;
    balanceOwed: string;
    amountPaid: string;
  }[];
  totalPay: number;
  invoiceNo: string;
}

export interface SearchableDropdownProps<T> {
  items: T[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSelect: (item: T) => void;
  onAddNew: () => void;
  placeholder: string;
  type: "customer" | "bank";
  renderItem: (item: T) => React.ReactNode;
  searchKey: keyof T;
}

export interface CartItemProps {
  item: any;
  onDelete: () => void;
  onAdjustQty: (type: "add" | "remove") => void;
}

export interface OverviewProps {
  productName: string;
  soldQty: string;
  remainingQty: string;
  soldAmount: string;
}

export interface SupplierTable {
  productName: string;
  createdAt: Date;
  pricePerUnit: string;
  status: string;
  serialNo: string;
}

// export interface CustomerTable {
//   productName: string;
//   serialNo: string;
//   sku: string;
//   quantity: 3;
//   paymentMethod: string;
//   purchaseDate: Date;
//   totalPrice: string;
//   pricePerUnit: string;
//   transactionType: string;
//   paidPrice: string;
//   balanceOwed: string;
//   itemId: string;
// }

export interface CustomerTransactionsProps {
  transId: string;
  soldBy: string;
  itemCount: number;
  dateSold: Date;
  id: string;
}

export interface DebtorTable {}

export interface InvoiceColumnProps {
  invoiceNo: string;
  customerName: string;
  amount: number;
  status: string;
  planId: string;
  paymentId: string;
  email: string;
}

export interface SingleInvoiceProps {
  invoiceData: {
    invoiceNo: string;
    invoiceDate: Date;
    paymentDate: Date;
    status: string;
  };
  companyData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  billTo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  balanceDue: {
    amount: string;
    dueDate: string;
  };
  products: {
    name: string;
    qty: number;
    ppu: string;
    total: number;
    totalPrice: string;
  }[];
  payments: {
    subTotal: string;
    totalPaid: string;
  };
  bankPaidTo: {
    bankName: string;
    acctNo: string;
    acctName: string;
  };
}
