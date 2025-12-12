import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Use Inter font (Standard for Next.js 14)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AddisLink - The Ethiopian Electronics Market",
  description: "Find laptops, phones, and accessories from verified Telegram shops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // Applied inter.className instead of geist variables
        className={`${inter.className} antialiased bg-gray-50 flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}