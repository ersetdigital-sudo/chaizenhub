import type { Metadata } from "next";
import { Instrument_Sans, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const display = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-schibsted",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3006"),
  title: {
    default: "Chaizenhub · Top up & bayar tagihan",
    template: "%s · Chaizenhub",
  },
  description:
    "Pulsa, kuota, token listrik, diamond game sampai tagihan bulanan. Ketik nomor, bayar via QRIS, beres.",
  openGraph: {
    title: "Chaizenhub · Top up & bayar tagihan",
    description:
      "Pulsa, kuota, token listrik, diamond game sampai tagihan bulanan. Ketik nomor, bayar via QRIS, beres.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
