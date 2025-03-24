import { AuthForm } from "@/components/form/AuthForm";

export default function Login() {
  return (
    <div className="rounded-md w-fit h-fit p-6 bg-white shadow-lg">
      <AuthForm type="login" />
    </div>
  );
}
