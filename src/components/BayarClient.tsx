"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import {
  ADMIN_WHATSAPP,
  ADMIN_WHATSAPP_URL,
  formatRupiah,
  isSlug,
  QRIS_IMAGE,
  services,
} from "@/lib/catalog";
import { createOrder, type Order } from "@/lib/store";
import { ServiceIcon } from "./ServiceIcon";

export function BayarClient() {
  const params = useSearchParams();
  const requested = params.get("s");
  const slug = isSlug(requested) ? requested : null;
  const service = slug ? services[slug] : null;
  const item = params.get("i") ?? "";
  const provider = params.get("p") ?? "";
  const target = params.get("n") ?? "";
  const amount = Number(params.get("a")) || 0;
  const valid = !!service && !!provider && !!item && !!target && amount > 0;

  const [order, setOrder] = useState<Order | null>(null);
  const saving = useRef(false);

  function confirmPayment() {
    if (saving.current || !slug || !service || !valid) return;
    saving.current = true;
    const created = createOrder({
      slug,
      title: service.title,
      item,
      provider,
      target,
      amount,
    });
    setOrder(created);
  }

  if (!service || !valid) {
    return (
      <main className="relative z-10 mx-auto max-w-3xl px-5 pt-12 md:pt-20">
        <div className="cardx rounded-[28px] p-10 text-center">
          <p className="disp text-2xl font-bold">Belum ada pesanan</p>
          <p className="mt-2 text-mute">Pilih produk dulu ya.</p>
          <Link
            href="/#produk"
            className="btn-sangria mt-6 inline-block rounded-full px-6 py-3"
          >
            Lihat produk
          </Link>
        </div>
      </main>
    );
  }

  const waConfirm = `${ADMIN_WHATSAPP_URL}?text=${encodeURIComponent(
    `Halo admin Chaizenhub, saya sudah bayar QRIS${order ? ` untuk invoice ${order.id}` : ""}.`,
  )}`;

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-5 pb-40 pt-8 md:pt-12 lg:pb-10">
      <p className="text-sm text-mute">Pembayaran</p>
      <h1 className="disp mt-1 text-3xl font-bold md:text-4xl">Satu langkah lagi</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {order ? (
            <section
              className="cardx rounded-[28px] p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sangria text-cosmic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </span>
                <div>
                  <p aria-live="polite" className="disp text-2xl font-bold leading-tight">
                    Terima kasih, pembayaran Anda sedang diproses
                  </p>
                  <p className="mt-2 text-sm text-mute">
                    Admin akan memverifikasi pembayaran QRIS Anda secara manual.
                    Simpan kode invoice untuk melacak pesanan.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-cosmic p-5">
                <p className="text-xs uppercase tracking-widest text-mute">
                  Kode invoice
                </p>
                <p className="disp mt-1 text-2xl font-bold">{order.id}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/invoice/?id=${order.id}`}
                    className="btn-sangria rounded-full px-5 py-2.5 text-sm"
                  >
                    Cek status
                  </Link>
                  <a
                    href={waConfirm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-black/15 px-5 py-2.5 text-sm hover:bg-black/5"
                  >
                    Konfirmasi via WhatsApp
                  </a>
                </div>
              </div>
            </section>
          ) : (
            <section className="cardx rounded-[28px] p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">Pembayaran QRIS</p>
                  <p className="mt-1 text-sm text-mute">
                    Scan dari e-wallet atau m-banking apa pun.
                  </p>
                </div>
                <span className="rounded-full bg-blush px-3 py-1.5 text-xs font-bold">
                  QRIS
                </span>
              </div>

              <div className="mt-6 grid items-center gap-6 rounded-2xl border border-line bg-white p-4 sm:grid-cols-[220px_1fr] sm:p-6">
                <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-xl border border-line bg-white">
                  <img
                    src={QRIS_IMAGE}
                    alt="QRIS pembayaran Chaizenhub"
                    width={440}
                    height={440}
                    className="h-auto w-full"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-mute">
                    Total bayar
                  </p>
                  <p className="disp mt-1 text-3xl font-extrabold">
                    {formatRupiah(amount)}
                  </p>
                  <ol className="mt-4 space-y-2 text-sm text-mute">
                    <li>1. Buka e-wallet atau m-banking.</li>
                    <li>2. Scan QRIS di samping.</li>
                    <li>3. Bayar sesuai nominal.</li>
                    <li>4. Tekan “Saya sudah bayar”.</li>
                  </ol>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-mute">
                <span className="rounded-full bg-cosmic px-3 py-1.5">Semua e-wallet</span>
                <span className="rounded-full bg-cosmic px-3 py-1.5">Semua m-banking</span>
                <span className="rounded-full bg-cosmic px-3 py-1.5">
                  Verifikasi manual admin
                </span>
              </div>

              <p className="mt-5 rounded-2xl bg-cosmic p-4 text-xs text-mute">
                Bayar sesuai nominal agar pesanan mudah diverifikasi. Jika status belum
                berubah, hubungi admin lewat WhatsApp.
              </p>
            </section>
          )}

          <section className="cardx rounded-[28px] p-6 md:p-8">
            <p className="text-lg font-semibold">Butuh bantuan?</p>
            <p className="mt-2 text-sm text-mute">
              Admin Chaizenhub siap membantu cek pembayaran atau kendala pesanan.
            </p>
            <a
              href={ADMIN_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-sm hover:bg-black/5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.8-.6-3.1-1.3-5.1-4.4-5.3-4.6-.1-.2-1.2-1.6-1.2-3.1s.7-2.2 1-2.5c.2-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.4.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2 1c.2.1.4.2.4.3.1.2.1.6-.1 1.1Z" />
              </svg>
              WhatsApp {ADMIN_WHATSAPP}
            </a>
          </section>
        </div>

        <aside>
          <div className="glass rounded-[28px] p-7 lg:sticky lg:top-24">
            <p className="disp font-bold">Pesanan</p>

            <div className="mt-5 flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sangria text-white">
                <ServiceIcon slug={service.slug} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <b className="block truncate">
                  {service.title} · {item}
                </b>
                <p className="truncate text-xs text-mute">
                  {provider} · {target}
                </p>
              </div>
            </div>

            <dl className="mt-6 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-mute">Harga</dt>
                <dd>{formatRupiah(amount)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mute">Biaya layanan</dt>
                <dd>Gratis</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mute">Metode</dt>
                <dd>QRIS</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-end justify-between border-t border-dashed border-black/10 pt-5">
              <span className="text-sm text-mute">Total</span>
              <span className="disp text-2xl font-bold">{formatRupiah(amount)}</span>
            </div>

            {order ? (
              <div className="mt-6 rounded-2xl bg-cosmic p-4 text-sm">
                <p className="text-xs uppercase tracking-widest text-mute">Status</p>
                <p className="mt-1 inline-flex items-center gap-2 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sangria" />
                  Sedang diproses
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={confirmPayment}
                className="btn-sangria mt-6 hidden w-full rounded-2xl py-4 lg:block"
              >
                Saya sudah bayar
              </button>
            )}

            <p className="mt-4 text-center text-xs text-mute">
              Pembayaran diverifikasi manual oleh admin
            </p>
          </div>
        </aside>
      </div>

      {order ? null : (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#FFF8E7]/95 px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-mute">Total bayar</p>
              <p className="disp text-xl font-bold">{formatRupiah(amount)}</p>
            </div>
            <button
              type="button"
              onClick={confirmPayment}
              className="btn-sangria rounded-2xl px-5 py-3.5 text-sm"
            >
              Saya sudah bayar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
