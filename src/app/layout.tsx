import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Rajdhani } from "next/font/google";
import AppLoader from "@/components/app-loader";
import { PageTransitionProvider } from "@/components/page-transition-provider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Platinum",
  description: "Luxury vehicle rentals for discerning drivers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        data-app-loading="true"
        className={`${montserrat.variable} ${rajdhani.variable} ${geistMono.variable} antialiased bg-black text-zinc-100`}
      >
        <AppLoader />
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
