"use client";

import Link from "next/link";
import { useState } from "react";
import { services, serviceSlugs, type Category } from "@/lib/catalog";
import { ServiceIcon } from "./ServiceIcon";

const tabs: { label: string; value: Category | null }[] = [
  { label: "Semua", value: null },
  { label: "Isi ulang", value: "Isi ulang" },
  { label: "Tagihan", value: "Tagihan" },
  { label: "Hiburan", value: "Hiburan" },
];

export function ProductExplorer() {
  const [filter, setFilter] = useState<Category | null>(null);
  const cards = serviceSlugs
    .map((slug) => services[slug])
    .filter((service) => !filter || service.category === filter);

  return (
    <section id="produk" className="mx-auto max-w-6xl px-5 pt-16 md:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-sangria">Produk</p>
          <h2 className="disp mt-2 text-3xl font-bold md:text-5xl">
            Mau bayar apa hari ini?
          </h2>
        </div>

        <div className="flex max-w-full gap-2 overflow-x-auto text-sm">
          {tabs.map((tab) => {
            const isActive = filter === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setFilter(tab.value)}
                aria-pressed={isActive}
                className={`whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-ink text-white"
                    : "border border-black/10 text-mute hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((service, index) => {
          const large = !filter && index === 0;

          return (
            <Link
              key={service.slug}
              href={`/produk/?s=${service.slug}`}
              className={`group cardx flex min-h-[140px] flex-col justify-between rounded-3xl p-4 transition md:min-h-[170px] md:p-6 ${
                large
                  ? "col-span-2 row-span-2 border-sangria bg-sangria text-cosmic hover:bg-sangria-deep"
                  : "hover:border-sangria/40"
              }`}
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl transition ${
                  large
                    ? "bg-cosmic text-sangria"
                    : "bg-black/5 text-sangria group-hover:bg-sangria group-hover:text-white"
                }`}
              >
                <ServiceIcon slug={service.slug} />
              </span>

              <div>
                <p
                  className={`text-[11px] uppercase tracking-widest ${
                    large ? "text-cosmic/70" : "text-mute"
                  }`}
                >
                  {service.category}
                </p>
                <p
                  className={`disp mt-1 font-bold ${
                    large ? "text-2xl md:text-3xl" : "text-base md:text-lg"
                  }`}
                >
                  {service.title}
                </p>
                {large ? (
                  <p className="mt-2 max-w-xs text-sm text-cosmic/75">
                    {service.description}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
