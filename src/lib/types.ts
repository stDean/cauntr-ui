export interface UserProps {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: "EMPLOYEE" | "ADMIN";
  phone?: string | null;
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
