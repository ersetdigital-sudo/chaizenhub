"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const navigation = [
  { href: "/", label: "Beranda" },
  { href: "/#produk", label: "Produk" },
  { href: "/invoice/", label: "Cek Invoice" },
  { href: "/bantuan/", label: "Bantuan" },
];

function activeLabel(pathname: string) {
  if (pathname === "/") return "Beranda";
  if (pathname.startsWith("/produk")) return "Produk";
  if (pathname.startsWith("/invoice")) return "Cek Invoice";
  if (pathname.startsWith("/bantuan")) return "Bantuan";
  return "";
}

export function SiteHeader() {
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  const active = activeLabel(pathname);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#FFF8E7]/85 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5">
        <div className="justify-self-start">
          <Logo />
        </div>

        <nav
          className="hidden rounded-full border border-black/5 bg-white/70 p-1 text-sm md:flex"
          aria-label="Navigasi utama"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active === item.label ? "page" : undefined}
              className={`rounded-full px-4 py-2 transition-colors ${
                active === item.label
                  ? "bg-ink text-cosmic"
                  : "text-mute hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <span className="md:hidden" />

        <div className="flex items-center gap-2 justify-self-end">
          <Link
            href="/#produk"
            className="btn-sangria hidden whitespace-nowrap rounded-full px-5 py-2.5 text-sm md:inline-block"
          >
            Top up
          </Link>
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white md:hidden"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-black/5 bg-cosmic px-5 py-4 md:hidden">
          <div className="grid gap-1">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active === item.label ? "page" : undefined}
                className={`rounded-2xl px-4 py-3 text-base font-medium ${
                  active === item.label ? "bg-ink text-cosmic" : "bg-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/#produk"
            onClick={() => setOpen(false)}
            className="btn-sangria mt-3 block rounded-2xl py-3.5 text-center"
          >
            Top up sekarang
          </Link>
        </div>
      ) : null}
    </header>
  );
}
