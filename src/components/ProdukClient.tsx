"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  detectOperator,
  formatRupiah,
  isSlug,
  normalizePhone,
  priceList,
  services,
  simulateBill,
  type PriceItem,
  type Slug,
} from "@/lib/catalog";
import { ProviderAvatar } from "./ProviderAvatar";
import { ServiceIcon } from "./ServiceIcon";

export function ProdukClient() {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("s");
  const slug: Slug = isSlug(requested) ? requested : "pulsa";
  const service = services[slug];
  const query = params.toString();

  const [target, setTarget] = useState(params.get("n") ?? "");
  const [provider, setProvider] = useState<string | null>(
    service.auto ? null : service.providers[0],
  );
  const [item, setItem] = useState<PriceItem | null>(null);

  useEffect(() => {
    const nextService = services[slug];
    setProvider(nextService.auto ? null : nextService.providers[0]);
    setItem(null);
    setTarget(new URLSearchParams(query).get("n") ?? "");
  }, [slug, query]);

  const list = priceList(service, provider);
  const billAmount =
    service.bill && target.trim().length > 5
      ? simulateBill(target + (provider ?? ""))
      : null;
  const billItem: PriceItem | null =
    billAmount !== null ? [`Tagihan ${provider}`, billAmount] : null;
  const effectiveItem = service.bill ? billItem : item;
  const targetValid = service.auto
    ? normalizePhone(target).length >= 10
    : target.trim().length >= 6;
  const canPay = targetValid && !!provider && !!effectiveItem;

  const hint = service.auto
    ? "Operator terdeteksi otomatis dari 4 digit pertama."
    : service.bill
      ? "Tagihan muncul otomatis setelah ID diisi."
      : "Pastikan data benar, transaksi sukses tidak bisa dibatalkan.";

  function handleTarget(value: string) {
    setTarget(value);
    if (!service.auto) return;

    const detected = detectOperator(value);
    if (detected !== provider) {
      setProvider(detected);
      setItem(null);
    }
  }

  function handleProvider(name: string) {
    setProvider(name);
    setItem(null);
  }

  function handlePay() {
    if (!provider || !effectiveItem) return;
    const next = new URLSearchParams({
      s: slug,
      p: provider,
      i: effectiveItem[0],
      n: target.trim(),
      a: String(effectiveItem[1]),
    });
    router.push(`/bayar/?${next.toString()}`);
  }

  const summary = [
    ["Produk", service.title],
    ["Provider", provider ?? "–"],
    ["Item", effectiveItem?.[0] ?? "–"],
    ["Tujuan", target.trim() || "–"],
  ];

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 pb-40 pt-5 sm:px-5 md:pb-12 md:pt-10">
      <Link
        href="/#produk"
        className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-sangria"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Semua produk
      </Link>

      <section className="rise relative mt-4 overflow-hidden rounded-[28px] bg-sangria p-6 text-cosmic md:p-10">
        <span
          className="absolute -right-14 -top-14 h-28 w-28 rotate-12 rounded-[48px] bg-blush md:-right-10 md:-top-10 md:h-64 md:w-64"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-6 right-24 hidden h-6 w-6 rounded-full bg-cosmic/30 md:block"
          aria-hidden="true"
        />

        <div className="relative flex items-start gap-4 md:gap-6">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-cosmic text-sangria md:h-20 md:w-20 md:rounded-3xl">
            <ServiceIcon slug={slug} className="h-7 w-7 md:h-9 md:w-9" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cosmic/70 md:text-xs">
              {service.category}
            </p>
            <h1 className="disp text-3xl font-extrabold leading-tight md:text-5xl">
              {service.title}
            </h1>
            <p className="mt-2 max-w-md text-sm text-cosmic/80 md:text-base">
              {service.description}
            </p>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-2 text-xs md:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cosmic/15 px-3 py-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
            </svg>
            Proses ±5 detik
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cosmic/15 px-3 py-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />
            </svg>
            Gagal = refund
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cosmic/15 px-3 py-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            Buka 24 jam
          </span>
        </div>
      </section>

      <div className="mt-5 grid items-start gap-5 md:mt-6 md:gap-6 lg:grid-cols-[1fr_370px]">
        <div className="space-y-4 md:space-y-5">
          <section
            className={`step rise cardx rounded-[24px] p-5 md:p-7 ${targetValid ? "done" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="num">1</span>
              <label htmlFor="target" className="text-lg font-semibold">
                {service.inputLabel}
              </label>
            </div>

            <div className="relative mt-4">
              <input
                id="target"
                inputMode={service.auto ? "numeric" : "text"}
                autoComplete={service.auto ? "tel" : "off"}
                value={target}
                onChange={(event) => handleTarget(event.target.value)}
                placeholder={service.placeholder}
                className={`inp w-full rounded-2xl py-4 pl-5 text-lg tracking-wide ${
                  service.auto && provider ? "pr-32" : "pr-5"
                }`}
              />
              {service.auto && provider ? (
                <span className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-blush px-3 py-1.5 text-xs font-bold text-ink">
                  <ProviderAvatar name={provider} />
                  {provider} ✓
                </span>
              ) : null}
            </div>
            <p className="mt-2.5 text-xs text-mute">{hint}</p>
          </section>

          {service.auto ? null : (
            <section
              className={`step rise cardx rounded-[24px] p-5 md:p-7 ${provider ? "done" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="num">2</span>
                <p className="text-lg font-semibold">Pilih provider</p>
              </div>
              <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
                {service.providers.map((name) => {
                  const isActive = provider === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleProvider(name)}
                      aria-pressed={isActive}
                      className={`chip opt flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-medium ${
                        isActive ? "on" : ""
                      }`}
                    >
                      <span className="av grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-cosmic text-sangria">
                        <ProviderAvatar name={name} />
                      </span>
                      {name}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section
            className={`step rise cardx rounded-[24px] p-5 md:p-7 ${effectiveItem ? "done" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="num">{service.auto ? "2" : "3"}</span>
              <p className="text-lg font-semibold">
                {service.bill ? "Tagihan kamu" : "Pilih nominal"}
              </p>
            </div>

            {service.bill ? (
              billItem ? (
                <div className="opt on mt-4 flex items-center justify-between gap-4 rounded-2xl p-5">
                  <div>
                    <b>{billItem[0]}</b>
                    <p className="mt-1 text-xs text-mute">
                      Pelanggan •••{target.trim().slice(-4)} · termasuk admin Rp2.500 ·
                      contoh
                    </p>
                  </div>
                  <b className="disp whitespace-nowrap text-xl">
                    {formatRupiah(billItem[1])}
                  </b>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-black/15 bg-cosmic p-5 text-sm text-mute">
                  Isi {service.inputLabel.toLowerCase()} dulu, tagihan muncul otomatis.
                </div>
              )
            ) : service.auto && !provider ? (
              <div className="mt-4 rounded-2xl border border-dashed border-black/15 bg-cosmic p-5 text-sm text-mute">
                Ketik nomor HP dulu, nominal muncul sesuai operatormu.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3">
                {list.map((option, index) => {
                  const isSelected = item?.[0] === option[0];
                  return (
                    <button
                      key={option[0]}
                      type="button"
                      onClick={() => setItem(option)}
                      aria-pressed={isSelected}
                      className={`nom opt flex min-h-[84px] flex-col justify-between rounded-2xl p-4 text-left ${
                        isSelected ? "on" : ""
                      }`}
                    >
                      <span className="ck" aria-hidden="true">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                          <path d="m5 12 5 5 9-10" />
                        </svg>
                      </span>
                      {index === Math.min(2, list.length - 1) ? (
                        <span className="mb-2 self-start rounded-full bg-blush px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          Populer
                        </span>
                      ) : (
                        <span className="invisible mb-2 self-start rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          Populer
                        </span>
                      )}
                      <b className="block pr-5 text-base leading-snug">{option[0]}</b>
                      <span className="mt-1 text-sm font-semibold text-sangria">
                        {formatRupiah(option[1])}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="sticky top-24 hidden lg:block">
          <div className="glass rounded-[24px] p-7">
            <p className="disp text-xl font-bold">Ringkasan</p>
            <dl className="mt-5 space-y-3 text-sm">
              {summary.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-mute">{label}</dt>
                  <dd className="truncate text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-end justify-between border-t border-dashed border-black/15 pt-5">
              <span className="text-sm text-mute">Total bayar</span>
              <span className="disp text-3xl font-extrabold">
                {effectiveItem ? formatRupiah(effectiveItem[1]) : "Rp0"}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePay}
              disabled={!canPay}
              className="btn-sangria mt-6 w-full rounded-2xl py-4 text-base"
            >
              Lanjut bayar →
            </button>
            <p className="mt-3 text-center text-xs text-mute">
              Tanpa daftar akun · bayar via QRIS
            </p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(10px,env(safe-area-inset-bottom))] lg:hidden">
        <div className="flex items-center gap-3 rounded-[22px] bg-ink py-2 pl-5 pr-2 text-cosmic shadow-[0_14px_30px_-12px_rgba(30,10,8,0.5)]">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-cosmic/60">
              {effectiveItem
                ? `${provider} · ${effectiveItem[0]}`
                : targetValid
                  ? "Pilih nominal dulu"
                  : `Isi ${service.inputLabel.toLowerCase()} dulu`}
            </p>
            <p className="disp text-lg font-bold leading-tight">
              {effectiveItem ? formatRupiah(effectiveItem[1]) : "Rp0"}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePay}
            disabled={!canPay}
            className="rounded-2xl bg-cosmic px-5 py-3.5 font-bold text-sangria disabled:opacity-40"
          >
            Bayar →
          </button>
        </div>
      </div>
    </main>
  );
}
