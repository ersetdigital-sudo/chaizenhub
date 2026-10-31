"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ADMIN_WHATSAPP, ADMIN_WHATSAPP_URL } from "@/lib/catalog";

type Category = "Pembayaran" | "Pesanan" | "Akun";
type Tab = Category | "Semua";

type FaqItem = {
  category: Category;
  question: string;
  answer: string;
  keywords: string;
};

const categories: { name: Category; description: string }[] = [
  { name: "Pembayaran", description: "QRIS, biaya, verifikasi" },
  { name: "Pesanan", description: "Status, invoice, kendala" },
  { name: "Akun", description: "Tanpa daftar akun" },
];

const tabs: Tab[] = ["Semua", "Pembayaran", "Pesanan", "Akun"];

const faqs: FaqItem[] = [
  {
    category: "Pembayaran",
    question: "Metode bayar apa saja?",
    answer: "QRIS — bisa dari semua e-wallet dan m-banking.",
    keywords: "qris bayar pembayaran ewallet mbanking transfer metode",
  },
  {
    category: "Pembayaran",
    question: "Ada biaya tambahan?",
    answer: "Tidak. Harga yang tampil sudah total, tanpa biaya tersembunyi.",
    keywords: "biaya admin tambahan gratis harga total",
  },
  {
    category: "Pembayaran",
    question: "Pembayaran saya dicek manual?",
    answer:
      "Ya. Admin memverifikasi pembayaran QRIS secara manual. Setelah menekan Saya sudah bayar, status pesanan menjadi Sedang diproses.",
    keywords: "manual verifikasi cek konfirmasi status proses",
  },
  {
    category: "Pesanan",
    question: "Berapa lama pesanan diproses?",
    answer:
      "Setelah pembayaran terkonfirmasi, pesanan biasanya diproses dalam hitungan detik.",
    keywords: "lama proses cepat masuk delay tunggu",
  },
  {
    category: "Pesanan",
    question: "Cara cek status pesanan?",
    answer:
      "Buka halaman Cek Invoice, lalu masukkan kode CHZ- yang muncul setelah pembayaran.",
    keywords: "invoice cek status lacak kode czh pesanan",
  },
  {
    category: "Pesanan",
    question: "Salah isi nomor tujuan?",
    answer:
      "Transaksi yang sudah sukses tidak bisa dibatalkan. Periksa nomor sebelum membayar.",
    keywords: "salah nomor tujuan ganti batal ubah",
  },
  {
    category: "Pesanan",
    question: "Pesanan gagal, uangnya ke mana?",
    answer: "Dana dikembalikan otomatis ke metode pembayaran awal.",
    keywords: "gagal refund dana kembali uang",
  },
  {
    category: "Akun",
    question: "Harus daftar akun?",
    answer: "Tidak. Simpan saja kode invoice untuk melacak pesanan.",
    keywords: "akun daftar login register",
  },
];

function matchesQuery(item: FaqItem, needle: string) {
  if (!needle) return true;
  return `${item.category} ${item.question} ${item.answer} ${item.keywords}`
    .toLowerCase()
    .includes(needle);
}

function countForTab(tab: Tab, needle: string) {
  const items = tab === "Semua" ? faqs : faqs.filter((item) => item.category === tab);
  return items.filter((item) => matchesQuery(item, needle)).length;
}

function spanFor(index: number, total: number) {
  if (total === 1) return "lg:col-span-12";
  if (total === 2) return "lg:col-span-6";
  if (index === 0) return "lg:col-span-5";
  if (index === 1) return "lg:col-span-7";
  return "lg:col-span-12";
}

function SearchIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.8-.6-3.1-1.3-5.1-4.4-5.3-4.6-.1-.2-1.2-1.6-1.2-3.1s.7-2.2 1-2.5c.2-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.4.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2 1c.2.1.4.2.4.3.1.2.1.6-.1 1.1Z" />
    </svg>
  );
}

function CategoryIcon({ category }: { category: Category }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {category === "Pembayaran" ? (
        <>
          <rect x="3" y="6" width="18" height="13" rx="3" />
          <path d="M3 10h18M16 15h2" />
        </>
      ) : category === "Pesanan" ? (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </>
      ) : (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </>
      )}
    </svg>
  );
}

function ContactTicket() {
  return (
    <aside id="kontak" aria-label="Kontak bantuan" className="rise" style={{ animationDelay: "0.12s" }}>
      <div className="relative rounded-[28px] bg-sangria text-cosmic shadow-[8px_8px_0_#F3CFC9]">
        <span
          className="pointer-events-none absolute right-6 top-6 h-28 w-28 rounded-full bg-blush/15"
          aria-hidden="true"
        />

        <div className="relative p-6 md:p-7">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cosmic/65">
            <span className="h-1.5 w-1.5 rounded-full bg-blush" />
            Loket bantuan
          </p>
          <h2 className="disp mt-4 text-2xl font-bold leading-tight md:text-[1.75rem]">
            Butuh jawaban dari manusia?
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cosmic/75">
            Admin Chaizenhub bantu cek pembayaran, invoice, dan kendala pesanan.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <a
              href={ADMIN_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat admin via WhatsApp"
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-cosmic px-3 py-3 text-sm font-bold text-ink transition hover:bg-blush sm:gap-2 sm:px-4"
            >
              <WhatsAppIcon />
              Chat admin
            </a>
            <Link
              href="/invoice/"
              className="inline-flex items-center justify-center rounded-2xl border border-cosmic/25 px-4 py-3 text-sm font-semibold text-cosmic transition hover:bg-cosmic/10"
            >
              Cek invoice →
            </Link>
          </div>
        </div>

        <div className="relative border-t border-dashed border-cosmic/25 px-6 py-5 md:px-7">
          <span
            className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-cosmic"
            aria-hidden="true"
          />
          <span
            className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-cosmic"
            aria-hidden="true"
          />
          <p className="text-[11px] uppercase tracking-widest text-cosmic/55">
            Admin · WhatsApp
          </p>
          <p className="mt-1 text-sm font-semibold tracking-wide">{ADMIN_WHATSAPP}</p>
          <p className="mt-1 text-xs text-cosmic/60">
            Sertakan kode invoice CHZ- agar cepat dicek.
          </p>
        </div>
      </div>
    </aside>
  );
}

function FaqGroup({
  name,
  description,
  items,
  className,
  wide,
}: {
  name: Category;
  description: string;
  items: FaqItem[];
  className: string;
  wide: boolean;
}) {
  return (
    <section className={`cardx rounded-[28px] p-5 md:p-6 ${className}`}>
      <div className={wide ? "lg:flex lg:gap-10" : ""}>
        <div className={wide ? "lg:w-[32%] lg:shrink-0" : ""}>
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blush/60 text-sangria">
              <CategoryIcon category={name} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="disp text-xl font-bold">{name}</h3>
              <p className="mt-0.5 text-xs text-mute">{description}</p>
            </div>
            <span className="shrink-0 rounded-full bg-cosmic px-3 py-1 text-[11px] font-semibold text-mute">
              {items.length} pertanyaan
            </span>
          </div>
        </div>

        <div
          className={`mt-5 border-t border-black/10 ${
            wide ? "lg:mt-0 lg:flex-1 lg:border-t-0" : ""
          }`}
        >
          {items.map((item) => (
            <details key={item.question} className="border-b border-black/10 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[15px] font-medium leading-snug transition-colors hover:text-sangria">
                {item.question}
                <span
                  className="pl grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blush/50 text-lg leading-none text-sangria transition"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 pr-10 text-sm leading-relaxed text-mute">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BantuanClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Tab>("Semua");
  const tabsRef = useRef<HTMLDivElement>(null);
  const needle = query.trim().toLowerCase();

  const filtered = faqs.filter((item) => {
    if (category !== "Semua" && item.category !== category) return false;
    return matchesQuery(item, needle);
  });

  const visibleGroups = categories
    .map((group) => ({
      ...group,
      items: filtered.filter((item) => item.category === group.name),
    }))
    .filter((group) => group.items.length > 0);

  const hasFilter = needle.length > 0 || category !== "Semua";
  const resultLabel = needle
    ? `${filtered.length} hasil untuk “${query.trim()}”${
        category === "Semua" ? "" : ` di ${category}`
      }`
    : `${filtered.length} pertanyaan di ${category}`;

  function resetFilters() {
    setQuery("");
    setCategory("Semua");
    tabsRef.current?.scrollTo({ left: 0 });
  }

  return (
    <main className="relative z-10">
      <section className="relative">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-10 md:pt-16 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
          <div className="rise">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sangria md:text-xs">
              Pusat bantuan
            </p>
            <h1 className="disp mt-4 max-w-xl text-4xl font-extrabold leading-[1.02] sm:text-5xl md:text-6xl">
              Ada yang bisa dibantu?
            </h1>
            <p className="mt-4 max-w-lg text-mute md:text-lg">
              Cari jawaban soal QRIS, invoice, dan pesanan. Kalau masih bingung, admin
              siap bantu.
            </p>

            <div className="mt-8 max-w-xl">
              <label htmlFor="faq-search" className="sr-only">
                Cari pertanyaan
              </label>
              <div className="flex items-center gap-2 rounded-[22px] border border-line bg-white p-2 transition focus-within:border-sangria focus-within:ring-4 focus-within:ring-sangria/10">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cosmic text-sangria">
                  <SearchIcon />
                </span>
                <input
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setQuery("");
                  }}
                  placeholder="Cari: QRIS, invoice, refund…"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-mute/70 focus-visible:outline-none! [&::-webkit-search-cancel-button]:hidden"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Hapus pencarian"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-mute transition hover:bg-cosmic hover:text-ink"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                  </button>
                ) : null}
              </div>

              {needle ? (
                <p aria-live="polite" className="mt-3 text-xs text-mute">
                  {filtered.length} hasil untuk “{query.trim()}”.{" "}
                  <a
                    href="#faq"
                    className="inline-block py-1 font-semibold text-sangria underline decoration-blush decoration-2 underline-offset-4"
                  >
                    Lihat jawaban ↓
                  </a>
                </p>
              ) : (
                <a
                  href="#faq"
                  className="mt-3 inline-block py-1 text-xs font-semibold text-sangria underline decoration-blush decoration-2 underline-offset-4"
                >
                  Lihat semua topik ↓
                </a>
              )}
            </div>
          </div>

          <ContactTicket />
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-16 pt-12 md:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-sangria">FAQ</p>
            <h2 className="disp mt-2 text-3xl font-bold md:text-4xl">
              Jawaban cepat, <span className="text-mute">tanpa muter-muter.</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-mute">
            <p>{hasFilter ? resultLabel : "Klik pertanyaan untuk lihat jawaban."}</p>
            {hasFilter ? (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-sangria transition hover:bg-white"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>

        <div
          ref={tabsRef}
          role="group"
          aria-label="Filter topik"
          className="-mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-1 text-sm md:mx-0 md:flex-wrap md:px-0"
        >
          {tabs.map((tab) => {
            const isActive = category === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setCategory(tab)}
                aria-pressed={isActive}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 transition ${
                  isActive
                    ? "bg-ink text-white"
                    : "border border-black/10 bg-white/50 text-mute hover:text-ink"
                }`}
              >
                {tab}
                <span className={isActive ? "text-[11px] text-white/55" : "text-[11px] text-mute/70"}>
                  {countForTab(tab, needle)}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            {visibleGroups.map((group, index) => (
              <FaqGroup
                key={group.name}
                name={group.name}
                description={group.description}
                items={group.items}
                className={spanFor(index, visibleGroups.length)}
                wide={
                  visibleGroups.length === 1 ||
                  (visibleGroups.length === 3 && index === 2)
                }
              />
            ))}
          </div>
        ) : (
          <div className="cardx mt-6 rounded-[28px] border-dashed p-8 text-center md:p-12">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blush/60 text-sangria">
              <SearchIcon className="h-6 w-6" />
            </span>
            <p className="disp mt-5 text-2xl font-bold">Belum ketemu jawabannya</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-mute">
              Tidak ada hasil untuk “{query.trim()}”. Coba kata kunci lain, atau tanya
              admin langsung.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-black/15 px-5 py-2.5 text-sm hover:bg-black/5"
              >
                Reset filter
              </button>
              <a
                href={ADMIN_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sangria rounded-full px-5 py-2.5 text-sm"
              >
                Chat admin
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
