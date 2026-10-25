"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_WHATSAPP, ADMIN_WHATSAPP_URL, services, serviceSlugs } from "@/lib/catalog";
import { Logo } from "./Logo";

export function SiteFooter() {
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  const hideOnMobile = pathname === "/produk" || pathname === "/bayar";

  return (
    <footer
      className={`${hideOnMobile ? "hidden md:block" : ""} relative z-10 mt-24 border-t border-black/5`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-mute">
            Pusat top up & bayar tagihan digital. Cepat, transparan, tanpa daftar akun.
          </p>
        </div>

        <div className="space-y-2.5 text-sm">
          <p className="mb-3 font-semibold">Produk</p>
          {serviceSlugs.slice(0, 5).map((slug) => (
            <Link
              key={slug}
              className="block text-mute hover:text-ink"
              href={`/produk/?s=${slug}`}
            >
              {services[slug].title}
            </Link>
          ))}
        </div>

        <div className="space-y-2.5 text-sm">
          <p className="mb-3 font-semibold">Bantuan</p>
          <Link className="block text-mute hover:text-ink" href="/invoice/">
            Cek invoice
          </Link>
          <Link className="block text-mute hover:text-ink" href="/bantuan/">
            Pusat bantuan
          </Link>
          <a
            className="block text-mute hover:text-ink"
            href={ADMIN_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp {ADMIN_WHATSAPP}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 pb-8 text-xs text-mute">
        <span>© 2026 Chaizenhub</span>
        <span>QRIS · E-Wallet · M-Banking · 24 jam</span>
      </div>
    </footer>
  );
}
