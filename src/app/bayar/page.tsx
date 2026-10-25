import type { Metadata } from "next";
import { Suspense } from "react";
import { BayarClient } from "@/components/BayarClient";

export const metadata: Metadata = {
  title: "Pembayaran",
  description: "Selesaikan pembayaran pesanan Chaizenhub dengan QRIS.",
};

export default function BayarPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
      <BayarClient />
    </Suspense>
  );
}
