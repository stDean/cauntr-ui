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
