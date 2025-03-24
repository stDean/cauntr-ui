import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-4">
      <p>This is a makeshift landing page</p>
      <Button asChild>
        <Link href="/signup" className="cursor-pointer">Get Started</Link>
      </Button>
    </div>
  );
}
