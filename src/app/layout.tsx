import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { APP_NAME, APP_DESCRIPTION } from "@/shared/config/constants";
import { Wallet } from "lucide-react";
import { NavTabs } from "@/widgets/navigation";

// ... 나머지 코드 동일
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={inter.className}>
      <Providers>
        <div className="min-h-screen bg-background">
          <nav className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <Wallet className="mr-2 h-6 w-6" />
                <h1 className="text-xl font-bold">{APP_NAME}</h1>
              </div>
              <NavTabs />
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </Providers>
    </body>
  );
}
