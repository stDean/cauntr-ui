// import { ShowPolicyModal } from "@/components/modals/ShowPolicyModal";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      {/* <ShowPolicyModal /> */}
      <main className="min-h-screen bg-gray-50 flex justify-center items-center">
        {children}
      </main>
    </>
  );
};

export default AuthLayout;
