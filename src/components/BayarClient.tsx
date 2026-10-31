"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ADMIN_WHATSAPP,
  ADMIN_WHATSAPP_URL,
  formatRupiah,
  isSlug,
  QRIS_IMAGE,
  services,
} from "@/lib/catalog";
import { createOrder } from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import { rememberInvoice } from "@/lib/store";
import { ServiceIcon } from "./ServiceIcon";

function clock(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60,
  ).padStart(2, "0")}`;
}

export function BayarClient({
  brandSlug,
  qrisMethodId,
  qrisImageUrl,
}: {
  brandSlug: string;
  qrisMethodId: string | null;
  qrisImageUrl: string | null;
}) {
  const params = useSearchParams();
  const requested = params.get("s");
  const slug = isSlug(requested) ? requested : null;
  const service = slug ? services[slug] : null;
  const item = params.get("i") ?? "";
  const provider = params.get("p") ?? "";
  const target = params.get("n") ?? "";
  const amount = Number(params.get("a")) || 0;
  const serviceId = params.get("sid") ?? "";
  const productId = params.get("pid") ?? "";
  const valid = !!service && !!provider && !!item && !!target && amount > 0;

  const [inv, setInv] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [expiresAt, setExpiresAt] = useState(0);
  const [left, setLeft] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [creating, setCreating] = useState(false);
  const [payError, setPayError] = useState("");
  const [paid, setPaid] = useState(false);
  const createdRef = useRef(false);

  async function create() {
    if (!service || !valid) return;
    if (!serviceId || !productId) {
      setPayError("Data pesanan belum lengkap. Ulangi dari halaman produk.");
      createdRef.current = false;
      return;
    }
    if (!brandSlug || !qrisMethodId) {
      setPayError("Pembayaran belum tersedia. Coba lagi sebentar.");
      createdRef.current = false;
      return;
    }

    setCreating(true);
    setPayError("");
    try {
      const created = await createOrder({
        brandSlug,
        serviceId,
        productId,
        nomorTujuan: target.trim(),
        input: { provider, item, nomor_tujuan: target.trim() },
        paymentMethodId: qrisMethodId,
      });
      const expiry = new Date(created.expires_at).getTime();
      setInv(created.ref);
      setOrderTotal(created.total);
      setExpiresAt(expiry);
      setLeft(Math.max(1, Math.ceil((expiry - Date.now()) / 1000)));
      setTimedOut(false);
      rememberInvoice(created.ref);
    } catch (failure) {
      setPayError(toPublicError(failure).message);
      createdRef.current = false;
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (!valid || createdRef.current) return;
    createdRef.current = true;
    void create();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid]);

  useEffect(() => {
    if (!expiresAt || paid) return;
    const tick = () => {
      const next = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setLeft(next);
      if (next <= 0) setTimedOut(true);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, paid]);

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

  const displayTotal = inv ? orderTotal : amount;
  const waConfirm = `${ADMIN_WHATSAPP_URL}?text=${encodeURIComponent(
    `Halo admin Chaizenhub, saya sudah bayar QRIS${inv ? ` untuk invoice ${inv}` : ""}.`,
  )}`;
  const payDisabled = creating || !inv || timedOut;

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-5 pb-40 pt-8 md:pt-12 lg:pb-10">
      <p className="text-sm text-mute">Pembayaran</p>
      <h1 className="disp mt-1 text-3xl font-bold md:text-4xl">Satu langkah lagi</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {paid ? (
            <section className="cardx rounded-[28px] p-6 md:p-8">
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
                    Admin akan memverifikasi pembayaran QRIS Anda. Simpan kode invoice
                    untuk melacak pesanan.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-cosmic p-5">
                <p className="text-xs uppercase tracking-widest text-mute">
                  Kode invoice
                </p>
                <p className="disp mt-1 text-2xl font-bold">{inv || "—"}</p>
                <p className="mt-2 text-sm text-mute">
                  Total {formatRupiah(displayTotal)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/invoice/?id=${inv}`}
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

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cosmic px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-mute">
                    Kode invoice
                  </p>
                  <p className="disp text-lg font-bold">
                    {inv || (creating ? "Menyiapkan…" : "—")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-mute">
                    Selesaikan dalam
                  </p>
                  <p className="disp text-lg font-bold">
                    {!inv ? "—" : timedOut ? "Waktu habis" : clock(left)}
                  </p>
                </div>
              </div>

              {payError ? (
                <div className="mt-4 rounded-2xl border border-sangria/30 bg-blush/30 p-4 text-xs">
                  <p className="font-bold text-sangria">{payError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!creating) {
                        createdRef.current = true;
                        void create();
                      }
                    }}
                    className="mt-2 rounded-full border border-sangria px-3 py-1.5 font-bold text-sangria"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : null}

              <div className="mt-5 grid items-center gap-6 rounded-2xl border border-line bg-white p-4 sm:grid-cols-[220px_1fr] sm:p-6">
                <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-xl border border-line bg-white">
                  <img
                    src={qrisImageUrl || QRIS_IMAGE}
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
                    {formatRupiah(displayTotal)}
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

              <button
                type="button"
                onClick={() => setPaid(true)}
                disabled={payDisabled}
                className="btn-sangria mt-5 w-full rounded-2xl py-4 disabled:cursor-not-allowed"
              >
                {creating ? "Menyiapkan…" : "Saya sudah bayar"}
              </button>

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
              <span className="disp text-2xl font-bold">{formatRupiah(displayTotal)}</span>
            </div>

            {paid || inv ? (
              <div className="mt-6 rounded-2xl bg-cosmic p-4 text-sm">
                <p className="text-xs uppercase tracking-widest text-mute">Status</p>
                <p className="mt-1 inline-flex items-center gap-2 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sangria" />
                  {paid ? "Sedang diproses" : "Menunggu pembayaran"}
                </p>
                {inv ? (
                  <p className="mt-1 text-xs text-mute">Invoice {inv}</p>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPaid(true)}
                disabled={payDisabled}
                className="btn-sangria mt-6 hidden w-full rounded-2xl py-4 disabled:cursor-not-allowed lg:block"
              >
                {creating ? "Menyiapkan…" : "Saya sudah bayar"}
              </button>
            )}

            <p className="mt-4 text-center text-xs text-mute">
              Pembayaran diverifikasi manual oleh admin
            </p>
          </div>
        </aside>
      </div>

      {paid ? null : (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#FFF8E7]/95 px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-mute">Total bayar</p>
              <p className="disp text-xl font-bold">{formatRupiah(displayTotal)}</p>
            </div>
            <button
              type="button"
              onClick={() => setPaid(true)}
              disabled={payDisabled}
              className="btn-sangria rounded-2xl px-5 py-3.5 text-sm disabled:cursor-not-allowed"
            >
              {creating ? "Menyiapkan…" : "Saya sudah bayar"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
