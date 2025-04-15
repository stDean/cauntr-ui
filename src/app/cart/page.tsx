import { NavBar } from "@/components/NavBar";
import { CartContent } from "./CartContent";

export default function CartPage() {
  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <NavBar title="Cart" />

      <CartContent />
    </div>
  );
}
