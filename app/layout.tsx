"use client";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import Header from "@/_Components/Header";
import Footer from "@/_Components/Footer";
import { Toaster } from "sonner";

import { usePathname } from "next/navigation";
import WhatsappBtn from "@/_Components/Whatsapp";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  // ✅ Vérifie si on est dans dashboard
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="fr" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-poppins">

        <Toaster richColors position="top-right" />

        {/* CACHE HEADER */}
        {!isDashboard && <Header />}

        <main className="flex-1">
          {children}
        </main>

        {/* CACHE FOOTER */}
        {!isDashboard && <Footer />}

      </body>
    </html>
  );
}
