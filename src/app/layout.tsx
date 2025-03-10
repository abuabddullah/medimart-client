import { Toaster } from "@/components/ui/toaster";
import Footer from "@/src/components/shared/footer";
import Header from "@/src/components/shared/header";
import { ReduxProvider } from "@/src/lib/redux/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediMart - Your Online Pharmacy",
  description:
    "Buy medicines online with prescription verification and secure delivery",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
