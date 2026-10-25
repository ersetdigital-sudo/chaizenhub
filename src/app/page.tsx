import type { CSSProperties } from "react";
import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { ProductExplorer } from "@/components/ProductExplorer";
import { QuickTopup } from "@/components/QuickTopup";
import { WordRotator } from "@/components/WordRotator";

const transactions = [
  "0812•••21 · Pulsa 50rb",
  "Mobile Legends · 172 Diamonds",
  "Token PLN 100rb",
  "0857•••90 · Kuota 15GB",
  "DANA · 100rb",
  "Free Fire · 355 Diamonds",
  "BPJS Kelas 3",
];

const faq = [
  {
    question: "Perlu daftar akun?",
    answer: "Nggak. Cukup isi nomor tujuan, bayar, dan simpan kode invoice.",
  },
  {
    question: "Berapa lama prosesnya?",
    answer:
      "Pembayaran QRIS dicek admin secara manual. Setelah terkonfirmasi, pesanan diproses dalam hitungan detik.",
  },
  {
    question: "Kalau gagal gimana?",
    answer: "Dana dikembalikan otomatis ke metode pembayaranmu.",
  },
  {
    question: "Metode bayar apa saja?",
    answer: "QRIS — bisa dari semua e-wallet dan m-banking.",
  },
];

export default function HomePage() {
  return (
    <main className="relative z-10">
      <section className="relative">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />

        <span
          className="shp hidden md:block"
          style={{
            top: "12%",
            left: "46%",
            width: 70,
            height: 70,
            borderRadius: 22,
            background: "#F3CFC9",
            "--r": "12deg",
          } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="shp hidden md:block"
          style={{
            top: "68%",
            left: "4%",
            width: 26,
            height: 26,
            borderRadius: 99,
            background: "#930500",
            "--r": "0deg",
            animationDelay: "-2s",
          } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="shp hidden md:block"
          style={{
            top: "78%",
            left: "52%",
            width: 44,
            height: 44,
            borderRadius: 99,
            border: "6px solid #F3CFC9",
            "--r": "0deg",
            animationDelay: "-4s",
          } as CSSProperties}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 pb-12 pt-10 md:pb-16 md:pt-24 lg:grid-cols-[1.15fr_1fr]">
          <div className="rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-xs text-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-sangria" />
              Sistem online 24 jam
            </p>

            <h1 className="disp mt-6 text-[2.4rem] font-extrabold leading-[1.02] sm:text-5xl md:text-7xl">
              <span className="wd" style={{ "--d": ".1s" } as CSSProperties}>
                Top
              </span>{" "}
              <span className="wd" style={{ "--d": ".2s" } as CSSProperties}>
                up
              </span>{" "}
              <span className="wd" style={{ "--d": ".3s" } as CSSProperties}>
                apa
              </span>{" "}
              <span className="wd" style={{ "--d": ".4s" } as CSSProperties}>
                aja,
              </span>
              <br />
              <span className="wd" style={{ "--d": ".55s" } as CSSProperties}>
                tanpa
              </span>{" "}
              <WordRotator />
            </h1>

            <p className="mt-5 max-w-md text-base text-mute md:text-lg">
              Pulsa, kuota, token listrik, diamond game sampai tagihan bulanan. Ketik
              nomor, bayar, beres.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 md:mt-10 md:flex md:gap-8">
              <div>
                <p className="disp text-2xl font-bold">
                  <CountUp to={9} />
                </p>
                <p className="mt-1 text-xs text-mute">kategori produk</p>
              </div>
              <div>
                <p className="disp text-2xl font-bold">24/7</p>
                <p className="mt-1 text-xs text-mute">transaksi otomatis</p>
              </div>
              <div>
                <p className="disp text-2xl font-bold">0</p>
                <p className="mt-1 text-xs text-mute">akun wajib</p>
              </div>
            </div>
          </div>

          <div
            className="rise glass rounded-[28px] p-6 md:p-8"
            style={{ animationDelay: "0.35s" }}
          >
            <p className="text-sm text-mute">Order kilat</p>
            <p className="disp mt-1 text-xl font-bold">Isi pulsa sekarang</p>
            <div className="mt-6">
              <QuickTopup />
            </div>
          </div>
        </div>
      </section>

      <div className="marq-wrap overflow-hidden border-y border-black/5 py-4">
        <div className="marq flex w-max gap-10 whitespace-nowrap text-sm text-mute">
          {[...transactions, ...transactions].map((transaction, index) => (
            <span
              key={`${transaction}-${index}`}
              className="flex items-center gap-2"
              aria-hidden={index >= transactions.length}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sangria" />
              {transaction}
            </span>
          ))}
        </div>
      </div>

      <ProductExplorer />

      <section className="mx-auto max-w-6xl px-5 pt-20 md:pt-28">
        <h2 className="disp max-w-xl text-3xl font-bold md:text-5xl">
          Tiga langkah, <span className="text-mute">nggak lebih.</span>
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[28px] bg-black/5 md:grid-cols-3">
          <div className="bg-cream p-6 md:p-8">
            <p className="disp text-4xl font-extrabold text-black/10 md:text-5xl">01</p>
            <p className="mt-6 text-lg font-semibold">Pilih produk</p>
            <p className="mt-2 text-sm text-mute">
              Ketik nomor atau ID, operator dan harga langsung muncul.
            </p>
          </div>
          <div className="bg-cream p-6 md:p-8">
            <p className="disp text-4xl font-extrabold text-black/10 md:text-5xl">02</p>
            <p className="mt-6 text-lg font-semibold">Bayar</p>
            <p className="mt-2 text-sm text-mute">
              Scan QRIS dari e-wallet atau m-banking favoritmu.
            </p>
          </div>
          <div className="bg-cream p-6 md:p-8">
            <p className="disp text-4xl font-extrabold text-sangria md:text-5xl">03</p>
            <p className="mt-6 text-lg font-semibold">Langsung masuk</p>
            <p className="mt-2 text-sm text-mute">
              Simpan kode invoice untuk lacak transaksi kapan saja.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pt-20 md:pt-28 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-sm text-sangria">FAQ</p>
          <h2 className="disp mt-2 text-3xl font-bold md:text-4xl">
            Pertanyaan yang sering mampir
          </h2>
          <Link
            href="/bantuan/"
            className="mt-6 inline-block rounded-full border border-black/15 px-5 py-2.5 text-sm hover:bg-black/5"
          >
            Pusat bantuan →
          </Link>
        </div>

        <div className="divide-y divide-black/10 border-y border-black/10">
          {faq.map((item) => (
            <details key={item.question} className="py-5">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-lg">
                {item.question}
                <span className="pl text-2xl text-sangria transition" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-mute">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
