import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./redux";

// const satoshiFont = localFont({
//   src: "/fonts/Satoshi-Black.tff",
//   variable: "--font-satoshi",
// });

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Cauntr - Inventory",
  description: "Cauntr inventory app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("scroll-smooth! overflow-hidden", inter.className)}
      >
        <StoreProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </StoreProvider>
      </body>
    </html>
  );
}
