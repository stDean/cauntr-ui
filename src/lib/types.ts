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
  Role: string;
  createdAt: Date;
}
