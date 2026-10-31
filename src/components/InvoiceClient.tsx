"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ADMIN_WHATSAPP_URL, formatRupiah } from "@/lib/catalog";
import { getRecentInvoices } from "@/lib/store";

type PublicStatus = "success" | "processing" | "pending" | "expired";

type InvoiceOrder = {
  inv: string;
  status: PublicStatus;
  service: string;
  product: string;
  lines: [string, string][];
  method: string;
  total: number;
  sn: string;
  label: string;
  created: number;
  updated: number;
  paidAt?: number;
};

type Result = { code: string; order: InvoiceOrder | null };

const statusText: Record<PublicStatus, string> = {
  pending: "Menunggu pembayaran",
  processing: "Sedang diproses",
  success: "Selesai",
  expired: "Dibatalkan",
};

function formatDate(value: number) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function InvoiceClient() {
  const params = useSearchParams();
  const initialId = params.get("id") ?? "";
  const [code, setCode] = useState(initialId);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecentInvoices());
  }, []);

  const show = useCallback(async (value: string) => {
    const id = value.trim().toUpperCase();
    if (!id) return;
    setCode(id);
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        setResult({ code: id, order: null });
        return;
      }
      const order = (await response.json()) as InvoiceOrder;
      setResult({ code: id, order });
    } catch {
      setResult({ code: id, order: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialId) void show(initialId);
  }, [initialId, show]);

  return (
    <main className="relative z-10 mx-auto max-w-2xl px-5 pb-20 pt-12 md:pt-20">
      <h1 className="disp text-center text-3xl font-bold md:text-5xl">
        Lacak pesananmu
      </h1>
      <p className="mt-3 text-center text-mute">
        Masukkan kode invoice yang diawali <b className="text-ink">CHZ-</b>
      </p>

      <form
        className="glass mt-8 flex rounded-full p-2"
        onSubmit={(event) => {
          event.preventDefault();
          void show(code);
        }}
      >
        <label htmlFor="invoice-code" className="sr-only">
          Kode invoice
        </label>
        <input
          id="invoice-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="CHZ-XXXXXX"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent px-5 uppercase outline-none placeholder:normal-case"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-sangria rounded-full px-6 py-3"
        >
          {loading ? "Mencari…" : "Cek"}
        </button>
      </form>

      <div className="mt-8">
        {result ? (
          result.order ? (
            <OrderCard order={result.order} />
          ) : (
            <div className="cardx rounded-3xl p-6 text-center text-mute">
              Invoice <b className="text-ink">{result.code || "–"}</b> tidak ditemukan.
              Pastikan kode sudah benar.
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
            {recent.map((ref) => (
              <button
                key={ref}
                type="button"
                onClick={() => void show(ref)}
                className="opt flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left text-sm"
              >
                <span className="min-w-0 truncate font-mono">{ref}</span>
                <span className="shrink-0 text-mute">Cek status →</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}

function OrderCard({ order }: { order: InvoiceOrder }) {
  const rows: [string, string][] = [
    ...order.lines,
    ["Metode", order.method],
    ["Waktu", formatDate(order.created)],
    ["Total", formatRupiah(order.total)],
  ];
  const waUrl = `${ADMIN_WHATSAPP_URL}?text=${encodeURIComponent(
    `Halo admin Chaizenhub, saya ingin cek invoice ${order.inv}.`,
  )}`;

  return (
    <article className="cardx overflow-hidden rounded-[28px]">
      <div className="bg-sangria p-7 text-cosmic">
        <p className="text-xs font-semibold opacity-70">INVOICE</p>
        <p className="disp mt-1 text-2xl font-bold">{order.inv}</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cosmic px-3 py-1.5 text-xs font-semibold text-sangria">
          <span className="h-1.5 w-1.5 rounded-full bg-sangria" />
          {statusText[order.status]}
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

      {order.sn ? (
        <div className="mx-7 mb-5 rounded-2xl border border-sangria/20 bg-cosmic p-4">
          <p className="text-xs uppercase tracking-widest text-mute">{order.label}</p>
          <p className="disp mt-1 break-all text-lg font-bold text-sangria">
            {order.sn}
          </p>
        </div>
      ) : null}

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
            href="/#produk"
            className="rounded-full border border-black/15 px-5 py-2.5 hover:bg-black/5"
          >
            Buat pesanan baru
          </Link>
        </div>
      </div>
    </article>
  );
}
