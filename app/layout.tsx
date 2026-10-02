"use client";

import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

import Header from "@/_Components/Header";
import Footer from "@/_Components/Footer";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html
      lang="fr"
      className={`${poppins.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-poppins">
        <Toaster richColors position="top-right" />

        {!isDashboard && <Header />}

        <main className="flex-1">{children}</main>

        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}