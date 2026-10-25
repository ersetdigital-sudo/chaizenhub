"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_WHATSAPP_URL, formatRupiah } from "@/lib/catalog";
import { findOrder, getOrders, type Order } from "@/lib/store";

type Result = { code: string; order: Order | null };

export function InvoiceClient() {
  const params = useSearchParams();
  const initialId = params.get("id") ?? "";
  const [code, setCode] = useState(initialId);
  const [result, setResult] = useState<Result | null>(null);
  const [recent, setRecent] = useState<Order[]>([]);

  useEffect(() => {
    setRecent(getOrders().slice(0, 5));
  }, []);

  useEffect(() => {
    if (!initialId) return;
    const id = initialId.trim().toUpperCase();
    setResult({ code: id, order: findOrder(id) });
  }, [initialId]);

  function show(value: string) {
    const id = value.trim().toUpperCase();
    setResult({ code: id, order: findOrder(id) });
  }

  return (
    <main className="relative z-10 mx-auto max-w-2xl px-5 pb-20 pt-12 md:pt-20">
      <h1 className="disp text-center text-3xl font-bold md:text-5xl">
        Lacak pesananmu
      </h1>
      <p className="mt-3 text-center text-mute">
        Masukkan kode invoice yang diawali <b className="text-ink">CZH-</b>
      </p>

      <form
        className="glass mt-8 flex rounded-full p-2"
        onSubmit={(event) => {
          event.preventDefault();
          show(code);
        }}
      >
        <label htmlFor="invoice-code" className="sr-only">
          Kode invoice
        </label>
        <input
          id="invoice-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="CZH-XXXXXXX"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent px-5 uppercase outline-none placeholder:normal-case"
        />
        <button type="submit" className="btn-sangria rounded-full px-6 py-3">
          Cek
        </button>
      </form>

      <div className="mt-8">
        {result ? (
          result.order ? (
            <OrderCard order={result.order} />
          ) : (
            <div className="cardx rounded-3xl p-6 text-center text-mute">
              Invoice <b className="text-ink">{result.code || "–"}</b> tidak ditemukan
              di perangkat ini.
              <Link
                href="/#produk"
                className="mt-4 block text-sm font-semibold text-sangria"
              >
                Buat pesanan baru →
              </Link>
            </div>
          )
        ) : null}
      </div>

      {recent.length ? (
        <div className="mt-10">
          <p className="mb-3 text-sm text-mute">Riwayat di perangkat ini</p>
          <div className="space-y-2">
            {recent.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => {
                  setCode(order.id);
                  show(order.id);
                }}
                className="opt flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left text-sm"
              >
                <span className="min-w-0 truncate">
                  {order.title} · {order.item}
                </span>
                <span className="shrink-0 text-mute">{order.id}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}

function OrderCard({ order }: { order: Order }) {
  const rows = [
    ["Produk", `${order.title} · ${order.item}`],
    ["Provider", order.provider],
    ["Tujuan", order.target],
    ["Metode", order.method],
    [
      "Waktu",
      new Date(order.createdAt).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    ],
    ["Total", formatRupiah(order.amount)],
  ];
  const waUrl = `${ADMIN_WHATSAPP_URL}?text=${encodeURIComponent(
    `Halo admin Chaizenhub, saya ingin cek invoice ${order.id}.`,
  )}`;

  return (
    <article className="cardx overflow-hidden rounded-[28px]">
      <div className="bg-sangria p-7 text-cosmic">
        <p className="text-xs font-semibold opacity-70">INVOICE</p>
        <p className="disp mt-1 text-2xl font-bold">{order.id}</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cosmic px-3 py-1.5 text-xs font-semibold text-sangria">
          <span className="h-1.5 w-1.5 rounded-full bg-sangria" />
          Sedang diproses
        </p>
      </div>

      <dl className="space-y-3 p-7 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-mute">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="px-7 pb-7">
        <p className="rounded-2xl bg-cosmic p-4 text-xs text-mute">
          Pembayaran diverifikasi manual oleh admin. Simpan kode invoice ini untuk cek
          status kapan saja.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sangria rounded-full px-5 py-2.5"
          >
            Konfirmasi via WhatsApp
          </a>
          <Link
            href={`/produk/?s=${order.slug}`}
            className="rounded-full border border-black/15 px-5 py-2.5 hover:bg-black/5"
          >
            Beli lagi
          </Link>
        </div>
      </div>
    </article>
  );
}
