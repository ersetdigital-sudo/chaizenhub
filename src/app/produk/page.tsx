import type { Metadata } from "next";
import { Suspense } from "react";
import { ProdukClient } from "@/components/ProdukClient";

export const metadata: Metadata = {
  title: "Produk",
  description:
    "Pilih produk, isi nomor tujuan, dan bayar via QRIS. Pulsa, paket data, token PLN, game, dan tagihan bulanan.",
};

export default function ProdukPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
      <ProdukClient />
    </Suspense>
  );
}
