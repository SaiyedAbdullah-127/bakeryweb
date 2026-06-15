import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsappButton from "@/components/layout/Whatsappbutton";
import { ToastProvider } from "@/lib/contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Sweet Boutique | Artisanal Heritage Confectionery",
  description: "Freshly prepared artisan sweets and daily bakes using traditional recipes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script strategy="beforeInteractive" id="fix-bis">
          {`document.querySelectorAll("[bis_skin_checked]").forEach(e=>e.removeAttribute("bis_skin_checked"))`}
        </Script>
        <ToastProvider>
          <Navbar />
          <div className="h-24 md:h-28 lg:h-28" />
          <main suppressHydrationWarning>{children}</main>
          <Footer />
          <WhatsappButton />
        </ToastProvider>
      </body>
    </html>
  );
}
