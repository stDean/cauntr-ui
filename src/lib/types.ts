export interface UserProps {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  phone: string | null;
  Company: {
    companyId: string;
    name: string;
    email: string;
    status: string;
  };
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
