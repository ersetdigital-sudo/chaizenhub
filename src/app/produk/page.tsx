import type { Metadata } from "next";
import { Suspense } from "react";
import { ProdukClient } from "@/components/ProdukClient";
import { getHydratedService } from "@/lib/catalog-hydrate";
import { isSlug, services } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Produk",
  description:
    "Pilih produk, isi nomor tujuan, dan bayar via QRIS. Pulsa, paket data, token PLN, game, dan tagihan bulanan.",
};

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string | string[] }>;
}) {
  const params = await searchParams;
  const requested = Array.isArray(params.s) ? params.s[0] : params.s;
  const slug = isSlug(requested) ? requested : "pulsa";
  const { service } = await getHydratedService(slug);

  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
      <ProdukClient key={slug} service={service ?? services[slug]} />
    </Suspense>
  );
}
